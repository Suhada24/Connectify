const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock user data for demo purposes
const mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$7JOBFABlw6ojaLUU/IADKuHnEiVZQub2PbRvJL62H0MqRlw5iKGzm', // 'password123'
    profilePicture: '/uploads/default-avatar.png',
    bio: 'Software Developer',
    createdAt: new Date('2023-01-01'),
    followers: [],
    following: []
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '$2a$10$7JOBFABlw6ojaLUU/IADKuHnEiVZQub2PbRvJL62H0MqRlw5iKGzm', // 'password123'
    profilePicture: '/uploads/default-avatar.png',
    bio: 'UX Designer',
    createdAt: new Date('2023-01-02'),
    followers: ['1'],
    following: ['1']
  }
];

// Get JWT secret from environment or use a default (only for development)
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret && process.env.NODE_ENV === 'production') {
    console.error('JWT_SECRET not set in production environment');
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  
  return secret || 'dev_secret_only_for_development';
};

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    if (mockUsers.find(user => user.email === email)) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Create a new mock user
    const newUser = {
      _id: (mockUsers.length + 1).toString(),
      name,
      email,
      password: 'hashedPassword', // In a real app, this would be hashed
      profilePicture: '/uploads/default-avatar.png',
      bio: '',
      createdAt: new Date(),
      followers: [],
      following: []
    };
    
    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id },
      getJwtSecret(),
      { expiresIn: '30d' }
    );
    
    res.json({
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        bio: newUser.bio
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = mockUsers.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    
    // In a real app, we would compare passwords here
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      getJwtSecret(),
      { expiresIn: '30d' }
    );
    
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', (req, res) => {
  try {
    // Normally we would authenticate with middleware
    // For demo, just return a mock user
    const user = mockUsers[0];
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
