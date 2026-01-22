const multer=require('multer');

const storage=multer.diskStorage({});

const singleUpload=multer({storage}).single("profilePic");

const multipleUpload=multer({storage}).array("productImg",5)

module.exports={singleUpload,multipleUpload};