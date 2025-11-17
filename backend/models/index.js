const sequelize = require('../config/database');
const Patient = require('./Patient');
const Checkup = require('./Checkup');
const Alert = require('./Alert');
const Vitamin = require('./Vitamin');

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

Patient.hasMany(Vitamin, {
  foreignKey: 'patient_id',
  as: 'vitamins'
});
Vitamin.belongsTo(Patient, {
  foreignKey: 'patient_id',
  as: 'patient'
});

module.exports = {
  sequelize,
  Patient,
  Checkup,
  Alert,
  Vitamin
};
