const { register, verify, login, logout, forgotPassword, verifyOtp, changePassword, getAllUser, updateUserProfile } = require('../controllers/userController')
const { isAdmin } = require('../middleware/isAdmin')
const { isAuthenticated } = require('../middleware/isAuthenticated')
const upload = require('../middleware/multer')
const { registerValidation, loginValidation } = require('../validation/userValidation')

const router=require('express').Router()

router.post('/register',registerValidation,register)
router.post('/verify',verify)
router.post('/login',loginValidation,login)
router.post('/logout',isAuthenticated,logout)
router.post('/forgot-password',forgotPassword)
router.post('/verify-otp/:email',verifyOtp)
router.post('/change-password/:email',changePassword)
router.get('/get-all-users',isAuthenticated,isAdmin,getAllUser)
router.put('/updateProfile/:userId',isAuthenticated,upload,updateUserProfile)

module.exports=router