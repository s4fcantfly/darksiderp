const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// Route to create a Stripe Checkout session
router.post('/', checkoutController.createCheckoutSession);

module.exports = router;