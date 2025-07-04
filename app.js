const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let products = [
  { id: 1, name: "Cheese", price: 100, quantity: 10, weight: 0.2, expiry: "2025-12-01", shippable: true },
  { id: 2, name: "Biscuits", price: 150, quantity: 5, weight: 0.7, expiry: "2025-11-01", shippable: true },
  { id: 3, name: "TV", price: 3000, quantity: 3, weight: 10, shippable: true },
  { id: 4, name: "Scratch Card", price: 50, quantity: 100, shippable: false }
];

let customer = { name: "Zeyad", balance: 1000 };
let cart = [];

app.get('/products', (req, res) => res.json(products));

app.post('/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);

  if (!product) return res.status(404).json({ error: "Product not found" });
  if (product.quantity < quantity) return res.status(400).json({ error: "Insufficient stock" });

  cart.push({ ...product, quantity });
  product.quantity -= quantity;

  res.json({ message: "Added to cart", cart });
});

app.post('/checkout', (req, res) => {
  if (cart.length === 0) return res.status(400).json({ error: "Cart is empty" });

  let subtotal = 0;
  let shippingItems = [];
  for (const item of cart) {
    if (item.expiry && new Date(item.expiry) < new Date()) {
      return res.status(400).json({ error: `${item.name} is expired` });
    }
    subtotal += item.price * item.quantity;
    if (item.shippable) {
      shippingItems.push(item);
    }
  }

  const shippingFee = 30;
  const total = subtotal + shippingFee;

  if (customer.balance < total) return res.status(400).json({ error: "Insufficient balance" });

  customer.balance -= total;
  const receipt = {
    shipment: shippingItems.map(item => `${item.quantity}x ${item.name} ${item.weight * 1000}g`),
    totalWeight: shippingItems.reduce((sum, item) => sum + item.weight * item.quantity, 0).toFixed(1),
    receipt: cart.map(item => `${item.quantity}x ${item.name} ${item.price * item.quantity}`),
    subtotal,
    shipping: shippingFee,
    total,
    balanceAfter: customer.balance
  };

  cart = [];
  res.json(receipt);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
