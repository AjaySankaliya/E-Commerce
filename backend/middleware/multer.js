const multer=require('multer');

const storage=multer.diskStorage({});

const upload=multer({storage}).single("profilePic");

module.exports=upload;