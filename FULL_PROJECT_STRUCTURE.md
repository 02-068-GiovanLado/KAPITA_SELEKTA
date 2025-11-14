# HealthMon Project - Complete Structure

## 📁 Full Directory Tree

```
d:\health\
│
├── frontend/                           # React Frontend Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js              # Sidebar & main layout
│   │   │   └── Layout.css
│   │   ├── data/
│   │   │   └── mockData.js            # Mock data (to be replaced with API)
│   │   ├── pages/
│   │   │   ├── Dashboard.js           # Main dashboard
│   │   │   ├── Dashboard.css
│   │   │   ├── MonitoringBayi.js      # Baby monitoring page
│   │   │   ├── MonitoringBayi.css
│   │   │   ├── MonitoringDewasa.js    # Adult monitoring page
│   │   │   ├── MonitoringDewasa.css
│   │   │   ├── MonitoringLansia.js    # Elderly monitoring page
│   │   │   ├── MonitoringLansia.css
│   │   │   ├── SemuaPasien.js         # All patients page
│   │   │   ├── SemuaPasien.css
│   │   │   ├── DetailPasien.js        # Patient detail page
│   │   │   └── DetailPasien.css
│   │   ├── App.js                     # Main React app
│   │   ├── App.css
│   │   ├── index.js                   # React entry point
│   │   └── index.css
│   ├── package.json
│   ├── .gitignore
│   └── README.md
│
└── backend/                            # Node.js Backend API
    ├── config/
    │   ├── config.js                  # Sequelize environment config
    │   └── database.js                # Database connection
    │
    ├── controllers/
    │   └── patientController.js       # API business logic
    │       ├── getStats()             # GET /api/stats
    │       ├── getRecentAlerts()      # GET /api/alerts/recent
    │       ├── getAllPatients()       # GET /api/patients
    │       ├── getPatientById()       # GET /api/patients/:id
    │       └── createPatient()        # POST /api/patients
    │
    ├── models/
    │   ├── index.js                   # Model associations
    │   ├── Patient.js                 # Patient model
    │   ├── Checkup.js                 # Checkup model
    │   ├── Alert.js                   # Alert model
    │   ├── Immunization.js            # Immunization model
    │   └── Milestone.js               # Milestone model
    │
    ├── migrations/
    │   ├── 20231114000001-create-patients.js
    │   ├── 20231114000002-create-checkups.js
    │   ├── 20231114000003-create-alerts.js
    │   ├── 20231114000004-create-immunizations.js
    │   └── 20231114000005-create-milestones.js
    │
    ├── seeders/
    │   ├── 20231114000001-demo-patients.js
    │   ├── 20231114000002-demo-checkups.js
    │   ├── 20231114000003-demo-alerts.js
    │   ├── 20231114000004-demo-immunizations.js
    │   └── 20231114000005-demo-milestones.js
    │
    ├── routes/
    │   └── api.js                     # API routes definition
    │
    ├── scripts/
    │   └── syncFromSheet.js           # Google Sheets sync script
    │
    ├── .env                           # Environment variables (not in git)
    ├── .env.example                   # Environment template
    ├── .gitignore
    ├── .sequelizerc                   # Sequelize CLI config
    ├── package.json                   # Dependencies & scripts
    ├── server.js                      # Main Express server
    │
    └── Documentation/
        ├── README.md                  # Main documentation
        ├── API_DOCUMENTATION.md       # API endpoint details
        ├── QUICKSTART.md              # 5-minute setup guide
        ├── GOOGLE_SHEETS_SETUP.md     # Google Sheets integration
        ├── FRONTEND_INTEGRATION.md    # React integration guide
        ├── DEPLOYMENT.md              # Production deployment
        └── PROJECT_SUMMARY.md         # This file
```

