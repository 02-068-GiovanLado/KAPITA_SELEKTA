'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('patients', [
      {
        id: 1,
        name: 'Ahmad Budi',
        age: '8 bulan',
        gender: 'Laki-laki',
        category: 'Bayi',
        birth_date: new Date('2023-02-15'),
        guardian_name: 'Siti Aminah',
        mother_nik: '3201234567890001',
        child_nik: '3201234567890011',
        family_card_number: '3201234567890000',
        last_checkup_date: new Date('2023-10-15'),
        status: 'Stabil',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Citra Lestari',
        age: '35 tahun',
        gender: 'Perempuan',
        category: 'Dewasa',
        nik: '3201_1234',
        last_checkup_date: new Date('2023-10-18'),
        status: 'Stabil',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'Putri Ayu',
        age: '12 bulan',
        gender: 'Perempuan',
        category: 'Bayi',
        birth_date: new Date('2022-10-16'),
        guardian_name: 'Dian Permata',
        mother_nik: '3201234567890002',
        child_nik: '3201234567890012',
        family_card_number: '3201234567890001',
        last_checkup_date: new Date('2023-10-16'),
        status: 'Perlu Perhatian',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        name: 'Rizky Pratama',
        age: '28 tahun',
        gender: 'Laki-laki',
        category: 'Dewasa',
        nik: '3203_5678',
        last_checkup_date: new Date('2023-10-17'),
        status: 'Stabil',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        name: 'Dian Permata',
        age: '4 bulan',
        gender: 'Perempuan',
        category: 'Bayi',
        birth_date: new Date('2023-06-20'),
        guardian_name: 'Rina Sari',
        mother_nik: '3201234567890003',
        child_nik: '3201234567890013',
        family_card_number: '3201234567890002',
        last_checkup_date: new Date('2023-10-20'),
        status: 'Stabil',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('patients', null, {});
  }
};
