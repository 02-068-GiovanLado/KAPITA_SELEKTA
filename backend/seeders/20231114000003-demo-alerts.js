'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('alerts', [
      // Putri Ayu - Perhatian
      {
        patient_id: 4,
        alert_type: 'Perhatian',
        description: 'Kenaikan berat badan sedikit melambat.',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('alerts', null, {});
  }
};
