const prisma = require('../Config/Prisma')
const cloudinary = require('cloudinary').v2;


 // Configuration cloudinary
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createProduct = async (req, res) => {
    try {
        //Code
        const { title, description, price, quantity, categoryId, images } = req.body
        // console.log(title,description,price,quantity, images)
        const product = await prisma.product.create({
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                }
            }
        })
        res.send(product)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!!"
        })
    }
}

exports.ReadById = async (req, res) => {
    try {
        //Code
        const { id } = req.params
        const products = await prisma.product.findFirst({
            where: {
                p_id: Number(id)
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!!"
        })
    }
}

exports.listProduct = async (req, res) => {
    try {
        //Code
        const { count } = req.params
        const products = await prisma.product.findMany({
            take: parseInt(count),
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!!"
        })
    }
}

exports.updateProduct = async (req, res) => {
    try {
        //Code
        const { id } = req.params
        const { title, description, price, quantity, categoryId, images } = req.body
        // console.log(title,description,price,quantity, images)

        //Clear images
        await prisma.image.deleteMany({
            where: {
                productId: Number(id)
            }
        })
        const product = await prisma.product.update({
            where: {
                p_id: Number(id)
            },
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                }
            }
        })
        res.send(product)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!!"
        })
    }
}

exports.removeProduct = async (req, res) => {
    try {
        //Code
        const { id } = req.params
        //Remove Image on Cloudenary
        //Step 1 ค้นหาสินค้า incloud image
        const product = await prisma.product.findFirst({
            where: {p_id: Number(id)},
            include:{images: true}
        })
        if (!product){
          return res.status(400).json({
            message: "Product not found"
          }) 
        }

        //Step 2 Promise ลบแบบ รอ loop 
        const deleteImagePromise = product.images.map((image)=>
            new Promise((resolve, reject)=>{
                //ลบภาพจาก Cloudinary
                cloudinary.uploader.destroy(image.public_id,(err, result)=>{
                    if (err) reject(err)
                        else resolve(result)
                })
            })
        )
        await Promise.all(deleteImagePromise)

        //ลบสินค้า
        await prisma.product.delete({
            where: {
                p_id: Number(id)
            }
        })
        res.send('Delete Success!')
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!!"
        })
    }
}

exports.listByProduct = async (req, res) => {
    try {
        //Code
        const { sort, order, limit } = req.body
        const products = await prisma.product.findMany({
            take: limit,
            orderBy: { [sort]: order },
            include: {
                category: true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!!"
        })
    }
}

const handleQuery = async (req, res, query) => {
    try {
        //Code
        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query
                }
            },
            include:{
                category:true,
                images:true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Search error!!"
        })
    }
}


const handlePrice = async(req, res, priceRange) =>{
    try {
        const products = await prisma.product.findMany({
            where:{
                price:{
                    gte: priceRange[0],
                    lte: priceRange[1]
                }
            },
            include:{
                category:true,
                images:true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Search error!!"
        })
    }
}

const handleCategory = async(req, res, categoryId) =>{
    try {
        const products = await prisma.product.findMany({
            where:{
                categoryId:{
                    in: categoryId.map((id)=>Number(id))
                }
            },
            include:{
                category:true,
                images:true
            }
        })
        res.send(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Search error!!"
        })
    }
}

exports.searchFilterProduct = async (req, res) => {
    try {
        //Code
        const { query, category, price } = req.body

        if (query) {
            console.log('query--->>', query)
            await handleQuery(req,res,query)
        }

        if (category) {
            console.log('categoory--->>', category)
            await handleCategory(req, res, category)
        }

        if (price) {
            console.log('price:--->>', price)
            await handlePrice(req, res, price)
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!!"
        })
    }
}

exports.uploadImages = async(req, res)=>{
    try {
        const result = await cloudinary.uploader.upload(
            req.body.image,{
                public_id: `Stock-${Date.now()}`,
                resource_type: 'auto',
                folder:'Ecom2024'
            }
        )
        res.send(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!!"
        })
    }
}


exports.removeImage = async(req, res)=>{
    try {        
        const {public_id} = req.body
        cloudinary.uploader.destroy(public_id,(result)=>{
            res.send('Remove image success!')
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error!!"
        })
    }
}