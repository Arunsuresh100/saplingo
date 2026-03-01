import mongoose from 'mongoose'; // Import mongoose to use ObjectId
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';

// @desc    Get all users with their order stats
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
    try {
        // This is a MongoDB Aggregation Pipeline. It's a powerful way to process data.
        const usersWithStats = await User.aggregate([
            // Stage 1: Find all users who are NOT admins
            {
                $match: { isAdmin: false }
            },
            // Stage 2: Join with the 'orders' collection
            {
                $lookup: {
                    from: 'orders', // The collection to join with
                    localField: '_id', // Field from the 'users' collection
                    foreignField: 'user', // Field from the 'orders' collection
                    as: 'userOrders' // The new array field to add
                }
            },
            // Stage 3: Create the new fields 'totalOrders' and 'totalSpent'
            {
                $addFields: {
                    totalOrders: { $size: '$userOrders' },
                    totalSpent: { $sum: '$userOrders.totalPrice' }
                }
            },
            // Stage 4: Remove the fields we don't need on the front-end
            {
                $project: {
                    password: 0, // Exclude password
                    userOrders: 0, // Exclude the temporary orders array
                    __v: 0 // Exclude the version key
                }
            }
        ]);

        res.json(usersWithStats);

    } catch (error) {
        next(error);
    }
};


// --- The rest of the functions are unchanged ---

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.isAdmin) {
                res.status(400);
                throw new Error('Cannot delete an admin user');
            }
            await Order.deleteMany({ user: user._id });
            await user.deleteOne();
            res.status(200).json({ message: 'User removed successfully' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error); 
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email');
    res.json(orders);
};

// @desc    Update order delivery status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.deliveryStatus = req.body.status || order.deliveryStatus;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch(error) {
        next(error);
    }
};

export { getAllUsers, deleteUserById, getAllOrders, updateOrderStatus };