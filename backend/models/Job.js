const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  skillsRequired: [{ type: String }],
  budget: {
    type: { type: String, enum: ['fixed', 'hourly'], required: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  duration: { type: String, default: '' },
  experienceLevel: { type: String, enum: ['entry', 'intermediate', 'expert'], default: 'entry' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'in-progress', 'completed', 'cancelled'], default: 'open' },
  hiredFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  proposalsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
