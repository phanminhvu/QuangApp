const mongoose = require("mongoose");


const app1configSchema = mongoose.Schema({
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        data: [{
            type: Object,
            required: false
        }],

    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }

    }
);


const App1Config = mongoose.model("App1Config", app1configSchema);


module.exports = App1Config;