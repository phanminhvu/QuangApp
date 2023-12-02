const multer = require("multer");
const fs = require("fs/promises");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = `uploads/${req.user.name}/`; // Store files in a directory named after user's name
        fs.mkdir(uploadPath, { recursive: true }) // Create directory if it doesn't exist
            .then(() => {
                cb(null, uploadPath);
            })
            .catch(err => {
                cb(err);
            });
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user.app_id.toString()}.xls`); // Keep the original filename
    }
});


const fileFilter = function (req, file, cb) {
    if (
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only Excel files (XLS, XLSX) are allowed'));
    }
};

 const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = {
    upload: upload
}
