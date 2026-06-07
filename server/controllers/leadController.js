const Lead = require('../models/Lead');

// Get all leads (with search + sort + pagination)
exports.getAllLeads = async (req, res) => {
  try {
    const { search, status, sort = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name:    { $regex: search, $options: 'i' } },
        { email:   { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Lead.countDocuments(query)
    ]);

    res.json({
      leads,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single lead
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create lead
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already exists' });
    res.status(400).json({ message: err.message });
  }
};

// Update lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Stats
exports.getStats = async (req, res) => {
  try {
    const stats = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const total = await Lead.countDocuments();
    res.json({ total, stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};