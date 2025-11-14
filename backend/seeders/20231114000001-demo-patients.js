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
        guardian_name: 'Siti Aminah',
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
        id: 3,
        name: 'Bambang Hartono',
        age: '72 tahun',
        gender: 'Laki-laki',
        category: 'Lansia',
        nik: '3202_7002',
        last_checkup_date: new Date('2023-10-18'),
        status: 'Kritis',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'Putri Ayu',
        age: '12 bulan',
        gender: 'Perempuan',
        category: 'Bayi',
        guardian_name: 'Dian Permata',
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
        id: 6,
        name: 'Sri Mulyani',
        age: '68 tahun',
        gender: 'Perempuan',
        category: 'Lansia',
        nik: '3204_9012',
        last_checkup_date: new Date('2023-10-19'),
        status: 'Perlu Perhatian',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        name: 'Dian Permata',
        age: '4 bulan',
        gender: 'Perempuan',
        category: 'Bayi',
        guardian_name: 'Rina Sari',
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
