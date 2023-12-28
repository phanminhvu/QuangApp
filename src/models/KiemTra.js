const mongoose = require('mongoose')

const kiemTraSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    barCode:{
        type:String,
        require:true
   },
    nameProduct:{
        type: String,
        require:true
   },
    weightCode:{
        type:Number,
        require:true
   }
})

const kiemTra = mongoose.model("KiemTra",kiemTraSchema);

module.exports = kiemTra;