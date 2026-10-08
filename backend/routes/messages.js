const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const router = express.Router();

// Get conversation
router.get('/:userId', auth, async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    }).sort({ createdAt: 1 }).populate('sender recipient', 'name avatar');
    res.json(messages);
  } catch (err) { next(err); }
});

// Get conversations list
router.get('/', auth, async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }]
    }).sort({ createdAt: -1 }).populate('sender recipient', 'name avatar');

    const conversations = {};
    messages.forEach(msg => {
      const otherId = msg.sender._id.toString() === req.user._id.toString() ? msg.recipient._id.toString() : msg.sender._id.toString();
      if (!conversations[otherId]) conversations[otherId] = { user: msg.sender._id.toString() === otherId ? msg.sender : msg.recipient, lastMessage: msg, unread: 0 };
      if (!msg.read && msg.recipient._id.toString() === req.user._id.toString()) conversations[otherId].unread++;
    });
    res.json(Object.values(conversations));
  } catch (err) { next(err); }
});

// Send message
router.post('/', auth, async (req, res, next) => {
  try {
    const { recipient, content } = req.body;
    const message = new Message({ sender: req.user._id, recipient, content });
    await message.save();
    await message.populate('sender', 'name avatar');

    if (req.io && typeof req.io.to === 'function') req.io.to(recipient).emit('newMessage', message);
    res.status(201).json(message);
  } catch (err) { next(err); }
});

module.exports = router;
