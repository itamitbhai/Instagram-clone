const mongoose = require('mongoose');

async function connectToDB() {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDb is connected")
    
}

module.exports = connectToDB;