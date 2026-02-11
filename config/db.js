require('dotenv').config();
const mongoose = require('mongoose');

function connectDB() {
    // Database connection 
    console.log("here")
    console.log(process.env.MONGO_CONNECTION_URL)
    mongoose.connect(process.env.MONGO_CONNECTION_URL, { 
        // useNewUrlParser: true, 
        // useUnifiedTopology: true, 
    }).catch(err => {
        console.log("❌ Database Connection Failed:", err.message);
    });
    
    const connection = mongoose.connection;

    connection.once('open', () => {
        console.log('Database connected.');
    });
}

module.exports = connectDB;