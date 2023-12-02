const AppConfig = require("../models/AppConfig");
const express = require('express');
const xlsx = require('xlsx');
const path = require('path');
const auth = require("../middleware/auth");
const {upload} = require("../utils/fileConfig");
const User = require("../models/User");
const router = express.Router();


router.post('/upload',auth,  upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        console.log( req.file.path)
        const user = req.user;

        // Read the uploaded Excel file
        const workbook = xlsx.readFile(req.file.path || req.file.destination + req.file.filename);
        const sheetName = workbook.SheetNames[0]; // Get the first sheet name
        const worksheet = workbook.Sheets[sheetName]; // Get the first worksheet
        const data = xlsx.utils.sheet_to_json(worksheet); // Convert worksheet to JSON data

        const checkApppConfig = await AppConfig.find({user_id: req.user._id, app_id: req.user.app_id})

        for (let i = 0; i < data.length; i++) {
            data[i].user_id = user._id;
            data[i].app_id = user.app_id;
        }

        if(checkApppConfig.length > 0){
            const deleteConfig = await AppConfig.deleteMany({user_id: req.user._id, app_id: req.user.app_id})
            const updateConfig = await AppConfig.insertMany(data)
        }else {
            const insertConfig = await AppConfig.insertMany(data)
        }

        // Return the data as response
        res.status(200).send({
            success: true,
            message: "Update file success!",
            data: data
        });
    } catch (error) {
        res.status(500).send(error.message || 'Internal Server Error');
    }
})


router.post("/", auth, async (req, res) => {
    // Create a new appConfig
    try {
        const id = req.user._id;
        const app_id = req.user.app_id;
        const role = req.user.role;
        let data = req.body;
        if (role === "Admin") {
            const newAppConfig = new AppConfig(data);
            await newAppConfig.save()
            const message = "AppConfig created successfully"
            res.status(200).send({
                success: true,
                message,
                data: newAppConfig
            });
        } else {
            let updateData = JSON.parse(JSON.stringify(data));
            updateData.user_id = id;
            updateData.app_id = app_id;
            const newAppConfig = new AppConfig(updateData);
            await newAppConfig.save()
            const message = "AppConfig created successfully"
            res.status(200).send({
                success: true,
                message,
                data: newAppConfig
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
            let appConfig = await AppConfig.find().populate("user_id").populate("app_id");
            // Clone the appConfig array
            res.status(200).send({
                success: true,
                message: "Success",
                data: appConfig
            });
        } else {
            const app_id = req.user.app_id;
             let appConfig = await AppConfig.find({user_id: id, app_id: app_id}).populate("user_id").populate("app_id");
            if(!appConfig){
                res.status(200).send({
                    success: false,
                    message: "AppConfig not found",
                });
            }
             res.status(200).send({
                success: true,
                message: "Success",
                data: appConfig
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});


router.delete("/:id", auth, async (req, res) => {
    const configId = req.params.id;
    const id = req.user._id;
    const role = req.user.role;
    try {
        if (role === "Admin") {
            const deletedConfig = await AppConfig.findByIdAndDelete(configId); // Assuming AppConfig is your model
            if (!deletedConfig) {
                res.status(200).send({
                    success: false,
                    message: "AppConfig not found",
                });
            }
            res.status(200).send({
                success: true,
                message: "Delete Success!",
                data: deletedConfig
            });
        } else {
            const appConfig = await AppConfig.findById(id);
            if(appConfig.user_id === user_id && appConfig.app_id === app_id){
                const deletedConfig = await AppConfig.findByIdAndDelete(configId); // Assuming AppConfig is your model
                res.status(200).send({
                    success: true,
                    message: "Delete Success!",
                    data: appConfig
                });
            }else {
                const message = "You are not authorized to delete app"
                res.status(200).send({
                    success: false,
                    message,
                });
            }
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
    const user_id = req.user._id;
    const app_id = req.user.app_id;

    try {
        if (role === "Admin") {
            const appConfig = await AppConfig.findByIdAndUpdate(id, updates, {new: true});
            if (!appConfig) {
                res.status(200).send({
                    success: false,
                    message: "AppConfig not found",
                });
            }
            // Optionally, you can perform additional checks or validations here
            res.status(200).send({
                success: true,
                message: "Success",
                data: appConfig
            });
        } else {
            const appConfig = await AppConfig.findById(id);
            if(appConfig.user_id === user_id && appConfig.app_id === app_id){
                const appConfig = await AppConfig.findByIdAndUpdate(id, updates, {new: true});
                res.status(200).send({
                    success: true,
                    message: "Success",
                    data: appConfig
                });
            }else {
                const message = "You are not authorized to create app"
                res.status(200).send({
                    success: false,
                    message,
                });
            }

        }
        ;
        // Find the appConfig by ID

    } catch (error) {
        res.status(400).send({error: 'Invalid updates'});
    }
});




;


module.exports = router;