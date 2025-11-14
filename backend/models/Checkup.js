const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Checkup extends Model {}

Checkup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Weight in kg'
    },
    height: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Height in cm'
    },
    head_circumference: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Head circumference in cm (for babies)'
    },
    blood_pressure: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Blood pressure (e.g., 120/80)'
    },
    blood_sugar: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Blood sugar in mg/dL'
    }
  },
  {
    sequelize,
    modelName: 'Checkup',
    tableName: 'checkups',
    timestamps: true,
    underscored: true
  }
);

module.exports = Checkup;
