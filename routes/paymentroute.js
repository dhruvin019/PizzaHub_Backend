const express = require("express");
const crypto = require("crypto");
const { instance } = require("../server");
const router = express.Router();
const Payment = require("../models/paymentModel");


router.post('/checkout',async (req,res) =>{

   try{
    const options = {
        amount: Number(req.body.subTotal * 100),  // amount in the smallest currency unit
        currency: "INR",
        
      };
      const order = await instance.orders.create(options);

      
      res.status(200).json({
        success: true,
        order,
      })
   }
   catch(error){
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
   }


});

router.post('/paymentverification',async (req,res) =>{

  console.log("Request body:", req.body);
  const { razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;


  var expectedSignature = crypto
    .createHmac('sha256',process.env.RAZOR_PAY_SECRET_KEY)
    .update(body.toString())
    .digest('hex');

    console.log("sig received " ,razorpay_signature);
    console.log("sig generated " ,expectedSignature);


    const isAuthentic = expectedSignature === razorpay_signature;

    if(isAuthentic){

      // await Payment.create({
      //   razorpay_payment_id,
      //   razorpay_order_id,
      //   razorpay_signature
      // })
      res.redirect(`/paymentsuccess?payment_id=${razorpay_payment_id}&order_id=${razorpay_order_id}`);
  
    }
    else{
      res.status(400).json({
        success:false
      })
    }

});

router.get('/getkey',(req,res) =>
  res.status(200).json({key:process.env.RAZOR_PAY_PUBLIC_KEY})
)


router.post('/paymentsave',(req,res) => {
  const {payment_id,order_id,cartItemsdetail,useremail} = req.body;
  console.log(cartItemsdetail);
  const payment = new Payment({payment_id,order_id,cartItemsdetail,useremail});
  try{
    payment.save();
    res.status(200).json({success:true});
  }
  catch(error){
    res.status(400).json({success:false});
  }
})

router.get('/allorders',async (req, res)=>{
  try{
    const orders = await Payment.find({});
    res.status(200).send(orders);
    console.log(orders);
  }
  catch(error) {
    res.status(400).json({
      message: error,
    });
  }
  
})
router.get('/orders',async (req, res)=>{
  const { useremail } = req.query; 
  try{
    const orders = await Payment.find({useremail});
    res.status(200).send(orders);
    console.log(orders);
  }
  catch(error) {
    res.status(400).json({
      message: error,
    });
  }
  
})
module.exports = router;