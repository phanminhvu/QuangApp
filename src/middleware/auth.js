const jwt = require("jsonwebtoken");
const User = require("../models/User")
const PhanQuyen = require("../models/PhanQuyen");


const auth = async (req, res, next) => {

    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const data = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ _id: data._id, tokens: token });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: "Not authorized to access this resource" });
    }
};

 const app1Auth = async (req, res, next) => {
     try {

         const token = req.header("Authorization").replace("Bearer ", "");
         const data = jwt.verify(token, process.env.JWT_KEY);
         const user = await User.findOne({ _id: data._id, tokens: token });

         if (!user) {
             throw new Error();
         }
         req.user = user;
         req.token = token;
         const phanQuyen = await PhanQuyen.findOne({user_id: req.user._id });
         if(phanQuyen.app1) {
             next();
         }
            else {
             res.status(401).send({ error: "Not authorized to access this resource" });
         }
     }catch (error) {
         res.status(401).send({ error: "Not authorized to access this resource" });
     }

 }



module.exports = auth ;
module.exports = app1Auth ;
