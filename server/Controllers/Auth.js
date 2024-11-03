const prisma = require('../Config/Prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.register = async (req, res) => {
    try {
        //Step 1 check ว่าระบุข้อมูลครบหรือไม่?
        const { email, password } = req.body
        if (!email) {
            return res.status(400).json({ message: 'Email is not required!!!' })
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is not required!!!' })
        }

        //Step 2 Check email in DB already?
        const user = await prisma.users.findFirst({
            where:{
                email: email
            }
        })
        if (user){
            return res.status(400).json({message: 'Email already exists!!'})
        }
        //Step 3 HashPassword
        const hashPassword = await bcrypt.hash(password, 10)
        
        //Step 4 Register
        await prisma.users.create({
            data:{
                email: email,
                password: hashPassword
            }
        })
        
        res.send('Regisiter sucessfully!')
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}


exports.login = async (req, res) => {
    try {
        //Code
        const {email, password} =req.body

        //Step 1 Check email
        const user = await prisma.users.findFirst({
            where:{email: email}
        })
        if (!user || !user.enabled){
            return res.status(400).json({
                message:"User not found or not enabled"
            })
        }

        //Step 2 Check Password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                message: "Password invalid!!"
            })
        }

        //Step 3 Create Payload
        const payload = {
            id: user.user_id,
            email: user.email,
            role: user.role
        }

        //Step 4 Generate token
        jwt.sign(payload, process.env.SECRET,{expiresIn: '3h'}, (err, token)=>{
            if (err) {
                return res.status(500).json({message: 'Server Error'})
            }
            res.json({payload, token})
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

exports.currentUser = async (req, res) => {
    try {
        //Code
        const user = await prisma.users.findFirst({
            where: {email: req.user.email},
            select:{
                user_id: true,
                email: true,
                name: true,
                role: true
            }
        })
        res.json({user})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}