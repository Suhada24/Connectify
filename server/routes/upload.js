const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// @route   POST api/upload
// @desc    Upload image
// @access  Private
router.post('/', (req, res) => {
  try {
    // In a real app, we would use multer to handle file uploads
    // For the mock version, we'll just simulate success
    
    // Mock file details
    const mockFile = {
      filename: `upload_${Date.now()}.jpg`,
      path: `/uploads/mock_image_${Date.now()}.jpg`
    };
    
    res.json({
      success: true,
      file: mockFile.path
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create a default avatar image if it doesn't exist
const defaultAvatarPath = path.join(uploadsDir, 'default-avatar.png');
if (!fs.existsSync(defaultAvatarPath)) {
  // In a real app, we'd copy a default image
  // For the mock version, we'll just create an empty file
  fs.writeFileSync(defaultAvatarPath, '');
}

module.exports = router;
