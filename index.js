const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// gadget-db connect
mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'gadget-db' 
})
    .then(() => console.log("MongoDB Connected: Gadget-Groove Cloud DB"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Model collection items save
const productSchema = new mongoose.Schema({
    title: String,
    category: String,
    price: Number,
    image: String,
    description: String,
    stock: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});


const Product = mongoose.model('Product', productSchema, 'items');

// --- API Endpoints ---

// Get all hardware products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new hardware 
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const saved = await newProduct.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
  res.send('Gadget Groove server connected successfully!')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));