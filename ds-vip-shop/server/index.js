const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const createCheckoutSession = require('./routes/create-checkout-session');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/create-checkout-session', createCheckoutSession);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});