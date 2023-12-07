// /**
//  * Created by trungquandev.com's author on 18/02/2020.
//  * routes/web.js
//  */
// const express = require('express')
// const router = express.Router()
// const homeController = require('../controllers/homeController')
// const emailController = require('../controllers/emailController')
//
// router.get('/', homeController.getHome)
//
// // Gọi hành động gửi email
// router.post('/send-email', emailController.sendMail)
//
// module.exports = router ;
//
//
//


var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var csv = require('to-csv')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'scantomailsystem@gmail.com',
        pass: 'feuh ttja vpnw avcn'
    }
});
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = 'MA_THUNG, MA_KIEN\r\n';
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
const stringObj =(data)=>{

    const keyData = Object.keys(data[0]);
    data.forEach(element => {
        keyData.forEach(e=>{
            element[e] = `'`+element[e].toString();
        })
    });
    return data;
}

router.post('/send-email', function(req, res, next) {
    console.log(req.body)

    const data = req.body;
    var mailOptions = {
        from: 'scantomailsystem@gmail.com',
        to: 'thuongmaidientuaal@gmail.com', //thuongmaidientuaal@gmail.com
        subject: 'Dữ liệu scan '+ Date.now(),
        text: 'Dữ liệu scan',
        attachments: [{
            filename: 'DATA SCAN'+Date.now()+'.csv',
            content: ConvertToCSV(data)
        }],
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.send( { error: error });
        } else {
            console.log('Email sent: ' + info.response);
            res.send( { 'info': 'Đã gửi dữ liệu vào mail' });
        }
    });
});


module.exports = router;
