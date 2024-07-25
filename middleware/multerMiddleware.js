import multer from "multer";
import DataParser from "datauri/parser.js";
import path from "path";

// THERE ARE 2 OPTIONS FOR MULTER :

// MEMORY STORAGE : store files in memory
// DISK STORAGE : store files on disk

// TODO disk storage
// IN THIS CASE WE WILL GO FOR THE DISK STORAGE COZ WE NEED THAT FILE TO SEND IT TO CLOUDINARY

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // set the directory where uploaded files will be stored
//     cb(null, "public/uploads");
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname;
//     // set the name of the uploaded file
//     cb(null, fileName);
//   },
// });
// const upload = multer({ storage });

// export default upload;

// RENDER doesn't SUPPORT IMAGE UPLOAD IN FREE OPTION
// SO WE NEED A NEW WAY TO HANDLE THAT
// MEMORY STORAGE IS SOLUTION INSTEAD OF DISK STORAGE
// ADDITIONAL PACKAGE MUST BE DOWNLOADED FROM NPM
// DATAURI

// TODO memory storage

const storage = multer.memoryStorage();
const upload = multer({ storage });

const parser = new DataParser();

export const formatImage = (file) => {
  //   console.log(file);
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content;
};

export default upload;
