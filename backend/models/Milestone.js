const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Milestone extends Model {}

Milestone.init(
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
    milestone_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    achieved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Milestone',
    tableName: 'milestones',
    timestamps: true,
    underscored: true
  }
);

module.exports = Milestone;
