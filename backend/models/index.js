const sequelize = require('../config/database');
const Patient = require('./Patient');
const Checkup = require('./Checkup');
const Alert = require('./Alert');
const Immunization = require('./Immunization');
const Milestone = require('./Milestone');

// Define associations
Patient.hasMany(Checkup, {
  foreignKey: 'patient_id',
  as: 'checkups'
});
Checkup.belongsTo(Patient, {
  foreignKey: 'patient_id',
  as: 'patient'
});

Patient.hasMany(Alert, {
  foreignKey: 'patient_id',
  as: 'alerts'
});
Alert.belongsTo(Patient, {
  foreignKey: 'patient_id',
  as: 'patient'
});

Patient.hasMany(Immunization, {
  foreignKey: 'patient_id',
  as: 'immunizations'
});
Immunization.belongsTo(Patient, {
  foreignKey: 'patient_id',
  as: 'patient'
});

Patient.hasMany(Milestone, {
  foreignKey: 'patient_id',
  as: 'milestones'
});
Milestone.belongsTo(Patient, {
  foreignKey: 'patient_id',
  as: 'patient'
});

module.exports = {
  sequelize,
  Patient,
  Checkup,
  Alert,
  Immunization,
  Milestone
};
