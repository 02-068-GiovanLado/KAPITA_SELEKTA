'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('immunizations', [
      // Ahmad Budi - Bayi (8 bulan)
      {
        patient_id: 1,
        vaccine_name: 'BCG',
        status: 'Selesai',
        date: new Date('2023-03-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 1,
        vaccine_name: 'Hepatitis B',
        status: 'Selesai',
        date: new Date('2023-03-15'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 1,
        vaccine_name: 'Polio',
        status: 'Selesai',
        date: new Date('2023-05-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 1,
        vaccine_name: 'DPT',
        status: 'Terjadwal',
        date: new Date('2023-12-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Putri Ayu - Bayi (12 bulan)
      {
        patient_id: 4,
        vaccine_name: 'BCG',
        status: 'Selesai',
        date: new Date('2022-11-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 4,
        vaccine_name: 'Hepatitis B',
        status: 'Selesai',
        date: new Date('2022-11-15'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 4,
        vaccine_name: 'Polio',
        status: 'Selesai',
        date: new Date('2023-01-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 4,
        vaccine_name: 'DPT',
        status: 'Selesai',
        date: new Date('2023-03-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 4,
        vaccine_name: 'Campak',
        status: 'Terjadwal',
        date: new Date('2023-12-15'),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Dian Permata - Bayi (4 bulan)
      {
        patient_id: 7,
        vaccine_name: 'BCG',
        status: 'Selesai',
        date: new Date('2023-07-01'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 7,
        vaccine_name: 'Hepatitis B',
        status: 'Selesai',
        date: new Date('2023-07-15'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 7,
        vaccine_name: 'Polio',
        status: 'Terjadwal',
        date: new Date('2023-12-01'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('immunizations', null, {});
  }
};
