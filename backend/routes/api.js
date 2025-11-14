const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// GET /api/stats
router.get('/stats', patientController.getStats);

// GET /api/alerts/recent
router.get('/alerts/recent', patientController.getRecentAlerts);

// GET /api/patients (with optional ?category= query param)
router.get('/patients', patientController.getAllPatients);

// GET /api/patients/:id
router.get('/patients/:id', patientController.getPatientById);

// POST /api/patients
router.post('/patients', patientController.createPatient);

module.exports = router;
