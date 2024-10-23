const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Add CORS
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const companyRoutes = require('./routes/companyRoutes'); // Import companyRoutes
const { izolate_data_on_years, all_data } = require('./api_data/data_izolation.js');
const { fetchData } = require('./api_data/data_fetching.js');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from frontend running on port 3001
  credentials: true, // Enable sending cookies
}));


// Public Routes
app.use('/auth', authRoutes);

// Protected Routes
app.use('/api', protectedRoutes);

// Company Routes
app.use('/companies', companyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  // const data = await fetchData(16341004);
  // console.log(izolate_data_on_years(all_data, ["cifra_de_afaceri_neta", "profit_brut", "profit_net"]));
});
