const userService = require('../services/userService');

const searchUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: 'Email is required' });
        
        const user = await userService.getUserByEmail(email);
        if (!user) return res.status(404).json({ message: 'User not found' });
        

        res.status(200).json(user);
    } catch (error) {
        console.error('Error searching user by email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    searchUserByEmail,
};
