const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  phone:       { type: String, required: true },
  company:     { type: String, required: true },
  status:      {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
    default: 'New'
  },
  notes:       { type: String },
  createdAt:   { type: Date, default: Date.now }
});

// Enable search
leadSchema.index({ name: 'text', email: 'text', company: 'text' });

module.exports = mongoose.model('Lead', leadSchema);    