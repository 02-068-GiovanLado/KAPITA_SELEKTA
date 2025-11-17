const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const patientController = require('../controllers/patientController');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/stats
router.get('/stats', patientController.getStats);

// GET /api/alerts/recent
router.get('/alerts/recent', patientController.getRecentAlerts);

// GET /api/patients (with optional ?category= query param)
router.get('/patients', [
  query('category').optional().isIn(['Bayi', 'Dewasa', 'Lansia']),
  query('name').optional().trim().escape(),
  validate
], patientController.getAllPatients);

// GET /api/patients/:id
router.get('/patients/:id', [
  param('id').isInt(),
  validate
], patientController.getPatientById);

// POST /api/patients
router.post('/patients', [
  body('name').notEmpty().trim().escape().withMessage('Nama wajib diisi'),
  body('gender').isIn(['Laki-laki', 'Perempuan']).withMessage('Jenis kelamin tidak valid'),
  body('category').isIn(['Bayi', 'Dewasa', 'Lansia']).withMessage('Kategori tidak valid'),
  body('age').optional().trim(),
  body('birth_date').optional().isISO8601().withMessage('Format tanggal tidak valid'),
  body('nik').optional().trim().isLength({ min: 16, max: 16 }).withMessage('NIK harus 16 digit'),
  body('mother_nik').optional().trim().isLength({ min: 16, max: 16 }),
  body('child_nik').optional().trim().isLength({ min: 16, max: 16 }),
  body('family_card_number').optional().trim().isLength({ min: 16, max: 16 }),
  validate
], patientController.createPatient);

// PUT /api/patients/:id - Update patient
router.put('/patients/:id', [
  param('id').isInt(),
  body('name').optional().trim().escape(),
  body('gender').optional().isIn(['Laki-laki', 'Perempuan']),
  body('category').optional().isIn(['Bayi', 'Dewasa', 'Lansia']),
  body('age').optional().trim(),
  body('birth_date').optional().isISO8601(),
  validate
], patientController.updatePatient);

// DELETE /api/patients/:id - Delete patient
router.delete('/patients/:id', [
  param('id').isInt(),
  validate
], patientController.deletePatient);

// POST /api/patients/:id/checkups - Add checkup for a patient
router.post('/patients/:id/checkups', [
  param('id').isInt(),
  body('date').optional().isISO8601(),
  body('weight').optional().isFloat({ min: 0 }),
  body('height').optional().isFloat({ min: 0 }),
  validate
], patientController.createCheckup);

// PUT /api/checkups/:id - Update checkup
router.put('/checkups/:id', [
  param('id').isInt(),
  body('date').optional().isISO8601(),
  body('weight').optional().isFloat({ min: 0 }),
  body('height').optional().isFloat({ min: 0 }),
  validate
], patientController.updateCheckup);

// POST /api/patients/:id/vitamins - Add vitamin for a patient
router.post('/patients/:id/vitamins', [
  param('id').isInt(),
  body('vitamin_name').notEmpty().trim().escape(),
  body('date').optional().isISO8601(),
  body('status').optional().isIn(['Selesai', 'Terjadwal', 'Tertunda']),
  validate
], patientController.createVitamin);

// PUT /api/vitamins/:id - Update vitamin
router.put('/vitamins/:id', [
  param('id').isInt(),
  body('vitamin_name').optional().trim().escape(),
  body('date').optional().isISO8601(),
  body('status').optional().isIn(['Selesai', 'Terjadwal', 'Tertunda']),
  validate
], patientController.updateVitamin);

module.exports = router;
