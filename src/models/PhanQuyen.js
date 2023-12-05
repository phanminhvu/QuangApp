const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const phaQuyenSchema = mongoose.Schema({
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        app1: {
            type: Boolean,
            default: false,

        },
        app2: {
            type: Boolean,
            default: false,
        },
        app3: {
            type: Boolean,
            default: false,
        },

    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }


    }
);
const PhanQuyen = mongoose.model("PhanQuyen", phaQuyenSchema);


module.exports = PhanQuyen;