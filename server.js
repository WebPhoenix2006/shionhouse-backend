const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:4200', // Replace with your Angular application's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']
}));

let cartItems = [];
let nextId = 1;

// Add item to cart
app.post('/cart', (req, res) => {
  const newItem = { ...req.body, id: nextId++ };
  cartItems.push(newItem);
  res.status(201).json(newItem);
});

// Update item in cart
app.put('/cart/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;
  const itemIndex = cartItems.findIndex(item => item.id === itemId);

  if (itemIndex !== -1) {
    cartItems[itemIndex] = { ...updatedItem, id: itemId };
    res.json(updatedItem);
  } else {
    res.sendStatus(404); // Send a not found response
  }
});

// Remove item from cart
app.delete('/cart/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
  
    if (itemIndex !== -1) {
      cartItems.splice(itemIndex, 1);
      res.sendStatus(204); // Send a success response with no content
  
      if (cartItems.length === 0) {
        // Reset nextId when cart is cleared
        nextId = 1;
      }
    } else {
      res.sendStatus(404); // Send a not found response
    }
  });
  

// Get cart contents
app.get('/cart', (req, res) => {
  res.json(cartItems);
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Shopping Cart API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
