// server/src/index.js
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { Config } from './models/Config.js';
import { Lead } from './models/Lead.js';
import { calculateEstimate } from './services/calculator.js';
import { requireOwnerAuth } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/roofing_db';

// server/src/index.js

// Root welcoming route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Roofing Estimator API is running',
    endpoints: {
      publicConfig: '/api/config',
      estimate: '/api/estimate',
      adminConfig: '/api/admin/config',
      adminLeads: '/api/admin/leads'
    }
  });
});

// 1. Middleware Setup
app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// 2. Health check route to test independently
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// 3. Public Estimator Routes
app.get('/api/config', async (req, res) => {
  try {
    const config = await Config.findOne();
    if (!config) {
      return res.status(404).json({ error: 'Config not found. Please run the seed script.' });
    }
    const publicData = config.toObject();
    publicData.questions = publicData.questions.filter(q => q.active === true);
    res.json(publicData);
  } catch (err) {
    console.error('Error in /api/config:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/estimate', async (req, res) => {
  try {
    const { contact, answers } = req.body;
    if (!contact || !contact.name || !contact.email || !answers) {
      return res.status(400).json({ error: 'Missing contact details or answers' });
    }

    const config = await Config.findOne();
    if (!config) return res.status(500).json({ error: 'Configuration missing' });

    const result = calculateEstimate(config, answers);

    const lead = new Lead({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      answers,
      estimate_low: result.estimate_low,
      estimate_high: result.estimate_high,
      config_version: config.config_version
    });

    await lead.save();
    res.json(result);
  } catch (err) {
    console.error('Error in /api/estimate:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Protected Admin Routes
app.use('/api/admin', requireOwnerAuth);

app.get('/api/admin/config', async (req, res) => {
  try {
    const config = await Config.findOne();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/config', async (req, res) => {
  try {
    const config = await Config.findOne();
    if (!config) return res.status(404).json({ error: 'Config not found' });

    config.config_version += 1;
    if (req.body.business) config.business = req.body.business;
    if (req.body.modifiers) config.modifiers = req.body.modifiers;
    if (req.body.questions) config.questions = req.body.questions;

    await config.save();
    res.json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Connect to MongoDB and Start Server
console.log('Attempting to connect to MongoDB at:', DATABASE_URL);

mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Roofing API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });