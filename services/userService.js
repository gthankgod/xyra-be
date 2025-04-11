const User = require('../models/User'); // Assuming you have a User model

async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email: 'gthankgod@gmail.com' });
        return {
            status: !!user,
            message: user ? 'User found' : 'User not found',
            data: user,
        }
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error('Database query failed');
    }
}

module.exports = {
    getUserByEmail,
};
