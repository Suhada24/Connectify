const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Mock posts data
const mockPosts = [
  {
    _id: '1',
    userId: '1',
    content: 'Just finished building a MERN stack application! #webdevelopment #javascript',
    image: '/uploads/post1.jpg',
    likes: ['2', '3'],
    comments: [
      { _id: '101', userId: '2', text: 'That looks amazing!', createdAt: new Date('2023-01-10') },
      { _id: '102', userId: '3', text: 'Great work!', createdAt: new Date('2023-01-11') }
    ],
    createdAt: new Date('2023-01-10')
  },
  {
    _id: '2',
    userId: '2',
    content: 'Working on a new UI design for our mobile app. Feedback welcome!',
    image: '/uploads/post2.jpg',
    likes: ['1'],
    comments: [
      { _id: '103', userId: '1', text: 'Love the colors!', createdAt: new Date('2023-01-15') }
    ],
    createdAt: new Date('2023-01-15')
  },
  {
    _id: '3',
    userId: '3',
    content: 'Product roadmap for Q1 is finalized. Excited about the new features!',
    image: null,
    likes: [],
    comments: [],
    createdAt: new Date('2023-01-20')
  }
];

// Mock user data for post user info
const mockUsers = [
  { _id: '1', name: 'John Doe', profilePicture: '/uploads/default-avatar.png' },
  { _id: '2', name: 'Jane Smith', profilePicture: '/uploads/default-avatar.png' },
  { _id: '3', name: 'Bob Johnson', profilePicture: '/uploads/default-avatar.png' }
];

// Helper function to add user info to posts
const addUserInfoToPosts = (posts) => {
  return posts.map(post => {
    const user = mockUsers.find(u => u._id === post.userId);
    return {
      ...post,
      user: {
        _id: user._id,
        name: user.name,
        profilePicture: user.profilePicture
      },
      comments: post.comments.map(comment => {
        const commentUser = mockUsers.find(u => u._id === comment.userId);
        return {
          ...comment,
          user: {
            _id: commentUser._id,
            name: commentUser.name,
            profilePicture: commentUser.profilePicture
          }
        };
      })
    };
  });
};

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', (req, res) => {
  try {
    const postsWithUserInfo = addUserInfoToPosts(mockPosts);
    res.json(postsWithUserInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const post = mockPosts.find(p => p._id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    const postsWithUserInfo = addUserInfoToPosts([post]);
    res.json(postsWithUserInfo[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', (req, res) => {
  try {
    const { content, image } = req.body;
    
    // In a real app, we would get the user ID from auth middleware
    const userId = '1'; // Mock as John Doe
    
    const newPost = {
      _id: (mockPosts.length + 1).toString(),
      userId,
      content,
      image: image || null,
      likes: [],
      comments: [],
      createdAt: new Date()
    };
    
    mockPosts.unshift(newPost);
    
    const postsWithUserInfo = addUserInfoToPosts([newPost]);
    res.json(postsWithUserInfo[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', (req, res) => {
  try {
    const postIndex = mockPosts.findIndex(p => p._id === req.params.id);
    
    if (postIndex === -1) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // In a real app, check if user owns the post
    
    mockPosts.splice(postIndex, 1);
    
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/posts/:id/like
// @desc    Like a post
// @access  Private
router.put('/:id/like', (req, res) => {
  try {
    const post = mockPosts.find(p => p._id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // In a real app, get user ID from auth middleware
    const userId = '1'; // Mock as John Doe
    
    // Check if post already liked
    if (post.likes.includes(userId)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }
    
    post.likes.push(userId);
    
    res.json({ likes: post.likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/posts/:id/unlike
// @desc    Unlike a post
// @access  Private
router.put('/:id/unlike', (req, res) => {
  try {
    const post = mockPosts.find(p => p._id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    // In a real app, get user ID from auth middleware
    const userId = '1'; // Mock as John Doe
    
    // Check if post has not been liked
    if (!post.likes.includes(userId)) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }
    
    // Remove like
    post.likes = post.likes.filter(id => id !== userId);
    
    res.json({ likes: post.likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts/:id/comment
// @desc    Comment on a post
// @access  Private
router.post('/:id/comment', (req, res) => {
  try {
    const post = mockPosts.find(p => p._id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    
    const { text } = req.body;
    
    // In a real app, get user ID from auth middleware
    const userId = '1'; // Mock as John Doe
    
    const newComment = {
      _id: Date.now().toString(),
      userId,
      text,
      createdAt: new Date()
    };
    
    post.comments.push(newComment);
    
    // Add user info to the comment
    const user = mockUsers.find(u => u._id === userId);
    const commentWithUser = {
      ...newComment,
      user: {
        _id: user._id,
        name: user.name,
        profilePicture: user.profilePicture
      }
    };
    
    res.json(commentWithUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
