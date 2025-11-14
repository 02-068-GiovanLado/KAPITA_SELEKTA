const { Patient, Checkup, Alert, Immunization, Milestone, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /api/stats - Dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const totalPatients = await Patient.count();
    const totalBabies = await Patient.count({ where: { category: 'Bayi' } });
    const totalAdults = await Patient.count({ where: { category: 'Dewasa' } });
    const totalElders = await Patient.count({ where: { category: 'Lansia' } });
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
      totalElders,
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

// GET /api/patients - Get all patients with optional category filter
exports.getAllPatients = async (req, res) => {
  try {
    const { category } = req.query;
    const whereClause = {};

    if (category) {
      whereClause.category = category;
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
          model: Immunization,
          as: 'immunizations',
          order: [['date', 'ASC']]
        },
        {
          model: Milestone,
          as: 'milestones',
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
      status,
      checkup
    } = req.body;

    // Validate required fields
    if (!name || !age || !gender || !category) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Missing required fields: name, age, gender, category'
      });
    }

    // Create patient
    const patient = await Patient.create(
      {
        name,
        age,
        gender,
        category,
        nik,
        guardian_name,
        status: status || 'Stabil',
        last_checkup_date: new Date()
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
        { model: Immunization, as: 'immunizations' },
        { model: Milestone, as: 'milestones' }
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
