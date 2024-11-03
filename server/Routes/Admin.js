const express =  require('express')
const { authCheck } = require('../Middleware/Auth')
const { changeOrderStatus, getOrderAdmin } = require('../Controllers/Admin')
const router = express.Router()




router.put('/admin/order-status', authCheck, changeOrderStatus)

router.get('/admin/orders', authCheck, getOrderAdmin)




module.exports = router