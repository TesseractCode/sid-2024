const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const companyRoutes = require('./routes/companyRoutes'); 
const exchangeRoutes = require('./routes/exchangeRoutes');
const externalSearchRoutes = require('./routes/externalSearchRoutes');
const cnpRoutes = require('./routes/cnpRoutes');
const localCompanyRoutes = require('./routes/localCompanyRoutes');
const pythonRoutes = require('./routes/pythonRoutes');

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

// Exchange Routes
app.use('/api', exchangeRoutes);

// External Search Routes
app.use('/public', externalSearchRoutes);

// Validate CNP Routes
app.use('/public', cnpRoutes);

app.use('/api', localCompanyRoutes);

app.use('/public', pythonRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
