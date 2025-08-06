const Deal = require('../Deals');
const selectTodaysDeals = require('../selcetTodayDeal');


const dealController = require('express').Router();

dealController.get('/today', async (req, res) => {
    try {
        const today = new Date();
        console.log("Deal Model:", today);  // Debugging line
        const deal = await Deal.find({
            startDate: { $lte: today },
            endDate: { $gte: today },
        }).populate('product')
        .limit(20);
        res.json(deal);
        console.log("Deal Model:", deal); 
        
    } catch (error) {
        console.error('Error fetching today\'s deals:', error);
        res.status(500).json({ error: error.message });
    }
});

// dealController.post('/create', async (req, res) => {
//     try {
//         const { productId, discountPercentage, startDate, endDate } = req.body;
//         const newDeal = new Deal({
//             product: productId,
//             discountPercentage,
//             startDate: new Date(startDate),
//             endDate: new Date(endDate),
//         });
//         await newDeal.save();
//         res.status(201).json(newDeal)
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

dealController.post('select-today',async(req,res)=>{
    try{
        await selectTodaysDeals();
        res.status(200).json({message:"Today's Deal Products"});

    }
    catch(error){
        res.status(500).json({error:error.message})
    }
})

module.exports = dealController;