/**
 * Member 1 Feature: User Authentication & Role Management
 * Endpoints:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   GET  /api/auth/me
 *   GET  /api/auth/users
 */

const express = require('express');
const router = express.Router();
const { dbHelper } = require('../db/database');

// Register a new user
router.post('/register', (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = dbHelper.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const newUser = dbHelper.createUser(name.trim(), email.trim().toLowerCase(), password, role || 'owner', phone || '');
    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      user: newUser
    });
  } catch (err) {
    console.error('[Auth Error]', err);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// User login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = dbHelper.findUserByEmail(email.trim().toLowerCase());
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const { password: _, ...safeUser } = user;
    return res.json({
      success: true,
      message: 'Logged in successfully!',
      user: safeUser
    });
  } catch (err) {
    console.error('[Login Error]', err);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// Current user verification
router.get('/me', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Missing x-user-id header.' });
  }
  const user = dbHelper.findUserById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  return res.json({ success: true, user });
});

// List all users (useful for dropdowns and role switcher)
router.get('/users', (req, res) => {
  try {
    const users = dbHelper.getAllUsers();
    return res.json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching users.' });
  }
});

module.exports = router;
