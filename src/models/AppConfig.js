const mongoose = require("mongoose");


const appConfigSchema = mongoose.Schema({
        app_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AppDetail',
            required: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        stt:
            {

                type: String,
                // required: true
            },
        ten_hang:
            {

                type: String,
                // required: true
            },
        vi_tri:
            {

                type: String,
                // required: true
            },
        ma_AI:
            {

                type: String,
                // required: true
            },
        Barcode:
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


const AppConfig = mongoose.model("AppConfig", appConfigSchema);




module.exports = AppConfig;