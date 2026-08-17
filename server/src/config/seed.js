// server/src/config/seed.js
import mongoose from 'mongoose';
import 'dotenv/config';
import { Config } from '../models/Config.js';
import { Lead } from '../models/Lead.js';

const initialConfig = {
  config_version: 3,
  business: {
    name: "Northline Roofing & Exteriors",
    region: "Columbus, OH",
    currency: "USD"
  },
  questions: [
    {
      key: "roof_area",
      label: "Roughly how big is your roof?",
      type: "number",
      unit: "sq ft",
      required: true,
      min: 300,
      max: 12000,
      active: true
    },
    {
      key: "material",
      label: "What material do you want?",
      type: "select",
      required: true,
      active: true,
      options: [
        { value: "asphalt_3tab", label: "Asphalt shingle - 3-tab", rate_per_sqft: 4.25 },
        { value: "asphalt_arch", label: "Asphalt shingle - architectural", rate_per_sqft: 5.90 },
        { value: "metal_standing", label: "Standing seam metal", rate_per_sqft: 12.40 },
        { value: "cedar_shake", label: "Cedar shake", rate_per_sqft: 11.10 }
      ]
    },
    {
      key: "pitch",
      label: "How steep is the roof?",
      type: "select",
      required: true,
      active: true,
      options: [
        { value: "low", label: "Low - you could walk on it", multiplier: 1.0 },
        { value: "medium", label: "Medium", multiplier: 1.12 }, // sanitized string to number
        { value: "steep", label: "Steep - not walkable", multiplier: 1.30 }
      ]
    },
    {
      key: "layers",
      label: "How many layers of old roofing are on there now?",
      type: "select",
      required: true,
      active: true,
      options: [
        { value: "0", label: "None - new build", tear_off_per_sqft: 0 },
        { value: "1", label: "One layer", tear_off_per_sqft: 1.15 },
        { value: "2", label: "Two or more layers", tear_off_per_sqft: 2.05 }
      ]
    },
    {
      key: "stories",
      label: "How many stories is the house?",
      type: "select",
      required: true,
      active: true,
      options: [
        { value: "1", label: "Single storey", multiplier: 1.0 },
        { value: "2", label: "Two storeys", multiplier: 1.08 },
        { value: "3", label: "Three or more", multiplier: 1.18 }
      ]
    }
  ],
  modifiers: {
    waste_factor: 0.10,
    permit_flat_fee: 350,
    range_spread_pct: 12
  }
};

async function seed() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to DB...");

    await Config.deleteMany({});
    await Config.create(initialConfig);
    console.log("Config seeded successfully.");

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();