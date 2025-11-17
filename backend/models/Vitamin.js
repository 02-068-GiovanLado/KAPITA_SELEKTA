const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Vitamin extends Model {}

Vitamin.init(
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
    vitamin_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Selesai', 'Terjadwal', 'Tertunda'),
      allowNull: false,
      defaultValue: 'Terjadwal'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Vitamin',
    tableName: 'vitamins',
    timestamps: true,
    underscored: true
  }
);

module.exports = Vitamin;
