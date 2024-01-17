const multer = require("multer");
const path = require("path");

// Destination to store locally
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("photos")) {
      folder = "photos";
    }

    cb(null, `uploads/${folder}/`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Storage in memory
const memoryStorage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg)$/)) {
    return cb(new Error("Apenas png e jpg são formatos suportados."));
  }
  cb(null, true);
};

// Create separate middleware for local storage and memory storage
const localUpload = multer({ storage: diskStorage, fileFilter });
const memoryUpload = multer({ storage: memoryStorage, fileFilter });

module.exports = { localUpload, memoryUpload };
