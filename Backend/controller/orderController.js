const { verifyToken } = require('../middleware/verifyToken');
const Order = require('../Order');
const orderController = require('express').Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config()



orderController.post('/orders', verifyToken, async (req, res) => {
    try {
        const { products, totalPrice } = req.body;
        const userId = req.user.id;
        const userEmail = req.user.email;

        const order = new Order({
            products,
            totalPrice,
            user: userId,
        });

        await order.save();

        // Setup Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASSWORD 
            }
        });

        // Construct the email content
        const emailContent = `
            <h1>Your Order Confirmation</h1>
            <p>Thank you for your purchase! Here are the details of your order:</p>
            <table border="1" style="border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(p => `
                        <tr>
                            <td>${p.title}</td>
                            <td>${p.quantity}</td>
                            <td>${p.price}</td>
                        </tr>`).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2">Total Price</td>
                        <td>${totalPrice}</td>
                    </tr>
                </tfoot>
            </table>
        `;

        // Send the email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Order Confirmation',
            html: emailContent
        });

        res.status(201).json({ message: 'Order is placed and confirmation email sent' });
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({ message: 'Failed to place order and send email' });
    }
});

orderController.get('/orders/:id', verifyToken, async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id;

        console.log("Order ID:", orderId);  
        console.log("User ID:", userId);    

        // Find the order that belongs to the user
        const order = await Order.findById(req.params.id).populate('products._id');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching the order:', error.message);  // Log the error message
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = orderController;
