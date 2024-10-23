const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Add CORS
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const companyRoutes = require('./routes/companyRoutes'); 
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));


// Public Routes
app.use('/auth', authRoutes);

// Protected Routes
app.use('/api', protectedRoutes);

// Company Routes
app.use('/api/companies', companyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
