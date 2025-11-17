'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('vitamins', [
      // Ahmad Budi - Bayi (8 bulan)
      {
        patient_id: 1,
        vitamin_name: 'Vitamin A',
        status: 'Selesai',
        date: new Date('2023-03-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 1,
        vitamin_name: 'Vitamin D',
        status: 'Selesai',
        date: new Date('2023-03-15'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 1,
        vitamin_name: 'Vitamin C',
        status: 'Terjadwal',
        date: new Date('2023-12-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Putri Ayu - Bayi (12 bulan)
      {
        patient_id: 4,
        vitamin_name: 'Vitamin A',
        status: 'Selesai',
        date: new Date('2022-11-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 4,
        vitamin_name: 'Vitamin D',
        status: 'Selesai',
        date: new Date('2022-11-15'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 4,
        vitamin_name: 'Vitamin B Complex',
        status: 'Tertunda',
        date: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Dian Permata - Bayi (4 bulan)
      {
        patient_id: 7,
        vitamin_name: 'Vitamin A',
        status: 'Selesai',
        date: new Date('2023-07-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 7,
        vitamin_name: 'Vitamin D',
        status: 'Terjadwal',
        date: new Date('2023-11-01'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('vitamins', null, {});
  }
};
