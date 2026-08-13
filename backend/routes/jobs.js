const express = require('express');
const Job = require('../models/Job');
const Proposal = require('../models/Proposal');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all jobs with filters
router.get('/', async (req, res, next) => {
  try {
    const { category, search, minBudget, maxBudget, experienceLevel } = req.query;
    let query = { status: 'open' };
    if (category) query.category = category;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
    if (minBudget) query['budget.max'] = { $gte: Number(minBudget) };
    if (maxBudget) query['budget.min'] = { $lte: Number(maxBudget) };

    const jobs = await Job.find(query)
      .populate('client', 'name avatar rating')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) { next(err); }
});

// Get my posted jobs (client only)
router.get('/my', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json({ message: 'Only clients can view posted jobs' });
    const jobs = await Job.find({ client: req.user._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) { next(err); }
});

// Get single job
router.get('/:id', async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('client', 'name avatar rating totalReviews')
      .populate('hiredFreelancer', 'name avatar');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) { next(err); }
});

// Create job (client only)
router.post('/', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'client') return res.status(403).json({ message: 'Only clients can post jobs' });
    const job = new Job({ ...req.body, client: req.user._id });
    await job.save();
    await job.populate('client', 'name avatar rating');
    res.status(201).json(job);
  } catch (err) { next(err); }
});

// Update job
router.put('/:id', auth, async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, client: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) { next(err); }
});

// Hire freelancer
router.post('/:id/hire', auth, async (req, res, next) => {
  try {
    const { freelancerId } = req.body;
    const job = await Job.findOne({ _id: req.params.id, client: req.user._id, status: 'open' });
    if (!job) return res.status(404).json({ message: 'Job not found or not open' });

    const proposal = await Proposal.findOne({ job: job._id, freelancer: freelancerId });
    if (!proposal) return res.status(400).json({ message: 'Freelancer must submit a proposal first' });

    job.status = 'in-progress';
    job.hiredFreelancer = freelancerId;
    await job.save();
    await Proposal.updateMany({ job: job._id, status: 'pending' }, { status: 'rejected' });
    await Proposal.findOneAndUpdate({ job: job._id, freelancer: freelancerId }, { status: 'accepted' });
    res.json(job);
  } catch (err) { next(err); }
});

// Complete job
router.post('/:id/complete', auth, async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, client: req.user._id, status: 'in-progress' });
    if (!job) return res.status(404).json({ message: 'Job not found or not in progress' });
    job.status = 'completed';
    await job.save();
    res.json(job);
  } catch (err) { next(err); }
});

module.exports = router;
