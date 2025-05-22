# Connectify

A social media web application with real-time chat capabilities built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.

## Features

- User authentication
- User profiles
- Social posts with likes and comments
- Real-time messaging
- File uploads for profile pictures and post images

## Prerequisites

- Node.js (v16.x or later)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository
```
git clone <your-repo-url>
cd connectify
```

2. Install dependencies
```
npm run install-all
```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
```
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

## Running the Application

### Development Mode
```
npm run dev
```
This will start both the server (port 5000) and client (port 3000) concurrently.

### Production Build
```
npm run build
npm start
```
This will build the React client and serve it through Express.

## Deployment

### Environment Setup for Production

Before deploying, ensure you have the following environment variables set in your production environment:

```
NODE_ENV=production
PORT=5000 (or the port provided by your hosting platform)
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-app-domain.com
```

### Heroku Deployment

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku and create a new app
```
heroku login
heroku create your-app-name
```

3. Set up environment variables on Heroku
```
heroku config:set MONGO_URI=your_production_mongodb_uri
heroku config:set JWT_SECRET=your_production_jwt_secret
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
```

4. Deploy to Heroku
```
git push heroku main
```

### Railway Deployment

1. Create a Railway account and install the Railway CLI
2. Login to Railway and initialize a new project
```
railway login
railway init
```

3. Set up environment variables on Railway
```
railway variables set MONGO_URI=your_production_mongodb_uri
railway variables set JWT_SECRET=your_production_jwt_secret
railway variables set NODE_ENV=production
railway variables set CLIENT_URL=https://your-railway-app-domain.up.railway.app
```

4. Deploy to Railway
```
railway up
```

### Render Deployment

1. Create a Render account
2. Connect your GitHub repository
3. Create a new Web Service
4. Configure the service:
   - Build Command: `npm install && npm run install-client && npm run build`
   - Start Command: `npm start`
5. Add environment variables in the Render dashboard

### MongoDB Atlas Setup for Production

1. Create a MongoDB Atlas account if you don't have one
2. Create a new cluster
3. Create a database user with appropriate permissions
4. Whitelist your IP address or allow access from anywhere (0.0.0.0/0)
5. Get your connection string and replace the placeholder in your environment variables

## Project Structure
```
├── client/             # React frontend
│   ├── public/         # Static files
│   └── src/            # Source files
│       ├── api/        # API service
│       ├── components/ # Reusable components  
│       ├── pages/      # Page components
│       └── redux/      # State management
├── server/             # Express backend
│   ├── config/         # Configuration
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   └── uploads/        # Uploaded files
└── package.json        # Project configuration
```

## Troubleshooting Deployment

### Common Issues

1. **MongoDB Connection Fails**
   - Check if your MongoDB URI is correct
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify that your database user has the correct permissions

2. **Application Crashes on Startup**
   - Check logs using `heroku logs --tail` or your platform's equivalent
   - Verify all required environment variables are set
   - Ensure your Node.js version is compatible with your hosting platform

3. **Socket.io Connection Issues**
   - Ensure your CLIENT_URL environment variable is set correctly
   - Check if your hosting platform supports WebSockets
   - Verify CORS configuration in your server/index.js file

## License

MIT