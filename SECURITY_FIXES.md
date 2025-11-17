# SECURITY FIXES NEEDED

## 🔴 CRITICAL - Fix Before Production

### 1. Hardcoded Admin Credentials in Frontend
**File:** `frontend/src/pages/Login.js`
**Line:** 15

**Current Code:**
```javascript
if (username === 'admin_tarahan' && password === 'admin_tarahan123') {
```

**Option A - Quick Fix (Use Backend API):**
```javascript
// frontend/src/pages/Login.js
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
      username,
      password
    });
    
    if (response.data.success) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('adminUsername', response.data.user.username);
      navigate('/admin');
    }
  } catch (error) {
    setError('Username atau password salah');
    setTimeout(() => setError(''), 3000);
  }
};
```

**Option B - Environment Variables (Temporary):**
```javascript
const ADMIN_USER = process.env.REACT_APP_ADMIN_USERNAME;
const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASSWORD;

if (username === ADMIN_USER && password === ADMIN_PASS) {
```

Then add to `frontend/.env`:
```
REACT_APP_ADMIN_USERNAME=admin_tarahan
REACT_APP_ADMIN_PASSWORD=your_secure_password
```

⚠️ **Note:** Option A is more secure and recommended for production.

---

### 2. Missing Input Validation

**Install validator:**
```bash
cd backend
npm install express-validator
```

**Add to routes:**
```javascript
const { body, validationResult } = require('express-validator');

// Example for patient creation
router.post('/patients', [
  body('name').notEmpty().trim().escape(),
  body('age').optional().isNumeric(),
  body('gender').isIn(['Laki-laki', 'Perempuan']),
  body('category').isIn(['Bayi', 'Dewasa', 'Lansia']),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, patientController.createPatient);
```

---

### 3. Rate Limiting

**Install:**
```bash
cd backend
npm install express-rate-limit
```

**Add to server.js:**
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit to 5 login attempts
  message: 'Too many login attempts, please try again later.'
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);
```

---

### 4. Security Headers

**Install:**
```bash
cd backend
npm install helmet
```

**Add to server.js:**
```javascript
const helmet = require('helmet');

app.use(helmet());
```

---

### 5. SQL Injection Protection

✅ Already protected by Sequelize ORM, but add validation:

```javascript
// Bad - Don't do this
const query = `SELECT * FROM patients WHERE name = '${name}'`;

// Good - Already using Sequelize
const patient = await Patient.findOne({ where: { name } });
```

---

### 6. XSS Protection

**Install:**
```bash
cd backend
npm install xss-clean
```

**Add to server.js:**
```javascript
const xss = require('xss-clean');

app.use(xss());
```

---

## 🟡 RECOMMENDED - Enhance Security

### 1. JWT Authentication

**Install:**
```bash
cd backend
npm install jsonwebtoken bcryptjs
```

**Implementation:**
```javascript
// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
```

**Use in routes:**
```javascript
const verifyToken = require('../middleware/auth');

router.put('/patients/:id', verifyToken, patientController.updatePatient);
router.delete('/patients/:id', verifyToken, patientController.deletePatient);
```

---

### 2. Environment Variables Security

**Never commit .env files!**

Check `.gitignore`:
```
.env
backend/.env
frontend/.env
*.env.local
```

**Use .env.example for templates only!**

---

### 3. HTTPS/SSL

**For production, always use HTTPS!**

**Let's Encrypt (Free SSL):**
```bash
sudo certbot --nginx -d your-domain.com
```

---

### 4. Database Security

**Use strong passwords:**
```env
DB_PASSWORD=your_very_strong_password_here_min_16_chars
```

**Limit database access:**
```sql
-- Only allow from specific IP
ALTER USER postgres SET password_encryption = 'scram-sha-256';
```

---

### 5. Content Security Policy

**Add to nginx config:**
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
```

---

## 📝 Security Checklist

Before deploying to production:

- [ ] Remove hardcoded credentials from Login.js
- [ ] Implement backend authentication API
- [ ] Add input validation
- [ ] Add rate limiting
- [ ] Install helmet for security headers
- [ ] Enable HTTPS/SSL
- [ ] Use strong database passwords
- [ ] Configure CORS properly
- [ ] Add XSS protection
- [ ] Remove .env from git history
- [ ] Implement JWT tokens (recommended)
- [ ] Add request logging
- [ ] Setup monitoring/alerts
- [ ] Regular security audits

---

## 🔒 Password Best Practices

For production admin password:
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- Not a dictionary word
- Unique (not used elsewhere)
- Store in environment variables only
- Never commit to git

Example strong password generator:
```bash
openssl rand -base64 32
```

---

## 📞 Questions?

If you need help implementing any of these security measures, let me know!
