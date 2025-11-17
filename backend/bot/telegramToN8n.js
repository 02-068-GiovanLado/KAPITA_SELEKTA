const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Telegram Bot Token (dapatkan dari @BotFather)
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';

// Backend API URL (langsung ke backend, tidak pakai n8n)
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api/patients';

// Create bot instance
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Storage untuk session user (temporary data)
const userSessions = new Map();

console.log('🤖 Telegram Bot connected to Backend API');
console.log(`📡 API URL: ${BACKEND_API_URL}`);

/**
 * Command: /start
 */
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
🏥 *Selamat datang di HealthMon Bot!*

Bot ini untuk input data pasien yang akan langsung masuk ke database.

📋 *Command yang tersedia:*

/daftar - Daftarkan pasien baru
/checkup - Input data checkup
/vitamin - Input data vitamin
/status - Cek status pasien
/help - Bantuan lengkap

💡 *Cara pakai:*
Ketik /daftar untuk memulai pendaftaran pasien.
  `;
  
  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

/**
 * Command: /help
 */
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
📚 *Panduan Lengkap HealthMon Bot*

*1️⃣ Daftar Pasien Baru*

Ketik: \`/daftar\`

Bot akan memandu Anda step-by-step dengan tombol interaktif:
• Pilih kategori (Bayi/Dewasa)
• Pilih jenis kelamin
• Input nama, tanggal lahir, NIK, dll

✨ *Mudah! Tidak perlu hafal format!*

*2️⃣ Input Checkup*
Format Bayi: \`/checkup ID berat|tinggi|lingkar_kepala\`
Format Dewasa: \`/checkup ID berat|tinggi|tekanan_darah|gula_darah\`

Contoh: \`/checkup 1 5.2|55|42\`

*3️⃣ Input Vitamin*
Format: \`/vitamin ID nama_vitamin\`

Contoh:
\`/vitamin 1 Vitamin A\`
\`/vitamin 2 Vit D\`

💡 Nama vitamin bisa ditulis dengan berbagai cara
📊 Status otomatis: Selesai (sudah diberikan)

*4️⃣ Cek Status*
Format: \`/status ID\`
Contoh: \`/status 1\`

💡 *Tips:* Gunakan /status untuk melihat riwayat lengkap checkup dan vitamin pasien.
  `;
  
  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

/**
 * Command: /daftar - Interactive Form
 * Memulai proses pendaftaran pasien dengan form interaktif
 */
bot.onText(/\/daftar$/, async (msg) => {
  const chatId = msg.chat.id;
  
  // Initialize session
  userSessions.set(chatId, {
    step: 'category',
    data: {}
  });
  
  // Tanya kategori dengan button
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '👶 Bayi (0-5 tahun)', callback_data: 'category_Bayi' },
          { text: '👨 Dewasa (18-60 tahun)', callback_data: 'category_Dewasa' }
        ]
      ]
    }
  };
  
  bot.sendMessage(chatId, 
    '🏥 *Pendaftaran Pasien Baru*\n\n' +
    'Langkah 1/7: Pilih kategori pasien:', 
    { ...options, parse_mode: 'Markdown' }
  );
});

/**
 * Handle callback dari inline keyboard
 */
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  const messageId = callbackQuery.message.message_id;
  
  // Get user session
  const session = userSessions.get(chatId);
  if (!session) {
    bot.answerCallbackQuery(callbackQuery.id, { text: 'Session expired. Ketik /daftar untuk mulai lagi.' });
    return;
  }
  
  // Handle category selection
  if (data.startsWith('category_')) {
    const category = data.replace('category_', '');
    session.data.category = category;
    bot.answerCallbackQuery(callbackQuery.id);
    bot.deleteMessage(chatId, messageId);
    
    // Tanya jenis kelamin
    session.step = 'gender';
    userSessions.set(chatId, session);
    
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '👦 Laki-laki', callback_data: 'gender_Laki-laki' },
            { text: '👧 Perempuan', callback_data: 'gender_Perempuan' }
          ]
        ]
      }
    };
    
    bot.sendMessage(chatId, 
      `📋 Kategori: *${category}*\n\n` +
      `Langkah 2/7: Pilih jenis kelamin:`,
      { ...options, parse_mode: 'Markdown' }
    );
  }
  
  // Handle gender selection
  else if (data.startsWith('gender_')) {
    const gender = data.replace('gender_', '');
    session.data.gender = gender;
    bot.answerCallbackQuery(callbackQuery.id);
    bot.deleteMessage(chatId, messageId);
    
    // Tanya nama
    session.step = 'name';
    userSessions.set(chatId, session);
    
    bot.sendMessage(chatId, 
      `📋 Kategori: *${session.data.category}*\n` +
      `👥 Jenis Kelamin: *${gender}*\n\n` +
      `Langkah 3/7: Ketik nama ${session.data.category === 'Bayi' ? 'bayi' : 'pasien'}:`,
      { parse_mode: 'Markdown' }
    );
  }
});

