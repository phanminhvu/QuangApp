const express = require("express");
const PhanQuyen = require("../models/PhanQuyen");

const auth = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

router.get("/phan-quyen", auth, async (req, res) => {
        // Create a new user
        try {
            if (req.user.role === "Admin") {
                const phanquyen = await PhanQuyen.find({}).populate('user_id');
                res.status(200).send({
                    success: true,
                    data: phanquyen
                })
            } else {
                res.status(200).send({
                    success: false,
                    data: "Bạn không có quyền truy cập"
                });
            }
        } catch (error) {
            res.status(400).send(error);
        }
    }
);


router.post("/phan-quyen", auth, async (req, res) => {
    // Create a new user
    try {
        if (req.user.role === "Admin") {
            let data = req.body;
            const user_id = data.user_id;
            const phanquyen = await PhanQuyen.findOneAndUpdate({user_id}, data, {new: true});
            res.status(201).send({phanquyen});
        } else {
            res.status(200).send({
                success: false,
                message,
                data: "Bạn không có quyền truy cập"
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
});


module.exports = router;