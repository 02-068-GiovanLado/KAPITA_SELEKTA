'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('alerts', [
      // Bambang Hartono - Kritis
      {
        patient_id: 3,
        alert_type: 'Kritis',
        description: 'Tekanan darah sangat tinggi (165/100 mmHg).',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 3,
        alert_type: 'Kritis',
        description: 'Gula darah sangat tinggi (210 mg/dL).',
        created_at: new Date(),
        updated_at: new Date()
      },
      // Putri Ayu - Perhatian
      {
        patient_id: 4,
        alert_type: 'Perhatian',
        description: 'Kenaikan berat badan sedikit melambat.',
        created_at: new Date(),
        updated_at: new Date()
      },
      // Sri Mulyani - Perhatian
      {
        patient_id: 6,
        alert_type: 'Perhatian',
        description: 'Tekanan darah cenderung tinggi (150/92 mmHg).',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('alerts', null, {});
  }
};
