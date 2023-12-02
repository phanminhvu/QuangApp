const express = require("express");
const User = require("../models/User");
const AppDetail = require("../models/AppDetails");

const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", async (req, res) => {
    // Create a new user
    try {
        let data = req.body;
        data.active = true;
        const user = new User(data);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/", auth,  async (req, res) => {
    try {

        const id = req.user._id;
        const role = req.user.role;
        let users =[]
        if(role === "Admin"){  users = await User.find().populate('app_id').populate('register_apps_id') }
        else{  users = await User.find({ _id: id }).populate('app_id').populate('register_apps_id') }
       ; // Assuming User is your model
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// router.get("/:id", auth, async (req, res) => {
//     const userId = req.params.id; // Extracting the user ID from the request parameters
//     try {
//         const user = await User.findById(userId); // Assuming User is your model
//         if (!user) {
//             return res.status(404).send("User not found");
//         }
//         res.status(200).send(user);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });


router.delete("/:id", async (req, res) => {
    const userId = req.params.id; // Extracting the user ID from the request parameters
    try {
        const deletedUser = await User.findByIdAndDelete(userId); // Assuming User is your model
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        res.status(200).send(deletedUser);
    } catch (error) {
        res.status(500).send(error);
    }
});




router.put('/:id',auth, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        // Find the user by ID
        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        // Optionally, you can perform additional checks or validations here
        res.status(200).send({ user });
    } catch (error) {
        res.status(400).send({ error: 'Invalid updates' });
    }
});


router.get("/me", auth, async (req, res) => {
    // View logged in user profile

    res.send(req.user);
});


router.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password, app_id } = req.body
        console.log(email, password)
        const user = await User.findByCredentials(email, password)
        if (!user) {
             res.status(200).send({
                success: false,
                message: 'Login failed! Check authentication credentials'})
        }else {
            if(user.role === "Admin"){
                const token = await user.generateAuthToken()
                res.status(200).send({
                    success: true,
                    message: 'Login successful!',
                    data: { user, token }})
            }else {
                if (!app_id) {
                     res.status(200).send({
                        success: false,
                        message: 'Login failed! Please provide app_id'})
                }else {
                    if(user.register_apps_id.includes(app_id)){
                        const userUpdate = await User.findByIdAndUpdate(user._id, {app_id}, { new: true }).populate('app_id');
                        const token = await user.generateAuthToken()
                        res.status(200).send({
                            success: true,
                            message: 'Login successful!',
                            data: { user: userUpdate, token }}

                        )
                    }else{
                        res.status(200).send({
                            success: false,
                            message: 'Login failed! You are not registered for this app'})
                    }

                }
            }
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }});

router.post("/me/logout", auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token != req.token;
        });
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post('/me/logoutall', auth, async(req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error);
    }
});



module.exports = router ;