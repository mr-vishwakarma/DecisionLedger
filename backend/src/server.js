const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');


dotenv.config({ path: path.join(__dirname, '../.env') }); 

const app = express();


const authRoutes = require('./routes/authRoutes');
const decisionRoutes = require('./routes/decisionRoutes');
const teamRoutes = require('./routes/teamRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');


app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://127.0.0.1:5173', 
  'http://127.0.0.1:5174',
  'https://decisonledger.vercel.app',
  'https://deia1tldjx3jx.cloudfront.net'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use('/api/auth', authRoutes);
app.use('/api/decisions', decisionRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);


app.get('/', (req, res) => {
  res.send('DecisionLedger API is running...');
});


module.exports = app;


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/decision_ledger';


if (require.main === module) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB Connected');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    })
    .finally(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
}

