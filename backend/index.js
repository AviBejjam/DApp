import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Database URI
const dbURI = 'mongodb+srv://vipulthota:5KscNaB4KTmga1tP@cluster0.jj6kr.mongodb.net/DATABASE_512';

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log('Database connection error:', err));

// Define the schemas
const itemSchema = new mongoose.Schema({
  name: String,
  password: String,
  role: String,
  addr: { type: String, default: '0000XX' }
});

// ManSchema for product details
const manSchema = new mongoose.Schema({
  productTitle: { type: String, required: true },
  quantity: { type: Number, required: true },
  cost: {type: Number, required: true },
  manufacturer: { type: String, default: "" },
  distributor: { type: String, default: "" },
  retailer: { type: String, default: "" },
  consumer: { type: String, default: "" },
  state: { type: String, required: true },
  date: {timestamp: { type: Date, default: Date.now }},
  tx_hash: { type: String, default: "" },
  from_addr: { type: String, default: "" },
  to_addr: { type: String, default: "" },
});

// Models
const Item = mongoose.model('Item', itemSchema, 'Crypto');
const ManSchema = mongoose.model('ManSchema', manSchema, 'Product_details');

// Define API endpoints

// Add a new user (POST)
app.post('/api/items1', async (req, res) => {
  try {
    const { name, password } = req.body;
    const existingItem = await Item.findOne({ name, password });
    if (existingItem) {
      res.status(200).json({
        message: 'User found',
        item: {
          role: existingItem.role,
          addr: existingItem.addr,
        },
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register a new user (POST)
app.post('/api/items', async (req, res) => {
  try {
    const { name, password, role } = req.body;
    const existingItem = await Item.findOne({ name });
    if (existingItem) {
      res.status(400).json({ message: 'User already exists' });
    } else {
      const item = new Item({ name, password, role, addr: '0000XX' });
      await item.save();
      res.status(200).send('Item added successfully');
    }
  } catch (err) {
    res.status(500).send('Adding new item failed');
  }
});

// Create a new product (POST)
app.post('/api/products', async (req, res) => {
  try {
    const { productTitle, quantity, cost, manufacturer, distributor, retailer, consumer, state, date, tx_hash, from_addr, to_addr } = req.body;

    const newItem = new ManSchema({
      productTitle,
      quantity,
      cost,
      manufacturer: manufacturer || "",
      distributor: distributor || "",
      retailer: retailer || "",
      consumer: consumer || "",
      state,
      date,
      tx_hash,
      from_addr,
      to_addr
    });

    await newItem.save();
    res.status(201).json({ message: 'Product added successfully!', item: newItem });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

// Add multiple products (POST)
app.post('/api/addItems', async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const items = [];

    for (let i = 0; i < quantity; i++) {
      items.push({ name, quantity: 1 }); // setting quantity to 1 for each added item
    }

    await ManSchema.insertMany(items); // Changed from Product.insertMany to ManSchema.insertMany
    res.status(200).send('Items added successfully');
  } catch (err) {
    res.status(500).send('Adding items failed');
  }
});

// Get filtered products (GET)
app.get('/api/getItems', async (req, res) => {
  try {
    const { state, manufacturer, distributors, retailers, consumers } = req.query;
    const filter = {};

    // Filter products based on state and respective user roles
    if (state) filter.state = state;

    if (manufacturer) filter.manufacturer = { $in: manufacturer.split(',') };
    if (distributors) filter.distributor = { $in: distributors.split(',') };
    if (retailers) filter.retailer = { $in: retailers.split(',') };
    if (consumers) filter.consumer = { $in: consumers.split(',') };

    const items = await ManSchema.find(filter);
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// Update product details (PUT)
app.put('/api/updateProduct/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const {quantity, state, userName} = req.body;

    try{
      const product = await ManSchema.findById(itemId);
      if(!product) throw new Error('Product not found');

      product.quantity = quantity;

      await product.save();
      res.status(200).json({ message: "Product updated successfully", product });

    }
    catch(error){
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});


// Get product details by ID (GET)
app.get('/api/getDeeta/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const product = await ManSchema.findById(itemId);
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Failed to fetch product details', error: error.message });
  }
});

// Add a new product (POST)
app.post('/api/addProduct', async (req, res) => {
  try {
    const { productTitle, quantity, cost, manufacturer, distributor, retailer, consumer, state, date, tx_hash, from_addr, to_addr } = req.body;

    const newItem = new ManSchema({
      productTitle,
      quantity,
      cost,
      manufacturer: manufacturer || "",
      distributor: distributor || "",
      retailer: retailer || "",
      consumer: consumer || "",
      state,
      date,
      tx_hash,
      from_addr,
      to_addr
    });

    await newItem.save();
    res.status(201).json({ message: 'Product added successfully!', item: newItem });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
