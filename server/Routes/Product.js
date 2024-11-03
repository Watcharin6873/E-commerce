const express = require('express')
const router = express.Router()
const {
    createProduct,
    listProduct,
    updateProduct,
    removeProduct,
    listByProduct,
    searchFilterProduct,
    ReadById,
    uploadImages,
    removeImage
} = require('../Controllers/Product')
const {authCheck, adminCheck} = require('../Middleware/Auth')

//@Endpoint http://localhost:5000/api/asset/product
router.post('/product', createProduct)

router.get('/products/:count', listProduct)

router.put('/product/:id', updateProduct)

router.get('/product/:id', ReadById)

router.delete('/product/:id', removeProduct)

router.post('/productby', listByProduct)

router.post('/search/filters', searchFilterProduct)

router.post('/uploadImages',authCheck, adminCheck, uploadImages)

router.post('/removeImage',authCheck, adminCheck, removeImage)

module.exports = router