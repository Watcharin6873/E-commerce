const express =  require('express')
const router = express.Router()
const { createCategory, ListCategory, removeCategory } = require('../Controllers/Category')
const { authCheck, adminCheck } = require('../Middleware/Auth')


router.post('/category',authCheck, adminCheck, createCategory)

router.get('/category', ListCategory)

router.delete('/category/:id',authCheck, adminCheck, removeCategory)




module.exports = router