const Test = require("../models/Test");
const express = require('express');
const xlsx = require('xlsx');
const path = require('path');
const auth = require("../middleware/auth");
const {upload} = require("../utils/fileConfig");
const User = require("../models/User");
const router = express.Router();


router.post('/upload',  upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        const user = req.user;

        // Read the uploaded Excel file
        const workbook = xlsx.readFile(req.file.path || req.file.destination + req.file.filename);
        const sheetName = workbook.SheetNames[0]; // Get the first sheet name
        const worksheet = workbook.Sheets[sheetName]; // Get the first worksheet
        const data = xlsx.utils.sheet_to_json(worksheet); // Convert worksheet to JSON data

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

module.exports = router;