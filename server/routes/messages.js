const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Mock messages data
const mockMessages = [
  {
    _id: '1',
    conversationId: '101',
    sender: '1', // John Doe
    receiver: '2', // Jane Smith
    text: 'Hi Jane, how are you?',
    createdAt: new Date('2023-01-15T10:30:00')
  },
  {
    _id: '2',
    conversationId: '101',
    sender: '2', // Jane Smith
    receiver: '1', // John Doe
    text: 'Hey John! I\'m good, working on some UI designs. How about you?',
    createdAt: new Date('2023-01-15T10:35:00')
  },
  {
    _id: '3',
    conversationId: '101',
    sender: '1', // John Doe
    receiver: '2', // Jane Smith
    text: 'Just working on a new web app. Would love your feedback on it!',
    createdAt: new Date('2023-01-15T10:40:00')
  },
  {
    _id: '4',
    conversationId: '102',
    sender: '1', // John Doe
    receiver: '3', // Bob Johnson
    text: 'Bob, do you have the product roadmap ready?',
    createdAt: new Date('2023-01-16T09:00:00')
  },
  {
    _id: '5',
    conversationId: '102',
    sender: '3', // Bob Johnson
    receiver: '1', // John Doe
    text: 'Yes, just finished it. I\'ll share it with you today.',
    createdAt: new Date('2023-01-16T09:05:00')
  }
];

// Mock conversation data
const mockConversations = [
  {
    _id: '101',
    participants: ['1', '2'],
    lastMessage: 'Just working on a new web app. Would love your feedback on it!',
    lastMessageTime: new Date('2023-01-15T10:40:00')
  },
  {
    _id: '102',
    participants: ['1', '3'],
    lastMessage: 'Yes, just finished it. I\'ll share it with you today.',
    lastMessageTime: new Date('2023-01-16T09:05:00')
  }
];

// Mock user data for messages
const mockUsers = [
  { _id: '1', name: 'John Doe', profilePicture: '/uploads/default-avatar.png' },
  { _id: '2', name: 'Jane Smith', profilePicture: '/uploads/default-avatar.png' },
  { _id: '3', name: 'Bob Johnson', profilePicture: '/uploads/default-avatar.png' }
];

// @route   GET api/messages/conversations
// @desc    Get all conversations for a user
// @access  Private
router.get('/conversations', (req, res) => {
  try {
    // In a real app, we would get the user ID from auth middleware
    const userId = '1'; // Mock as John Doe
    
    // Find all conversations that the user is part of
    const userConversations = mockConversations.filter(conv => 
      conv.participants.includes(userId)
    );
    
    // Add other participant's info to each conversation
    const conversationsWithUserInfo = userConversations.map(conv => {
      const otherParticipantId = conv.participants.find(id => id !== userId);
      const otherParticipant = mockUsers.find(user => user._id === otherParticipantId);
      
      return {
        ...conv,
        otherParticipant: {
          _id: otherParticipant._id,
          name: otherParticipant.name,
          profilePicture: otherParticipant.profilePicture
        }
      };
    });
    
    res.json(conversationsWithUserInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/messages/:conversationId
// @desc    Get messages for a conversation
// @access  Private
router.get('/:conversationId', (req, res) => {
  try {
    // In a real app, we would check if the user is part of this conversation
    const conversationId = req.params.conversationId;
    
    // Find all messages for the conversation
    const conversationMessages = mockMessages.filter(msg => 
      msg.conversationId === conversationId
    );
    
    // Add user info to each message
    const messagesWithUserInfo = conversationMessages.map(msg => {
      const sender = mockUsers.find(user => user._id === msg.sender);
      
      return {
        ...msg,
        sender: {
          _id: sender._id,
          name: sender.name,
          profilePicture: sender.profilePicture
        }
      };
    });
    
    res.json(messagesWithUserInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post('/', (req, res) => {
  try {
    const { receiver, text } = req.body;
    
    // In a real app, we would get the user ID from auth middleware
    const sender = '1'; // Mock as John Doe
    
    // Check if a conversation already exists between these users
    let conversation = mockConversations.find(conv => 
      conv.participants.includes(sender) && conv.participants.includes(receiver)
    );
    
    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = {
        _id: Date.now().toString(),
        participants: [sender, receiver],
        lastMessage: text,
        lastMessageTime: new Date()
      };
      mockConversations.push(conversation);
    } else {
      // Update the last message in the conversation
      conversation.lastMessage = text;
      conversation.lastMessageTime = new Date();
    }
    
    // Create the new message
    const newMessage = {
      _id: Date.now().toString(),
      conversationId: conversation._id,
      sender,
      receiver,
      text,
      createdAt: new Date()
    };
    mockMessages.push(newMessage);
    
    // Add sender info to the message
    const senderUser = mockUsers.find(user => user._id === sender);
    const messageWithSender = {
      ...newMessage,
      sender: {
        _id: senderUser._id,
        name: senderUser.name,
        profilePicture: senderUser.profilePicture
      }
    };
    
    res.json(messageWithSender);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
