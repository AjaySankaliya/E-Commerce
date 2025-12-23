const { register, verify } = require('../controllers/userController')
const { registerValidation } = require('../validation/userValidation')

const router=require('express').Router()

router.post('/register',registerValidation,register)

router.post('/verify',verify)

module.exports=router