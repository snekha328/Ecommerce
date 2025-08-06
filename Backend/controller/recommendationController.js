const express = require('express');
//const { verifyToken } = require('../middleware/verifyToken');
const Product = require('../Product');
const Order = require('../Order');
const User = require('../User');
const { verifyToken } = require('../middleware/verifyToken');
const recommendationController = express.Router();

recommendationController.get('/recommendations', verifyToken,  async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch last order for the user or use some logic to find relevant products
        const lastOrder = await Order.findOne({ user: userId }).sort({ createdAt: -1 }).populate('products.product');

        if (!lastOrder) {
            return res.status(404).json({ message: 'No past orders found.' });
        }

        // Recommend products from the same category as the last order
        const recommendedProducts = await Product.find({
            category: lastOrder.products[0].product.category
        }).limit(5);

        res.json(recommendedProducts);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch recommendations' });
    }
});

module.exports = recommendationController;