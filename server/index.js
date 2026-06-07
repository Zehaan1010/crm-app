const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/leads', require('./routes/leads'));

app.get('/', (req, res) => res.send('CRM API running'));

const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('Missing MONGO_URI in .env. Add a valid MongoDB connection string to server/.env.');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('DB connection error:', err.message);
    process.exit(1);
  });