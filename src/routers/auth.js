const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();


router.post('/verifyToken', async(req, res) => {
    //Login a registered user
    try {
        const { id, token } = req.body
        const user = await User.findOne({ _id: id})
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        if (user.tokens != token) {
            res.send({ success: false, message: 'Wrong token' })
        }else {
            res.send({ success: true, message: 'Token is correct', data: { user, token } })
        }
    } catch (error) {
        res.status(400).send(error)
    }});





module.exports = router ;