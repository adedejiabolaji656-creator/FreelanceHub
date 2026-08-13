const express = require('express');
const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

// Submit proposal
router.post('/', auth, async (req, res, next) => {
  try {
    if (req.user.role !== 'freelancer') return res.status(403).json({ message: 'Only freelancers can submit proposals' });
    const { job, coverLetter, proposedBudget, estimatedDuration } = req.body;

    const jobDoc = await Job.findById(job);
    if (!jobDoc || jobDoc.status !== 'open') return res.status(400).json({ message: 'Job not available' });

    const existing = await Proposal.findOne({ job, freelancer: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already submitted a proposal for this job' });

    const proposal = new Proposal({ job, freelancer: req.user._id, coverLetter, proposedBudget, estimatedDuration });
    await proposal.save();
    jobDoc.proposalsCount += 1;
    await jobDoc.save();
    await proposal.populate('freelancer', 'name avatar rating');
    res.status(201).json(proposal);
  } catch (err) { next(err); }
});

// Get proposals for a job (client only)
router.get('/job/:jobId', auth, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.client.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });

    const proposals = await Proposal.find({ job: req.params.jobId })
      .populate('freelancer', 'name avatar rating title hourlyRate')
      .sort({ createdAt: -1 });
    res.json(proposals);
  } catch (err) { next(err); }
});

// Get my proposals (freelancer)
router.get('/my', auth, async (req, res, next) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user._id })
      .populate('job', 'title status budget client')
      .populate('job.client', 'name')
      .sort({ createdAt: -1 });
    res.json(proposals);
  } catch (err) { next(err); }
});

module.exports = router;
