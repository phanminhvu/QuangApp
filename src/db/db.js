require('dotenv').config()
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const uri = process.env.MONGODB_URL ;
console.log("uri::",uri);
mongoose.connect("mongodb://root:IbBob6V5555bNZkg8Dr@45.251.115.14:27017/ScanApp").then(() => console.log("Connect mongodb success")).catch((err) => console.log("Connect Error",err));
