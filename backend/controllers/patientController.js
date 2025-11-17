const { Patient, Checkup, Alert, Vitamin, sequelize } = require('../models');
const { Op } = require('sequelize');

// Helper function to calculate age from birth date
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Adjust if the birth day hasn't occurred yet this month
  if (today.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }
  
  if (years > 0) {
    return `${years} tahun ${months} bulan`;
  } else {
    return `${months} bulan`;
  }
};

// GET /api/stats - Dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const totalPatients = await Patient.count();
    const totalBabies = await Patient.count({ where: { category: 'Bayi' } });
    const totalAdults = await Patient.count({ where: { category: 'Dewasa' } });
    const activeAlerts = await Patient.count({
      where: {
        status: {
          [Op.in]: ['Kritis', 'Perlu Perhatian']
        }
      }
    });

    res.json({
      totalPatients,
      totalBabies,
      totalAdults,
      activeAlerts
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/alerts/recent - Get recent alerts with patient details
exports.getRecentAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['id', 'name', 'category']
        }
      ]
    });

    const formattedAlerts = alerts.map(alert => ({
      id: alert.id,
      alertType: alert.alert_type,
      description: alert.description,
      createdAt: alert.created_at,
      patient: {
        id: alert.patient.id,
        name: alert.patient.name,
        category: alert.patient.category
      }
    }));

    res.json(formattedAlerts);
  } catch (error) {
    console.error('Error getting recent alerts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/patients - Get all patients with optional category filter and name search
exports.getAllPatients = async (req, res) => {
  try {
    const { category, name } = req.query;
    const whereClause = {};

    if (category) {
      whereClause.category = category;
    }

    // Add name search with partial matching
    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`
      };
    }

    const patients = await Patient.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    res.json(patients);
  } catch (error) {
    console.error('Error getting patients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/patients/:id - Get patient details with all associations
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id, {
      include: [
        {
          model: Checkup,
          as: 'checkups',
          order: [['date', 'DESC']]
        },
        {
          model: Alert,
          as: 'alerts',
          order: [['created_at', 'DESC']]
        },
        {
          model: Vitamin,
          as: 'vitamins',
          order: [['date', 'ASC']]
        }
      ]
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Sort checkups by date descending after retrieval
    if (patient.checkups) {
      patient.checkups.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    res.json(patient);
  } catch (error) {
    console.error('Error getting patient by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/patients - Create new patient with initial checkup (using transaction)
exports.createPatient = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      name,
      age,
      gender,
      category,
      nik,
      guardian_name,
      birth_date,
      mother_nik,
      child_nik,
      family_card_number,
      status,
      checkup
    } = req.body;

    // Validate required fields
    if (!name || !gender || !category) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Missing required fields: name, gender, category'
      });
    }

    // Calculate age from birth_date if provided for Bayi category
    let calculatedAge = age;
    if (category === 'Bayi' && birth_date) {
      calculatedAge = calculateAge(birth_date);
    }

    // Create patient
    const patient = await Patient.create(
      {
        name,
        age: calculatedAge,
        gender,
        category,
        nik,
        guardian_name,
        birth_date,
        mother_nik,
        child_nik,
        family_card_number,
        status: status || 'Stabil',
        last_checkup_date: null
      },
      { transaction }
    );

    // Create initial checkup if provided
    if (checkup) {
      await Checkup.create(
        {
          patient_id: patient.id,
          date: checkup.date || new Date(),
          weight: checkup.weight,
          height: checkup.height,
          head_circumference: checkup.head_circumference,
          blood_pressure: checkup.blood_pressure,
          blood_sugar: checkup.blood_sugar
        },
        { transaction }
      );
    }

    // Commit transaction
    await transaction.commit();

    // Fetch the created patient with all associations
    const createdPatient = await Patient.findByPk(patient.id, {
      include: [
        { model: Checkup, as: 'checkups' },
        { model: Alert, as: 'alerts' },
        { model: Vitamin, as: 'vitamins' }
      ]
    });

    res.status(201).json(createdPatient);
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// POST /api/patients/:id/checkups - Add checkup for a patient
exports.createCheckup = async (req, res) => {
  try {
    const { id } = req.params;
    const { weight, height, head_circumference, blood_pressure, blood_sugar, date } = req.body;

    console.log('Creating checkup for patient:', id);
    console.log('Request body:', req.body);

    // Check if patient exists
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Create checkup
    const checkupData = {
      patient_id: parseInt(id),
      date: date || new Date(),
      weight: weight ? parseFloat(weight) : null,
      height: height ? parseFloat(height) : null,
      head_circumference: head_circumference ? parseFloat(head_circumference) : null,
      blood_pressure: blood_pressure || null,
      blood_sugar: blood_sugar ? parseInt(blood_sugar) : null
    };

    console.log('Checkup data to create:', checkupData);

    const checkup = await Checkup.create(checkupData);

    // Update patient's last_checkup_date
    await patient.update({ last_checkup_date: checkup.date });

    res.status(201).json({
      message: 'Checkup created successfully',
      checkup,
      patient: {
        id: patient.id,
        name: patient.name,
        category: patient.category
      }
    });
  } catch (error) {
    console.error('Error creating checkup:', error);
    console.error('Error details:', error.errors);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      validationErrors: error.errors?.map(e => ({ field: e.path, message: e.message }))
    });
  }
};

// POST /api/patients/:id/vitamins - Create new vitamin record for a patient
exports.createVitamin = async (req, res) => {
  try {
    const { id } = req.params;
    const { vitamin_name, status, date } = req.body;

    console.log('Creating vitamin for patient:', id);
    console.log('Request body:', req.body);

    // Check if patient exists
    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Validate required fields
    if (!vitamin_name || !status) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'vitamin_name and status are required'
      });
    }

    // Create vitamin record
    const vitaminData = {
      patient_id: parseInt(id),
      vitamin_name: vitamin_name,
      status: status,
      date: date || new Date()
    };

    console.log('Vitamin data to create:', vitaminData);

    const vitamin = await Vitamin.create(vitaminData);

    res.status(201).json({
      message: 'Vitamin record created successfully',
      id: vitamin.id,
      patient_id: vitamin.patient_id,
      vitamin_name: vitamin.vitamin_name,
      status: vitamin.status,
      date: vitamin.date
    });
  } catch (error) {
    console.error('Error creating vitamin:', error);
    console.error('Error details:', error.errors);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      validationErrors: error.errors?.map(e => ({ field: e.path, message: e.message }))
    });
  }
};

// PUT /api/patients/:id - Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const patient = await Patient.findByPk(id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // If birth_date is updated for a baby, recalculate age
    if (updateData.birth_date && patient.category === 'Bayi') {
      updateData.age = calculateAge(updateData.birth_date);
    }

    await patient.update(updateData);

    res.json({
      message: 'Patient updated successfully',
      patient
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// DELETE /api/patients/:id - Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    await patient.destroy();

    res.json({
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// PUT /api/checkups/:id - Update checkup
exports.updateCheckup = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const checkup = await Checkup.findByPk(id);
    
    if (!checkup) {
      return res.status(404).json({ error: 'Checkup not found' });
    }

    await checkup.update(updateData);

    res.json({
      message: 'Checkup updated successfully',
      checkup
    });
  } catch (error) {
    console.error('Error updating checkup:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// PUT /api/vitamins/:id - Update vitamin
exports.updateVitamin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const vitamin = await Vitamin.findByPk(id);
    
    if (!vitamin) {
      return res.status(404).json({ error: 'Vitamin not found' });
    }

    await vitamin.update(updateData);

    res.json({
      message: 'Vitamin updated successfully',
      vitamin
    });
  } catch (error) {
    console.error('Error updating vitamin:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};
