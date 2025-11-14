'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('checkups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'patients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      weight: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      height: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      head_circumference: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      blood_pressure: {
        type: Sequelize.STRING,
        allowNull: true
      },
      blood_sugar: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add index for faster queries
    await queryInterface.addIndex('checkups', ['patient_id']);
    await queryInterface.addIndex('checkups', ['date']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('checkups');
  }
};
