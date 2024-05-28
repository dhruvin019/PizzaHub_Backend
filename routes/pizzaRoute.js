const express = require('express')
const router = express.Router();
const pizzaModel = require('../models/pizzaModel');
const cloudinary = require('cloudinary').v2;

          
cloudinary.config({ 
  cloud_name: 'dzcgfjrn7', 
  api_key: '762528749176861', 
  api_secret: 'wECFSKQXSdE7H8bCAz253zjJ7y8' 
});

// Get ALLL Pizza
router.get('/getAllPizzas', async (req, res) => {
    try {
        const pizzas = await pizzaModel.find({})
        res.send(pizzas);
        
    } catch (error) {
        res.send({message:error})
        
    }
})


// Add Pizza
router.post('/addpizza', async (req, res) => {
    try {
        const file = req.files.image;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        const { name, varients, price, category, description } = req.body;
        const newPizza = new pizzaModel({
            name,
        // varients,
        //  price,
            varients: JSON.parse(varients),
            price: JSON.parse(price),
            category,
            image: result.secure_url,
            description
        });
        await newPizza.save();
        res.status(200).json({
            message: "Pizza added successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




router.get('/getPizzabyId/:id',async (req,res) =>{
    try{
        const { id } = req.params;
        const pizza = await pizzaModel.findById(id);
        res.status(200).send(pizza);
        
    }
    catch(error) {
        res.status(500).json({
            Success: false,
            message: error,
        });
    }
});




router.put('/updatePizza/:id',async(req,res)=>{
    const { id } = req.params;
    const {name,varients,price,category,image,description} =req.body;
    try{
        const updated = await pizzaModel.findByIdAndUpdate(id,
            {
                name, 
                varients: JSON.parse(varients),
                price: JSON.parse(price),
                category, 
                image, 
                description
            },
            { new: true });
        res.status(200).send(updated);      
    }
    catch(err){
        console.log(err);
    }
})

module.exports = router


// router.delete('/deletepizza/:id',async(req,res)=>{
//     const {id} =req.params;
//     try{
//         await pizzaModel.delete(id);
//         res.status(200).json({
//             message: "Pizza deleted successfully"
//         })
//     }
//     catch(err){
//         console.log(err);
//         res.status(500);
//     }
// })

router.delete('/deletepizza/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPizza = await pizzaModel.findByIdAndDelete(id);
        res.status(200).json({
            message: "Pizza deleted successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});
