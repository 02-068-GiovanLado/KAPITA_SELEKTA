'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('checkups', [
      // Ahmad Budi (Bayi) - 3 checkups
      {
        patient_id: 1,
        date: new Date('2023-04-15'),
        weight: 6.0,
        height: 60.0,
        head_circumference: 40.0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 1,
        date: new Date('2023-07-15'),
        weight: 7.5,
        height: 65.0,
        head_circumference: 42.0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: 1,
        date: new Date('2023-10-15'),
        weight: 8.5,
        height: 68.0,
        head_circumference: 43.0,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Citra Lestari (Dewasa)
      {
        patient_id: 2,
        date: new Date('2023-10-18'),
        weight: 58.0,
        height: 160.0,
        blood_pressure: '120/80',
        blood_sugar: 95,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Putri Ayu (Bayi)
      {
        patient_id: 4,
        date: new Date('2023-10-16'),
        weight: 9.2,
        height: 72.0,
        head_circumference: 45.0,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Rizky Pratama (Dewasa)
      {
        patient_id: 5,
        date: new Date('2023-10-17'),
        weight: 70.0,
        height: 170.0,
        blood_pressure: '118/78',
        blood_sugar: 88,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Dian Permata (Bayi)
      {
        patient_id: 7,
        date: new Date('2023-10-20'),
        weight: 6.8,
        height: 62.0,
        head_circumference: 41.0,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('checkups', null, {});
  }
};
