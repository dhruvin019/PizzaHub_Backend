const mongoose = require("mongoose");
require("colors");
const connectDB = async () => {
    try {
        const url = process.env.MONGO_URL;
        const conn = await mongoose.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            
        });
        console.log(`Database Connected`.bgBlue.white);
    } catch (error) {
        console.log(`MONGO Connect ERROR`.bgRed.white, error); // Log the full error message
    }
};

module.exports = connectDB;
