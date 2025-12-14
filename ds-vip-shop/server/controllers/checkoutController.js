// This file contains the logic for handling checkout-related operations, including creating a Stripe Checkout session.

const stripe = require('../utils/stripeClient');

// Function to create a Stripe Checkout session
const createCheckoutSession = async (req, res) => {
  const { productId } = req.body;

  // Validate productId (you can implement your own product validation logic here)
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Define the product details (you can fetch this from your database)
  const products = {
    v1: { name: "Obsidian GT", price: 19.99 },
    v2: { name: "Phantom Cruiser", price: 14.99 },
    v3: { name: "Rogue Bike", price: 9.99 }
  };

  const product = products[productId];

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  try {
    // Create a new Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/success.html`,
      cancel_url: `${process.env.BASE_URL}/cancel.html`,
    });

    // Respond with the session ID
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createCheckoutSession,
};