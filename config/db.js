const mongoose = require('mongoose');

function connectDB() {
    // Database connection 
    const url = process.env.MONGO_CONNECTION_URL;
    if (!url) {
        console.error("❌ MONGO_CONNECTION_URL is missing in .env file");
        return;
    }

    mongoose.connect(url, { 
        // useNewUrlParser: true, 
        // useUnifiedTopology: true, 
    }).catch(err => {
        console.log("❌ Database Connection Failed:", err.message);
        console.log("💡 Tip: Check if your MongoDB URI is correct and your IP is whitelisted.");
    });
    
    const connection = mongoose.connection;

    connection.once('open', () => {
        console.log('Database connected.');
    });

    connection.on('error', (err) => {
        console.error('❌ MongoDB Connection Error:', err);
    });
}

module.exports = connectDB;