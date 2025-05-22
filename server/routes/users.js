const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Mock user data - shared with auth.js in a real app
const mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
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
    profilePicture: '/uploads/default-avatar.png',
    bio: 'UX Designer',
    createdAt: new Date('2023-01-02'),
    followers: ['1'],
    following: ['1']
  },
  {
    _id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    profilePicture: '/uploads/default-avatar.png',
    bio: 'Product Manager',
    createdAt: new Date('2023-01-03'),
    followers: ['1', '2'],
    following: []
  }
];

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', (req, res) => {
  try {
    const userList = mockUsers.map(user => ({
      _id: user._id,
      name: user.name,
      profilePicture: user.profilePicture,
      bio: user.bio
    }));
    
    res.json(userList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const user = mockUsers.find(user => user._id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', (req, res) => {
  try {
    const { name, bio } = req.body;
    
    // In a real app, we'd check authentication
    
    const user = mockUsers.find(user => user._id === req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update user data
    user.name = name || user.name;
    user.bio = bio || user.bio;
    
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

// @route   POST api/users/:id/follow
// @desc    Follow user
// @access  Private
router.post('/:id/follow', (req, res) => {
  try {
    // In a real app, we'd get the user ID from the authentication token
    const currentUserId = '1'; // Mock current user (John Doe)
    const userToFollowId = req.params.id;
    
    if (currentUserId === userToFollowId) {
      return res.status(400).json({ msg: 'You cannot follow yourself' });
    }
    
    const currentUser = mockUsers.find(user => user._id === currentUserId);
    const userToFollow = mockUsers.find(user => user._id === userToFollowId);
    
    if (!userToFollow) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if already following
    if (currentUser.following.includes(userToFollowId)) {
      return res.status(400).json({ msg: 'You are already following this user' });
    }
    
    // Add to following/followers
    currentUser.following.push(userToFollowId);
    userToFollow.followers.push(currentUserId);
    
    res.json({ msg: 'User followed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/:id/unfollow
// @desc    Unfollow user
// @access  Private
router.post('/:id/unfollow', (req, res) => {
  try {
    // In a real app, we'd get the user ID from the authentication token
    const currentUserId = '1'; // Mock current user (John Doe)
    const userToUnfollowId = req.params.id;
    
    const currentUser = mockUsers.find(user => user._id === currentUserId);
    const userToUnfollow = mockUsers.find(user => user._id === userToUnfollowId);
    
    if (!userToUnfollow) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if not following
    if (!currentUser.following.includes(userToUnfollowId)) {
      return res.status(400).json({ msg: 'You are not following this user' });
    }
    
    // Remove from following/followers
    currentUser.following = currentUser.following.filter(id => id !== userToUnfollowId);
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id !== currentUserId);
    
    res.json({ msg: 'User unfollowed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET a user by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user profile
router.put('/:id', async (req, res) => {
  try {
    if (req.body.userId === req.params.id) {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } else {
      res.status(403).json({ msg: 'You can update only your account!' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
