const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {

  try {

    const { name, email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email });

    if (existing) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);

    const hashed = await bcrypt.hash(password, salt);

  // Password will be hashed before saving to the database
    const user = new User({ name, email, password: hashed });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (err) {

    console.error(err);

    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

  } catch (err) {

    console.error(err);
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

