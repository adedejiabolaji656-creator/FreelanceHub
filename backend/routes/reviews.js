const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const router = express.Router();

// Create review
router.post('/', auth, async (req, res, next) => {
  try {
    const { job, reviewee, rating, comment } = req.body;
    const jobDoc = await Job.findById(job);
    if (!jobDoc || jobDoc.status !== 'completed') return res.status(400).json({ message: 'Job must be completed to review' });
    if (!jobDoc.hiredFreelancer) return res.status(400).json({ message: 'No freelancer was hired for this job' });
    if (jobDoc.client.toString() !== req.user._id.toString() && jobDoc.hiredFreelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const reviewerIsClient = jobDoc.client.toString() === req.user._id.toString();
    const expectedReviewee = reviewerIsClient ? jobDoc.hiredFreelancer.toString() : jobDoc.client.toString();
    if (!reviewee || reviewee.toString() !== expectedReviewee) {
      return res.status(400).json({ message: 'You can only review the other party on this job' });
    }

    const review = new Review({ job, reviewer: req.user._id, reviewee, rating, comment });
    await review.save();

    // Update user rating
    const reviews = await Review.find({ reviewee });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(reviewee, { rating: Math.round(avgRating * 10) / 10, totalReviews: reviews.length });

    res.status(201).json(review);
  } catch (err) { next(err); }
});

// Get reviews for user
router.get('/user/:userId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar role')
      .populate('job', 'title')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { next(err); }
});

module.exports = router;
