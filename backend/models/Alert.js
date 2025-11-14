const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Alert extends Model {}

Alert.init(
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
    alert_type: {
      type: DataTypes.ENUM('Kritis', 'Perhatian'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Alert',
    tableName: 'alerts',
    timestamps: true,
    underscored: true
  }
);

module.exports = Alert;
