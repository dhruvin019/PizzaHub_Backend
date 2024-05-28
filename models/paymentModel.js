const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    payment_id: {
        type: String,
        required: true,
    },
    order_id: {
        type: String,
        required: true,
    },
    useremail: {
        type: String,
        required: true,
    },
    cartItemsdetail: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                
            }
        }
    ]
});

module.exports = mongoose.model("Payment", paymentSchema);
