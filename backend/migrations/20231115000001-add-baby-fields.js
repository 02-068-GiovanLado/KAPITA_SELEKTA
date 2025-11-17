'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new fields for baby patients
    await queryInterface.addColumn('patients', 'birth_date', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('patients', 'mother_nik', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('patients', 'child_nik', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    await queryInterface.addColumn('patients', 'family_card_number', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('patients', 'birth_date');
    await queryInterface.removeColumn('patients', 'mother_nik');
    await queryInterface.removeColumn('patients', 'child_nik');
    await queryInterface.removeColumn('patients', 'family_card_number');
  }
};
