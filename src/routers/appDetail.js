const express = require("express");
const AppDetail = require("../models/AppDetails");
const User = require("../models/User");


const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
    // Create a new appDetail
    try {
        const id = req.user._id;
        const role = req.user.role;
        let data = req.body;
        if (role === "Admin") {
            const newApp = new AppDetail(data);
            await newApp.save()
            const message = "App created successfully"
            res.status(200).send({
                success: true,
                message,
                data: newApp
            });
        } else {
            const message = "You are not authorized to create app"
            res.status(200).send({
                success: false,
                message,
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const id = req.user._id;
        const role = req.user.role;
        if (role === "Admin") {
            let appDetail = await AppDetail.find();
            let result = [];

            // Clone the appDetail array
            const clonedAppDetail = JSON.parse(JSON.stringify(appDetail));

            for (let i = 0; i < clonedAppDetail.length; i++) {
                const userLoggin = await User.find({ app_id: clonedAppDetail[i]._id });
                const userLogginData = {
                    count: userLoggin.length,
                    users: userLoggin,
                };
                clonedAppDetail[i].userLoggin = userLogginData;
            }

            res.status(200).send({
                success: true,
                message: "Success",
                data: clonedAppDetail
            });
        } else {
            const app_id = req.user.app_id;
            const appDetail = await AppDetail.findById(app_id);
            let result = [];
            result.push(appDetail);
            res.status(200).send({
                success: true,
                message: "Success",
                data: result
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});



router.get("/app_name", async (req, res) => {
    try {
            let appDetail = await AppDetail.find({active : true}).select(" _id appName");
            let result = [];
            res.status(200).send({
                success: true,
                message: "Success",
                data: appDetail
            });

    } catch (error) {
        res.status(500).send(error);
    }
});


router.delete("/:id", auth, async (req, res) => {
    const appId = req.params.id;
    const id = req.user._id;
    const role = req.user.role;
    try {
        if (role === "Admin") {
            const deletedApp = await AppDetail.findByIdAndDelete(appId); // Assuming AppDetail is your model
            const userLogout = await User.updateMany( {app_id : appId}, { app_id: null, token: null })
            if (!deletedApp) {
                res.status(200).send({
                    success: false,
                    message: "AppDetail not found",
                });
            }
            res.status(200).send({
                success: true,
                message: "Success",
                data: deletedApp
            });
        } else {
            const message = "You are not authorized to create app"
            res.status(200).send({
                success: false,
                message,
            });
        }
        ;
    } catch (error) {
        res.status(500).send(error);
    }
});


router.put('/:id', auth, async (req, res) => {
    const {id} = req.params;
    const role = req.user.role;
    const updates = req.body;

    try {
        if (role === "Admin") {
            const appDetail = await AppDetail.findByIdAndUpdate(id, updates, {new: true});
            if (!appDetail) {
                res.status(200).send({
                    success: false,
                    message: "AppDetail not found",
                });
            }
            // Optionally, you can perform additional checks or validations here
            res.status(200).send({
                success: true,
                message: "Success",
                data: appDetail
            });
        } else {
            const message = "You are not authorized to create app"
            res.status(200).send({
                success: false,
                message,
            });
        }
        ;
        // Find the appDetail by ID

    } catch (error) {
        res.status(400).send({error: 'Invalid updates'});
    }
});


module.exports = router;