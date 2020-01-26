const path = require("path");
const multer = require("multer");
const mime = require("mime-types");
const { ErrorHandlers } = require("../utilities");

// setting up storage engine for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname +
                "-" +
                Date.now() +
                "." +
                mime.extension(file.mimetype)
        );
    }
});

// upload middleware
const upload = multer({
    storage: storage,

    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
            throw new ErrorHandlers.ErrorHandler(
                500,
                "Picture upload: .png .jpg .jpeg are the only valid extensions"
            );
        }
        callback(null, true);
    }
});

module.exports = { upload };
