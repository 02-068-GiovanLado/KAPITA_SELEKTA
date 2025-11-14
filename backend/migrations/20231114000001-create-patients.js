'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('patients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      age: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('Laki-laki', 'Perempuan'),
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('Bayi', 'Dewasa', 'Lansia'),
        allowNull: false
      },
      nik: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      guardian_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      last_checkup_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('Stabil', 'Perlu Perhatian', 'Kritis'),
        allowNull: false,
        defaultValue: 'Stabil'
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
    await queryInterface.addIndex('patients', ['category']);
    await queryInterface.addIndex('patients', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('patients');
  }
};
