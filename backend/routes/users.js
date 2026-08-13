const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Update profile
router.put('/profile', auth, async (req, res, next) => {
  try {
    const updates = ['name', 'title', 'bio', 'skills', 'hourlyRate', 'location', 'avatar'];
    updates.forEach(field => { if (req.body[field] !== undefined) req.user[field] = req.body[field]; });
    await req.user.save();
    res.json(req.user);
  } catch (err) { next(err); }
});

// Search freelancers
router.get('/', async (req, res, next) => {
  try {
    const { search, skills, minRate, maxRate } = req.query;
    let query = { role: 'freelancer' };
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
      { bio: { $regex: search, $options: 'i' } }
    ];
    if (skills) query.skills = { $in: skills.split(',') };
    if (minRate) query.hourlyRate = { ...(query.hourlyRate || {}), $gte: Number(minRate) };
    if (maxRate) query.hourlyRate = { ...(query.hourlyRate || {}), $lte: Number(maxRate) };
    const users = await User.find(query).select('-password').sort({ rating: -1 });
    res.json(users);
  } catch (err) { next(err); }
});

// Get user profile
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

module.exports = router;
