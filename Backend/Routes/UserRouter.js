const express = require('express')
const router = express.Router();
const UserModel  = require('../Models/User');

router.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 }); // Exclude password
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users." });
    }
});

router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'user'].includes(role)) {
        return res.status(400).json({ message: "Invalid role provided." })
    }

    try {
        const user = await UserModel.findByIdAndUpdate(id, { role }, { new: true })
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'Role updated successfully.', user });
    } catch (err) {
        res.status(500).json({ message: 'Error updating role.' });
    }
});

module.exports = router;