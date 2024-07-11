import multer from "multer";

// THERE ARE 2 OPTIONS FOR MULTER :

// MEMORY STORAGE : store files in memory
// DISK STORAGE : store files on disk

// IN THIS CASE WE WILL GO FOR THE DISK STORAGE COZ WE NEED THAT FILE TO SEND IT TO CLOUDINARY

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // set the directory where uploaded files will be stored
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    // set the name of the uploaded file
    cb(null, fileName);
  },
});
const upload = multer({ storage });

export default upload;
