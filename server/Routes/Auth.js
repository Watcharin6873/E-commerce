const express =  require('express')
const router = express.Router()
const {
    register,
    login,
    currentUser,
} = require('../Controllers/Auth')

const {authCheck,adminCheck} = require('../Middleware/Auth')


router.post('/register', register)

router.post('/login', login)

router.post('/current-user',authCheck, currentUser)

router.post('/current-admin',authCheck, adminCheck, currentUser)




module.exports = router