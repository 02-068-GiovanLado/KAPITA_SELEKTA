const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Patient extends Model {}

Patient.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    age: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('Laki-laki', 'Perempuan'),
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('Bayi', 'Dewasa', 'Lansia'),
      allowNull: false
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    guardian_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_checkup_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('Stabil', 'Perlu Perhatian', 'Kritis'),
      allowNull: false,
      defaultValue: 'Stabil'
    }
  },
  {
    sequelize,
    modelName: 'Patient',
    tableName: 'patients',
    timestamps: true,
    underscored: true
  }
);

module.exports = Patient;