/**
 * Handle text messages untuk form input
 */
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Skip jika command
  if (text && text.startsWith('/')) {
    // Handle unknown commands
    if (!text.match(/^\/(start|help|daftar|checkup|vitamin|status)/)) {
      bot.sendMessage(chatId, 
        '❓ Command tidak dikenali.\n\n' +
        'Ketik /help untuk melihat daftar command.'
      );
    }
    return;
  }
  
  // Get session
  const session = userSessions.get(chatId);
  if (!session) return;
  
  try {
    // Handle nama
    if (session.step === 'name') {
      session.data.name = text.trim();
      
      if (session.data.category === 'Bayi') {
        // Tanya tanggal lahir
        session.step = 'birth_date';
        userSessions.set(chatId, session);
        
        bot.sendMessage(chatId, 
          `📋 Nama: *${session.data.name}*\n\n` +
          `Langkah 4/7: Ketik tanggal lahir (DD/MM/YYYY):\n` +
          `Contoh: 15/02/2023`,
          { parse_mode: 'Markdown' }
        );
      } else {
        // Tanya usia untuk Dewasa
        session.step = 'age';
        userSessions.set(chatId, session);
        
        bot.sendMessage(chatId, 
          `📋 Nama: *${session.data.name}*\n\n` +
          `Langkah 4/7: Ketik usia:\n` +
          `Contoh: 25 tahun`,
          { parse_mode: 'Markdown' }
        );
      }
    }
    
    // Handle tanggal lahir (Bayi)
    else if (session.step === 'birth_date') {
      const birthDateStr = text.trim();
      const [day, month, year] = birthDateStr.split('/');
      const birth_date = new Date(`${year}-${month}-${day}`);
      
      if (isNaN(birth_date.getTime())) {
        bot.sendMessage(chatId, '❌ Format tanggal salah! Gunakan: DD/MM/YYYY\nContoh: 15/02/2023');
        return;
      }
      
      // Hitung usia
      const now = new Date();
      const ageInMonths = Math.floor((now - birth_date) / (1000 * 60 * 60 * 24 * 30));
      session.data.age = `${ageInMonths} bulan`;
      session.data.birth_date = birth_date;
      
      // Tanya nama orang tua
      session.step = 'guardian_name';
      userSessions.set(chatId, session);
      
      bot.sendMessage(chatId, 
        `📅 Tanggal Lahir: *${birthDateStr}*\n` +
        `🎂 Usia: *${session.data.age}*\n\n` +
        `Langkah 5/7: Ketik nama orang tua:`,
        { parse_mode: 'Markdown' }
      );
    }
    
    // Handle usia (Dewasa)
    else if (session.step === 'age') {
      session.data.age = text.trim();
      
      // Tanya NIK
      session.step = 'nik';
      userSessions.set(chatId, session);
      
      bot.sendMessage(chatId, 
        `🎂 Usia: *${session.data.age}*\n\n` +
        `Langkah 5/7: Ketik NIK (16 digit):\n` +
        `Atau ketik - jika tidak ada`,
        { parse_mode: 'Markdown' }
      );
    }
    
    // Handle nama orang tua (Bayi)
    else if (session.step === 'guardian_name') {
      session.data.guardian_name = text.trim();
      
      // Tanya NIK Ibu
      session.step = 'mother_nik';
      userSessions.set(chatId, session);
      
      bot.sendMessage(chatId, 
        `👨‍👩‍👧 Nama Orang Tua: *${session.data.guardian_name}*\n\n` +
        `Langkah 6/7: Ketik NIK Ibu (16 digit):`,
        { parse_mode: 'Markdown' }
      );
    }
    
    // Handle NIK Ibu (Bayi)
    else if (session.step === 'mother_nik') {
      session.data.mother_nik = text.trim();
      
      // Tanya NIK Anak
      session.step = 'child_nik';
      userSessions.set(chatId, session);
      
      bot.sendMessage(chatId, 
        `🆔 NIK Ibu: *${session.data.mother_nik}*\n\n` +
        `Langkah 7/7: Ketik NIK Anak (16 digit):`,
        { parse_mode: 'Markdown' }
      );
    }
    
    // Handle NIK Anak (Bayi) - lalu tanya No KK
    else if (session.step === 'child_nik') {
      session.data.child_nik = text.trim();
      
      // Tanya No Kartu Keluarga
      session.step = 'family_card_number';
      userSessions.set(chatId, session);
      
      bot.sendMessage(chatId, 
        `👶 NIK Anak: *${session.data.child_nik}*\n\n` +
        `Langkah 8/8: Ketik Nomor Kartu Keluarga (16 digit):`,
        { parse_mode: 'Markdown' }
      );
    }
    
    // Handle No Kartu Keluarga (Bayi) - Selesai
    else if (session.step === 'family_card_number') {
      session.data.family_card_number = text.trim();
      
      // Simpan ke database
      await savePatient(chatId, session.data);
      
      // Clear session
      userSessions.delete(chatId);
    }
    
    // Handle NIK (Dewasa) - Selesai
    else if (session.step === 'nik') {
      session.data.nik = text.trim() === '-' ? null : text.trim();
      
      // Simpan ke database
      await savePatient(chatId, session.data);
      
      // Clear session
      userSessions.delete(chatId);
    }
    
  } catch (error) {
    console.error('Error handling message:', error);
    bot.sendMessage(chatId, '❌ Terjadi kesalahan. Silakan mulai lagi dengan /daftar');
    userSessions.delete(chatId);
  }
});

