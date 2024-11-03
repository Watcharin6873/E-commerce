const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const {readdirSync} = require('fs')

//Middleware
app.use(morgan('dev'))
app.use(bodyParser.json({limit:'20mb'}))
app.use(cors())



//Routing
readdirSync('./Routes').map((r)=> app.use('/api/asset', require('./Routes/'+r)))

//Port
const port = process.env.PORT
//Start Server
app.listen(port,
    ()=> console.log('Server is running on port 5000')
)