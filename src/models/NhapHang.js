const mongoose = require('mongoose')

const nhapHangSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    barCode:{
        type:String,
        require:true
   },
   pallet:{
    type:String,
    require:true
   },
    nameProduct:{
        type: String,
        require:true
   },
    order:{
        type:String,
        requie:true
   },
    weightCode:{
        type:Number,
        require:true
   }
})

const nhapHang = mongoose.model("NhapHang",nhapHangSchema);

module.exports = nhapHang;