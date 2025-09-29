require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---
app.use('/api', require('./routes/api'));

// --- DATABASE CONNECTION OPTIONS (CRITICAL FIXES) ---
const dbOptions = {
    // These options are required for Atlas/Mongoose compatibility
    // *** FIX: ADDED COMMA HERE TO RESOLVE SyntaxError: Unexpected token ':' ***
    useNewUrlParser: true, 
    useUnifiedTopology: true 
};

// --- DATABASE CONNECTION ---
// Connect to the MongoDB Atlas cluster using the URI from your .env file
mongoose.connect(process.env.MONGODB_URI, dbOptions) // Pass the options here!
    .then(() => {
        console.log('✅ MongoDB connected successfully.');
        
        // Start the server ONLY after the database is connected
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        // Log the specific error message for easier troubleshooting
        console.error('❌ MongoDB connection error:', err.message);
        console.error('Check .env file for correct MONGODB_URI (password, cluster name, database name, and parameters).');
        process.exit(1); 
    });
