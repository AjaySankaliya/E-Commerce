const { addProduct, getAllProduct, deleteProduct, updateProduct } = require('../controllers/productController')
const { isAdmin } = require('../middleware/isAdmin')
const { isAuthenticated } = require('../middleware/isAuthenticated')
const { multipleUpload } = require('../middleware/multer')

const router=require('express').Router()


router.post('/add-product',isAuthenticated,isAdmin,multipleUpload,addProduct)
router.get('/get-products',getAllProduct)
router.delete('/delete-product/:productId',isAuthenticated,isAdmin,deleteProduct)
router.put('/update-product/:productId',isAuthenticated,isAdmin,multipleUpload,updateProduct)

module.exports=router