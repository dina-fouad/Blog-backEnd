const multer = require("multer");
const path = require("path");
//  console.log(path.join(__dirname,'../images'))

const pathFile = path.join(__dirname, "../images");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pathFile);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

const uploadImgs = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ msg: "unsupported file format" }, false);
    }
  },
});

module.exports = uploadImgs