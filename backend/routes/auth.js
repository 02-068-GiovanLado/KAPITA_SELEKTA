const express = require('express');
const router = express.Router();

// Admin authentication endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }
    
    // Check credentials against environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin_tarahan';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin_tarahan123';
    
    if (username === adminUsername && password === adminPassword) {
      // In production, you should use JWT tokens here
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          username: adminUsername,
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({
        error: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Verify authentication (untuk future JWT implementation)
router.get('/verify', (req, res) => {
  // TODO: Implement JWT verification
  res.json({
    message: 'Auth verification endpoint - TODO: Implement JWT'
  });
});

module.exports = router;
