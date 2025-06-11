const router = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validator/userVal');
const auth = require('../middleware/auth'); 
require('dotenv').config();


router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already in use, try another.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userData
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username },
      token
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
    });
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/email/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(`Error fetching user with email ${email}:`, err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(`Error fetching user with id ${id}:`, err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/users/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    if (parseInt(id) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this user' });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(`Error deleting user with id ${id}:`, err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