/**
 * Function to save patient to database
 */
async function savePatient(chatId, patientData) {
  try {
    const loadingMsg = await bot.sendMessage(chatId, '⏳ Menyimpan data...');
    
    // Kirim data ke backend API
    const response = await axios.post(BACKEND_API_URL, patientData);
    
    // Delete loading message
    bot.deleteMessage(chatId, loadingMsg.message_id);
    
    // Success response
    const data = response.data;
    
    let successMessage = `
✅ *Pasien berhasil didaftarkan!*

📋 *Detail Pasien:*
ID: ${data.id}
Nama: ${data.name}
`;

    if (data.category === 'Bayi') {
      successMessage += `Tanggal Lahir: ${new Date(data.birth_date).toLocaleDateString('id-ID')}
Usia: ${data.age}
Jenis Kelamin: ${data.gender}
Kategori: ${data.category}
Nama Orang Tua: ${data.guardian_name}
NIK Ibu: ${data.mother_nik}
NIK Anak: ${data.child_nik}
No Kartu Keluarga: ${data.family_card_number}
`;
    } else {
      successMessage += `Usia: ${data.age}
Jenis Kelamin: ${data.gender}
Kategori: ${data.category}
${data.nik ? `NIK: ${data.nik}` : ''}
`;
    }

    successMessage += `Status: ${data.status}

📅 Didaftarkan: ${new Date(data.created_at).toLocaleString('id-ID')}

💡 *Data sudah tersedia di website HealthMon!*

📊 Command lanjutan:
/checkup ${data.id} - Input checkup
/vitamin ${data.id} - Input vitamin
`;
    
    bot.sendMessage(chatId, successMessage, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error creating patient:', error.response?.data || error.message);
    bot.sendMessage(chatId, 
      '❌ Gagal menyimpan data!\n\n' +
      'Error: ' + (error.response?.data?.error || error.message) + '\n\n' +
      'Silakan coba lagi dengan /daftar'
    );
  }
}

/**
 * Command: /checkup - Input data pemeriksaan
 * Format untuk Bayi/Anak: /checkup ID berat|tinggi|lingkar_kepala
 * Format untuk Remaja/Dewasa/Lansia: /checkup ID berat|tinggi|tekanan_darah|gula_darah
 * 
 * Contoh:
 * /checkup 11 5.2|55|42 (untuk bayi)
 * /checkup 11 65|165|120/80|95 (untuk dewasa)
 */
bot.onText(/\/checkup(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1]?.trim();

  if (!input) {
    bot.sendMessage(chatId, 
      '❌ Format salah!\n\n' +
      '📝 *Format untuk Bayi/Anak:*\n' +
      '`/checkup ID berat|tinggi|lingkar_kepala`\n' +
      'Contoh: `/checkup 11 5.2|55|42`\n\n' +
      '📝 *Format untuk Remaja/Dewasa/Lansia:*\n' +
      '`/checkup ID berat|tinggi|tekanan_darah|gula_darah`\n' +
      'Contoh: `/checkup 11 65|165|120/80|95`\n\n' +
      '💡 Tips:\n' +
      '- Berat dalam kg (contoh: 5.2, 65)\n' +
      '- Tinggi dalam cm (contoh: 55, 165)\n' +
      '- Lingkar kepala dalam cm (contoh: 42)\n' +
      '- Tekanan darah format: sistol/diastol (contoh: 120/80)\n' +
      '- Gula darah dalam mg/dL (contoh: 95)',
      { parse_mode: 'Markdown' }
    );
    return;
  }

  try {
    // Parse input: "ID data1|data2|data3|data4"
    const parts = input.split(/\s+/);
    if (parts.length < 2) {
      throw new Error('Format tidak lengkap');
    }

    const patientId = parseInt(parts[0]);
    const dataParts = parts.slice(1).join(' ').split('|');

    if (isNaN(patientId)) {
      throw new Error('ID pasien harus berupa angka');
    }

    // Check patient exists first
    const patientCheckUrl = `http://localhost:5000/api/patients/${patientId}`;
    let patient;
    try {
      const patientResponse = await axios.get(patientCheckUrl);
      patient = patientResponse.data;
    } catch (error) {
      if (error.response?.status === 404) {
        bot.sendMessage(chatId, `❌ Pasien dengan ID ${patientId} tidak ditemukan!`);
        return;
      }
      throw error;
    }

    // Prepare checkup data based on category
    let checkupData = {};
    
    if (patient.category === 'Bayi' || patient.category === 'Anak') {
      // Format: berat|tinggi|lingkar_kepala
      if (dataParts.length < 3) {
        throw new Error('Data tidak lengkap untuk kategori Bayi/Anak. Format: berat|tinggi|lingkar_kepala');
      }
      checkupData = {
        weight: parseFloat(dataParts[0]),
        height: parseFloat(dataParts[1]),
        head_circumference: parseFloat(dataParts[2])
      };
    } else {
      // Format: berat|tinggi|tekanan_darah|gula_darah
      if (dataParts.length < 4) {
        throw new Error('Data tidak lengkap untuk kategori Remaja/Dewasa/Lansia. Format: berat|tinggi|tekanan_darah|gula_darah');
      }
      checkupData = {
        weight: parseFloat(dataParts[0]),
        height: parseFloat(dataParts[1]),
        blood_pressure: dataParts[2],
        blood_sugar: parseInt(dataParts[3])
      };
    }

    // Validate numbers
    if (isNaN(checkupData.weight) || isNaN(checkupData.height)) {
      throw new Error('Berat dan tinggi harus berupa angka');
    }

    // Send to backend API
    const checkupUrl = `http://localhost:5000/api/patients/${patientId}/checkups`;
    console.log('Sending checkup to Backend API:', checkupUrl, checkupData);
    
    const response = await axios.post(checkupUrl, checkupData);
    const data = response.data;

    // Success message
    const successMessage = `
✅ *Checkup Berhasil Disimpan!*

👤 *Pasien:* ${patient.name}
🆔 *ID:* ${patient.id}
📋 *Kategori:* ${patient.category}

📊 *Data Pemeriksaan:*
⚖️ Berat: ${checkupData.weight} kg
📏 Tinggi: ${checkupData.height} cm
${checkupData.head_circumference ? `👶 Lingkar Kepala: ${checkupData.head_circumference} cm` : ''}
${checkupData.blood_pressure ? `💉 Tekanan Darah: ${checkupData.blood_pressure}` : ''}
${checkupData.blood_sugar ? `🩸 Gula Darah: ${checkupData.blood_sugar} mg/dL` : ''}

💡 *Data sudah tersimpan di database dan akan muncul di website!*

📊 Command lanjutan:
/status ${patient.id} - Lihat semua data pasien
    `;
    
    bot.sendMessage(chatId, successMessage, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    bot.sendMessage(chatId, 
      '❌ Terjadi kesalahan saat menyimpan checkup!\n\n' +
      'Error: ' + (error.response?.data?.error || error.message) + '\n\n' +
      'Silakan coba lagi atau hubungi admin.'
    );
  }
});

/**
 * Command: /vitamin - Input data vitamin
 * Format: /vitamin ID nama_vitamin|status
 * Contoh: /vitamin 1 Vitamin A|Diberikan
 */
bot.onText(/\/vitamin(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1]?.trim();

  if (!input) {
    bot.sendMessage(chatId, 
      '❌ Format salah!\n\n' +
      '📝 *Format:*\n' +
      '`/vitamin ID nama_vitamin`\n\n' +
      '*Contoh:*\n' +
      '`/vitamin 1 Vitamin A`\n' +
      '`/vitamin 2 Vit D`\n' +
      '`/vitamin 3 Vit. B12`\n\n' +
      '💡 Nama vitamin bisa ditulis dengan berbagai cara (Vitamin A, Vit A, Vit. A, dll)\n' +
      '📊 Status otomatis: Selesai (sudah diberikan)',
      { parse_mode: 'Markdown' }
    );
    return;
  }

  try {
    // Parse input: "ID nama_vitamin"
    const parts = input.split(/\s+/);
    if (parts.length < 2) {
      throw new Error('Format tidak lengkap');
    }

    const patientId = parseInt(parts[0]);
    const vitaminName = parts.slice(1).join(' ').trim();

    if (isNaN(patientId)) {
      throw new Error('ID pasien harus berupa angka');
    }

    if (!vitaminName) {
      throw new Error('Nama vitamin tidak boleh kosong');
    }

    // Normalisasi nama vitamin (fleksibel)
    // Vitamin A, Vit A, Vit. A -> semua diterima
    let normalizedName = vitaminName;
    
    // Capitalize huruf pertama setiap kata
    normalizedName = normalizedName.split(' ').map(word => {
      // Hapus titik di akhir kata seperti "Vit."
      word = word.replace(/\.$/, '');
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');

    const vitaminData = {
      vitamin_name: normalizedName,
      status: 'Selesai', // Status otomatis "Selesai"
      date: new Date()
    }

    // Check patient exists first
    const patientCheckUrl = `http://localhost:5000/api/patients/${patientId}`;
    let patient;
    try {
      const patientResponse = await axios.get(patientCheckUrl);
      patient = patientResponse.data;
    } catch (error) {
      if (error.response?.status === 404) {
        bot.sendMessage(chatId, `❌ Pasien dengan ID ${patientId} tidak ditemukan!`);
        return;
      }
      throw error;
    }

    // Send loading message
    const loadingMsg = await bot.sendMessage(chatId, '⏳ Menyimpan data vitamin...');

    // Send to backend API
    const vitaminUrl = `http://localhost:5000/api/patients/${patientId}/vitamins`;
    console.log('Sending vitamin to Backend API:', vitaminUrl, vitaminData);
    
    const response = await axios.post(vitaminUrl, vitaminData);
    const data = response.data;

    // Delete loading message
    bot.deleteMessage(chatId, loadingMsg.message_id);

    // Success message
    const successMessage = `
✅ *Data Vitamin Berhasil Disimpan!*

👤 *Pasien:* ${patient.name}
🆔 *ID:* ${patient.id}
💊 *Vitamin:* ${data.vitamin_name}
📊 *Status:* ${data.status}
📅 *Tanggal:* ${new Date(data.date).toLocaleDateString('id-ID')}

📝 Command lanjutan:
/status ${patient.id} - Lihat riwayat lengkap
/vitamin ${patient.id} - Input vitamin lagi
    `;
    
    bot.sendMessage(chatId, successMessage, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Error creating vitamin:', error.response?.data || error.message);
    bot.sendMessage(chatId, 
      '❌ Gagal menyimpan data vitamin!\n\n' +
      'Error: ' + (error.response?.data?.error || error.message) + '\n\n' +
      'Silakan coba lagi atau hubungi admin.'
    );
  }
});

/**
 * Command: /status - Cek detail pasien dan riwayat checkup
 * Format: /status ID
 */
bot.onText(/\/status(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1]?.trim();

  if (!input) {
    bot.sendMessage(chatId, 
      '❌ Format salah!\n\n' +
      '📝 Format: `/status ID`\n' +
      'Contoh: `/status 11`',
      { parse_mode: 'Markdown' }
    );
    return;
  }

  try {
    const patientId = parseInt(input);
    
    if (isNaN(patientId)) {
      throw new Error('ID pasien harus berupa angka');
    }

    // Get patient data with checkups
    const url = `http://localhost:5000/api/patients/${patientId}`;
    const response = await axios.get(url);
    const patient = response.data;

    // Format checkup history
    let checkupHistory = '';
    if (patient.checkups && patient.checkups.length > 0) {
      checkupHistory = '\n📋 *Riwayat Pemeriksaan (5 terakhir):*\n';
      patient.checkups.slice(0, 5).forEach((c, idx) => {
        const date = new Date(c.date).toLocaleDateString('id-ID');
        checkupHistory += `\n${idx + 1}. ${date}\n`;
        if (c.weight) checkupHistory += `   ⚖️ Berat: ${c.weight} kg\n`;
        if (c.height) checkupHistory += `   📏 Tinggi: ${c.height} cm\n`;
        if (c.head_circumference) checkupHistory += `   👶 Lingkar Kepala: ${c.head_circumference} cm\n`;
        if (c.blood_pressure) checkupHistory += `   💉 Tekanan Darah: ${c.blood_pressure}\n`;
        if (c.blood_sugar) checkupHistory += `   🩸 Gula Darah: ${c.blood_sugar} mg/dL\n`;
      });
    } else {
      checkupHistory = '\n📋 *Belum ada riwayat pemeriksaan*';
    }

    // Format vitamin history
    let vitaminHistory = '';
    if (patient.vitamins && patient.vitamins.length > 0) {
      vitaminHistory = '\n\n💊 *Riwayat Vitamin (5 terakhir):*\n';
      patient.vitamins.slice(0, 5).forEach((v, idx) => {
        const date = new Date(v.date).toLocaleDateString('id-ID');
        vitaminHistory += `\n${idx + 1}. ${v.vitamin_name}\n`;
        vitaminHistory += `   📊 Status: ${v.status}\n`;
        vitaminHistory += `   📅 Tanggal: ${date}\n`;
      });
    } else {
      vitaminHistory = '\n\n💊 *Belum ada riwayat vitamin*';
    }

    let statusMessage = `
📊 *Status Pasien*

👤 *Nama:* ${patient.name}
🆔 *ID:* ${patient.id}
`;

    if (patient.category === 'Bayi') {
      statusMessage += `📅 *Tanggal Lahir:* ${patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('id-ID') : '-'}
🎂 *Usia:* ${patient.age}
👥 *Gender:* ${patient.gender}
📋 *Kategori:* ${patient.category}
👨‍👩‍👧 *Nama Orang Tua:* ${patient.guardian_name || '-'}
🆔 *NIK Ibu:* ${patient.mother_nik || '-'}
👶 *NIK Anak:* ${patient.child_nik || '-'}
📇 *No Kartu Keluarga:* ${patient.family_card_number || '-'}
`;
    } else {
      statusMessage += `🎂 *Usia:* ${patient.age}
👥 *Gender:* ${patient.gender}
📋 *Kategori:* ${patient.category}
🆔 *NIK:* ${patient.nik || '-'}
`;
    }

    statusMessage += checkupHistory + vitaminHistory + `

📝 Command lanjutan:
/checkup ${patient.id} - Input pemeriksaan baru
/vitamin ${patient.id} - Input vitamin baru
    `;
    
    bot.sendMessage(chatId, statusMessage, { parse_mode: 'Markdown' });
    
  } catch (error) {
    if (error.response?.status === 404) {
      bot.sendMessage(chatId, `❌ Pasien dengan ID ${input} tidak ditemukan!`);
    } else {
      console.error('Error:', error.response?.data || error.message);
      bot.sendMessage(chatId, 
        '❌ Terjadi kesalahan!\n\n' +
        'Error: ' + (error.response?.data?.error || error.message)
      );
    }
  }
});

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.code, error.message);
});

console.log('✅ Telegram Bot is running...');
