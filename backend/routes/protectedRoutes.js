const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Apply the authMiddleware to all routes in this router
router.use(authMiddleware);

// Example Protected Route
router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: 'Welcome to your dashboard',
    user: req.user,
  });
});


module.exports = router;
