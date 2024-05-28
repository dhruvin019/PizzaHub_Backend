// PS C:\Users\Virpara Dhruvin\.vscode\Backend\NodeJs\PizzaApp2\server> npm run dev

const express = require('express');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const connectDB = require("./config/config");
const cors = require('cors'); // Import the cors package
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
require("colors");

dotenv.config()

connectDB();

const app = express();

// middleware
app.use(cors()); 
app.use(morgan('dev'));
app.use(express.json());


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
}))


// Payment
const instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_PUBLIC_KEY,
    key_secret: process.env.RAZOR_PAY_SECRET_KEY,
  });
  
  module.exports.instance = instance;

// routes
app.use("/api/pizzas",require("./routes/pizzaRoute"));
app.use("/api/users",require("./routes/userRoute"));
app.use("/api/payment",require("./routes/paymentroute"));

app.get("/",(req, res) => {
    res.send("<h2>Hello From Server</h2>");
});



const Port = process.env.PORT || 8000
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`.bgMagenta.white);
});