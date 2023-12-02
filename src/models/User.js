const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: value => {
                if (!validator.isEmail(value)) {
                    throw new Error({error: "Invalid Email address"});
                }
            }
        },
        app_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AppDetail',
            nullable: true
        },
        register_apps_id: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AppDetail',
            nullable: true
        }],
        password: {
            type: String,
            required: true,
            minLength: 4
        },
        role: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        active: {
            type: Boolean,
            required: true,

        },
        app_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AppDetail'
        },
        tokens:
            {
                type: String,
                // required: true
            }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }


    }
);

userSchema.pre("save", async function (next) {
    // Hash the password before saving the user model
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this;
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY);
    user.tokens = token;
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {

    // Search for a user by email and password.
    const user = await User.findOne({email});
    if (!user) {
        throw new Error({error: "Invalid login credentials"});
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error({error: "Invalid login credentials"});
    }
    return user;
};

const User = mongoose.model("User", userSchema);


module.exports = User;