const prisma = require('../Config/Prisma')


exports.createCategory = async(req, res)=>{
    try {
        const {name} = req.body
        const category = await prisma.category.create({
            data:{name: name}
        })

        res.send(category)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error!'
        })
    }
}


exports.ListCategory = async(req, res)=>{
    try {
        const category = await prisma.category.findMany()
        res.send(category)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error!'
        })
    }
}

exports.removeCategory = async(req, res)=>{
    try {
        const {id} = req.params
        const category = await prisma.category.delete({
            where:{
                cat_id: Number(id)
            }
        })
        res.send(category)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Server Error!'
        })
    }
}