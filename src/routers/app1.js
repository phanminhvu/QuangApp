const PhanQuyen = require("../models/PhanQuyen");
const App1Config = require("../models/App1Config");
const NhapHang = require('../models/NhapHang');
const XuatHang = require('../models/XuatHang');
const KiemTra =   require('../models/KiemTra');
var express = require('express');
var nodemailer = require('nodemailer');
var csv = require('to-csv')

const auth = require("../middleware/auth");
const app1Auth = require("../middleware/app1Auth");
const User = require("../models/User");
const router = express.Router();
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'scantomailsystem@gmail.com',
        pass: 'feuh ttja vpnw avcn'
    }
});

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    console.log(typeof array)
    console.log('array[0]',array[0])
    var str =Object.keys( array[0]).toString() + '\r\n';
    console.log('str',str)
    // var str = 'MA_THUNG, MA_KIEN\r\n';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}

const stringObj = (data) => {

    const keyData = Object.keys(data[0]);
    data.forEach(element => {
        keyData.forEach(e => {
            element[e] = `'` + element[e] + `'`;
        })
    });
    return data;
}

router.post('/send-email', [auth, app1Auth],async function  (req, res, next) {
    const email = req.user.email;
    const title = req.body.title;
    const data = req.body.data;
    const userId = req.user._id;

    const saveData = async (userId,data,title)=>{
        const options = { ordered: true };
        data.forEach( e => e.userId =userId)
        try {
            if(title === 'Nhập hàng'){
            await NhapHang.insertMany(data,options);
            }
            else if(title === 'Xuất hàng'){
                await XuatHang.insertMany(data,options);
            }
            else if(title ==="Kiểm tra") {
                await KiemTra.insertMany(data,options);
            }
            res.status(200).send({message:"Lưu thành công !"})

        } catch (error) {
            res.status(500).send(error);
        }
    }

     saveData(userId,data,title);
    
    
    var mailOptions = {
        from: 'scantomailsystem@gmail.com',
        to: email, //thuongmaidientuaal@gmail.com
        subject: title + ' ' + Date.now(),
        text: title,
        attachments: [{
            filename: 'DATA SCAN '+ title +'' + Date.now() + '.csv',
            content:  ConvertToCSV(JSON.stringify(data))
        }],
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send({error: error});
        } else {
            res.send({'info': 'Đã gửi dữ liệu vào mail'});
        }
    });
});

router.get('/download', [auth, app1Auth], function (req, res, next) {
    try {
        var options = {
            root: __dirname,
        };
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="config.xls"');

        let fileName = "config.xls";
        res.sendFile(fileName, options, function (err) {
            if (err) {
                console.log(err);
                res.status(500).send('Error downloading file');
            }
        });
    } catch (e) {
        console.log(e);

        res.status(500).send('Error downloading file');
    }
});

router.get("/get-config", [auth, app1Auth], async (req, res) => {
        // Create a new user
        try {

            const getConfig = await App1Config.find({user_id: req.user._id});
            if (getConfig.length > 0) {
                res.status(200).send({
                    success: true,
                    message: "Success",
                    data: getConfig[0].data
                });
            } else {
                res.status(200).send({
                    success: false,
                    message: "Data not found",
                });
            }
        } catch (error) {
            res.status(400).send(error);
        }
    }
);

router.post("/post-config", [auth, app1Auth], async (req, res) => {
        // Create a new user
        try {
            const id = req.user._id;
            const data = req.body;

            const appConfig = await App1Config.find({user_id: id});
            if (appConfig.length > 0) {
                const appConfigId = appConfig[0]._id;
                const appConfigUpdate = await App1Config.findByIdAndUpdate(appConfigId, {data: data}, {new: true});
                res.status(201).send({appConfigUpdate});

            } else {
                const newAppConfig = new App1Config({
                    user_id: id,
                    data: data
                })
                await newAppConfig.save();
                res.status(201).send({newAppConfig});
            }

        } catch (error) {
            res.status(400).send(error);
        }
    }
);


module.exports = router;