## 🔗 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Port 3000)                   │  │
│  │                                                            │  │
│  │  • Dashboard Component                                    │  │
│  │  • Monitoring Pages (Bayi/Dewasa/Lansia)                │  │
│  │  • Patient Detail Component                              │  │
│  │  • Form Components                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓ HTTP Requests (Fetch API)        │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Express.js Backend (Port 5000)                   │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │             Middleware Stack                       │  │  │
│  │  │  • CORS                                            │  │  │
│  │  │  • JSON Parser                                     │  │  │
│  │  │  • Request Logger                                  │  │  │
│  │  │  • Error Handler                                   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │               API Routes (/api/*)                  │  │  │
│  │  │                                                     │  │  │
│  │  │  GET  /stats                                       │  │  │
│  │  │  GET  /alerts/recent                               │  │  │
│  │  │  GET  /patients?category=...                       │  │  │
│  │  │  GET  /patients/:id                                │  │  │
│  │  │  POST /patients                                    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                         ↓                                  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │           Controllers (Business Logic)             │  │  │
│  │  │                                                     │  │  │
│  │  │  • getStats()                                      │  │  │
│  │  │  • getRecentAlerts()                               │  │  │
│  │  │  • getAllPatients()                                │  │  │
│  │  │  • getPatientById()                                │  │  │
│  │  │  • createPatient() (with transaction)             │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓ Sequelize ORM                    │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           PostgreSQL Database (Port 5432)                 │  │
│  │                                                            │  │
│  │  ┌────────────┬──────────────┬──────────────────────┐   │  │
│  │  │  patients  │   checkups   │      alerts          │   │  │
│  │  │            │              │                      │   │  │
│  │  │  • id      │   • id       │      • id            │   │  │
│  │  │  • name    │   • patient_id│      • patient_id    │   │  │
│  │  │  • age     │   • date     │      • alert_type    │   │  │
│  │  │  • gender  │   • weight   │      • description   │   │  │
│  │  │  • category│   • height   │                      │   │  │
│  │  │  • status  │   • bp       │                      │   │  │
│  │  └────────────┴──────────────┴──────────────────────┘   │  │
│  │                                                            │  │
│  │  ┌────────────────┬──────────────────────────────────┐   │  │
│  │  │ immunizations  │        milestones               │   │  │
│  │  │                │                                  │   │  │
│  │  │  • id          │         • id                    │   │  │
│  │  │  • patient_id  │         • patient_id            │   │  │
│  │  │  • vaccine_name│         • milestone_name        │   │  │
│  │  │  • status      │         • achieved              │   │  │
│  │  │  • date        │         • date                  │   │  │
│  │  └────────────────┴──────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               ↑
                               │ (Optional)
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL INTEGRATION                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Google Sheets (Bulk Import)                     │  │
│  │                                                            │  │
│  │  npm run sync:sheets                                      │  │
│  │         ↓                                                  │  │
│  │  Service Account Auth → Read Sheets → Upsert to DB       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow Example

### Example: Get Patient Detail

```
1. User clicks patient in frontend
   └─→ React: Link to /detail-pasien/1

2. Component mounts, triggers API call
   └─→ fetch('http://localhost:5000/api/patients/1')

3. Express receives request
   └─→ server.js: CORS + JSON middleware
   └─→ routes/api.js: Route to controller
   └─→ controllers/patientController.js: getPatientById()

4. Controller queries database
   └─→ Patient.findByPk(1, {
         include: ['checkups', 'alerts', 'immunizations', 'milestones']
       })

5. Sequelize generates SQL
   └─→ SELECT * FROM patients WHERE id = 1
   └─→ SELECT * FROM checkups WHERE patient_id = 1
   └─→ SELECT * FROM alerts WHERE patient_id = 1
   └─→ SELECT * FROM immunizations WHERE patient_id = 1
   └─→ SELECT * FROM milestones WHERE patient_id = 1

6. PostgreSQL executes queries
   └─→ Returns results

7. Sequelize transforms to JS objects
   └─→ Returns patient object with associations

8. Controller sends JSON response
   └─→ res.json(patient)

9. Frontend receives data
   └─→ useState updates
   └─→ Component re-renders
   └─→ User sees patient details
```

## 🗄️ Database Relationships

```
┌─────────────┐
│  patients   │
│             │
│  • id (PK)  │◄─────┐
│  • name     │      │
│  • age      │      │
│  • category │      │
│  • status   │      │
└─────────────┘      │
       ▲             │
       │ hasMany     │ belongsTo (FK: patient_id)
       │             │
       ├─────────────┴──────────────┐
       │                            │
       │                            │
┌──────┴────────┐         ┌─────────┴─────┐
│   checkups    │         │    alerts     │
│               │         │               │
│  • id (PK)    │         │  • id (PK)    │
│  • patient_id │         │  • patient_id │
│  • date       │         │  • alert_type │
│  • weight     │         │  • description│
│  • height     │         └───────────────┘
│  • bp         │
│  • blood_sugar│
└───────────────┘
       │
       │ hasMany
       │
       ├──────────────┬───────────────┐
       │              │               │
       ▼              ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│immunizations │ │  milestones  │ │   (future)   │
│              │ │              │ │              │
│ • id (PK)    │ │ • id (PK)    │ │  • doctors   │
│ • patient_id │ │ • patient_id │ │  • schedules │
│ • vaccine    │ │ • name       │ │  • reports   │
│ • status     │ │ • achieved   │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

## 📊 API Response Structure

### Stats Response
```json
{
  "totalPatients": 7,
  "totalBabies": 3,
  "totalAdults": 2,
  "totalElders": 2,
  "activeAlerts": 3
}
```

### Patient List Response
```json
[
  {
    "id": 1,
    "name": "Ahmad Budi",
    "age": "8 bulan",
    "gender": "Laki-laki",
    "category": "Bayi",
    "status": "Stabil",
    "last_checkup_date": "2023-10-15T00:00:00.000Z"
  }
]
```

### Patient Detail Response (with associations)
```json
{
  "id": 1,
  "name": "Ahmad Budi",
  "age": "8 bulan",
  "category": "Bayi",
  "checkups": [...],    // Array of checkup records
  "alerts": [...],      // Array of alerts
  "immunizations": [...],  // Array of vaccinations
  "milestones": [...]   // Array of development milestones
}
```

## 🔐 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthmon_db
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development

# Google Sheets (optional)
GOOGLE_SHEET_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Production                           │
│                                                          │
│  ┌──────────────┐      ┌──────────────┐               │
│  │   Frontend   │      │   Backend    │               │
│  │              │      │              │               │
│  │  React App   │──────│  Express API │               │
│  │  (Vercel/    │ HTTP │  (Heroku/    │               │
│  │   Netlify)   │      │   Railway)   │               │
│  └──────────────┘      └──────┬───────┘               │
│                                │                        │
│                         ┌──────┴────────┐              │
│                         │   PostgreSQL  │              │
│                         │   (Managed)   │              │
│                         └───────────────┘              │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │          Optional: Google Sheets Sync            │  │
│  │                                                   │  │
│  │  Scheduled Job (Cron/Heroku Scheduler)          │  │
│  │         ↓                                        │  │
│  │  npm run sync:sheets                             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 📚 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| README.md | Main project documentation | All developers |
| API_DOCUMENTATION.md | Detailed API specs | Frontend developers |
| QUICKSTART.md | Quick setup guide | New developers |
| GOOGLE_SHEETS_SETUP.md | Google Sheets integration | Data managers |
| FRONTEND_INTEGRATION.md | React integration guide | Frontend team |
| DEPLOYMENT.md | Production deployment | DevOps/Backend |
| PROJECT_SUMMARY.md | High-level overview | Project managers |

## 🎯 Development Workflow

```
1. Feature Development
   ├─→ Create migration (if DB change needed)
   ├─→ Create/Update model
   ├─→ Create/Update controller
   ├─→ Create/Update route
   ├─→ Test with curl/Postman
   └─→ Update frontend component

2. Database Changes
   ├─→ Create migration file
   ├─→ Run: npm run db:migrate
   ├─→ Update model if needed
   └─→ Create/Update seeder

3. Deployment
   ├─→ Test locally
   ├─→ Commit to git
   ├─→ Push to repository
   ├─→ Deploy backend
   ├─→ Run migrations on production
   └─→ Deploy frontend
```

## ✅ Quality Checklist

- [x] Code follows naming conventions
- [x] All endpoints tested
- [x] Error handling implemented
- [x] Database transactions used where needed
- [x] Migrations for all schema changes
- [x] Seeders for demo data
- [x] Environment variables for secrets
- [x] CORS configured
- [x] API documented
- [x] README comprehensive
- [x] .gitignore includes .env
- [x] Code commented where needed
- [x] Associations properly defined
- [x] Indexes on frequently queried columns

## 🎉 Project Complete!

Kedua frontend dan backend telah selesai dan siap digunakan!

**Next Steps:**
1. Test integration between frontend and backend
2. Deploy to production
3. Monitor and maintain
4. Add new features as needed

**Happy Coding! 🚀**
