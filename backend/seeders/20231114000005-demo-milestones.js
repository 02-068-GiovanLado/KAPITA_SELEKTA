'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('milestones', [
      // Ahmad Budi - Bayi (8 bulan)
      {
        patient_id: 1,
        milestone_name: 'Mengangkat kepala',
        achieved: true,
        date: new Date('2023-04-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 1,
        milestone_name: 'Duduk dengan bantuan',
        achieved: true,
        date: new Date('2023-06-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 1,
        milestone_name: 'Merangkak',
        achieved: true,
        date: new Date('2023-09-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 1,
        milestone_name: 'Berdiri dengan bantuan',
        achieved: false,
        date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Putri Ayu - Bayi (12 bulan)
      {
        patient_id: 4,
        milestone_name: 'Mengangkat kepala',
        achieved: true,
        date: new Date('2023-01-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 4,
        milestone_name: 'Duduk dengan bantuan',
        achieved: true,
        date: new Date('2023-03-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 4,
        milestone_name: 'Merangkak',
        achieved: true,
        date: new Date('2023-06-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 4,
        milestone_name: 'Berdiri dengan bantuan',
        achieved: true,
        date: new Date('2023-09-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 4,
        milestone_name: 'Berjalan sendiri',
        achieved: false,
        date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Dian Permata - Bayi (4 bulan)
      {
        patient_id: 7,
        milestone_name: 'Mengangkat kepala',
        achieved: true,
        date: new Date('2023-08-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 7,
        milestone_name: 'Duduk dengan bantuan',
        achieved: false,
        date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 7,
        milestone_name: 'Merangkak',
        achieved: false,
        date: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('milestones', null, {});
  }
};
