const mongoose = require("mongoose");


const appDetailSchema = mongoose.Schema({
        appName: {
            type: String,
            required: true,
            trim: true
        },
        active: {
            type: Boolean,
            required: true,

        },
        description:
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


const AppDetail = mongoose.model("AppDetail", appDetailSchema);




module.exports = AppDetail;