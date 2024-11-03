const prisma = require("../Config/Prisma")


exports.getAllUsers = async (req, res) => {
    try {
        //Code
        const user = await prisma.users.findMany({
            select: {
                user_id: true,
                email: true,
                role: true,
                enabled: true,
                address: true
            }
        })
        res.send(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error"
        })
    }
}

exports.changeStatus = async (req, res) => {
    try {
        //Code
        const { user_id, enabled } = req.body
        console.log(user_id, enabled)

        const user = await prisma.users.update({
            where: { user_id: Number(user_id), },
            data: { enabled: enabled }
        })


        res.send('Update status success!')
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error"
        })
    }
}

exports.changeRole = async (req, res) => {
    try {
        //Code
        const { user_id, role } = req.body
        console.log(user_id, role)

        const user = await prisma.users.update({
            where: { user_id: Number(user_id), },
            data: { role: role }
        })
        res.send('Update role success!')
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error"
        })
    }
}


exports.userCart = async (req, res) => {
    try {
        //Code
        const { cart } = req.body
        const user = await prisma.users.findFirst({
            where: {
                user_id: req.user.id
            }
        })

        //Deleted old cart items
        await prisma.productOnCart.deleteMany({
            where: {
                cart: {
                    orderedById: user.user_id
                }
            }
        })

        //Delete old cart
        await prisma.cart.deleteMany({
            where: {
                orderedById: user.user_id
            }
        })

        //เตรียมสินค้า
        let products = cart.map((item) => ({
            productId: item.id,
            count: item.count,
            price: item.price
        }))

        //หาผลรวม
        let cartTotal = products.reduce((sum, item) =>
            sum + item.price * item.count, 0)

        //New Cart
        const newCart = await prisma.cart.create({
            data: {
                products: {
                    create: products
                },
                cartTotal: cartTotal,
                orderedById: user.user_id
            }
        })

        console.log(newCart)


        res.send('Add Cart success!')
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error"
        })
    }
}

exports.getUserCart = async (req, res) => {
    try {
        //Code
        const cart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        })
        // console.log(cart)
        res.json({
            products: cart.products,
            cartTotal: cart.cartTotal
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error"
        })
    }
}


exports.emptyCart = async (req, res) => {
    try {
        //Code
        const cart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            }
        })
        if (!cart) {
            return res.status(400).json({
                message: "No Cart!"
            })
        }

        await prisma.productOnCart.deleteMany({
            where: {
                cartId: cart.car_id
            }
        })

        const result = await prisma.cart.deleteMany({
            where: {
                orderedById: Number(req.user.id)
            }
        })

        console.log(result)
        res.json({
            message: "Cart empty success!",
            deletedCount: result.count
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error"
        })
    }
}


exports.saveAddress = async (req, res) => {
    try {
        //Code
        const { address } = req.body
        console.log(address)

        const addressUser = await prisma.users.update({
            where:{
                user_id: Number(req.user.id)
            },
            data:{
                address: address
            }
        })


        res.json({
            ok: true,
            message: 'Address update success'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error"
        })
    }
}


exports.saveOrder = async (req, res) => {
    try {
        //Code
        //Step 1 get User cart
        const userCart = await prisma.cart.findFirst({
            where:{
                orderedById: Number(req.user.id)
            },
            include:{products: true}
        })

        //Check cart empty
        if(!userCart || userCart.products.length === 0){
            return res.status(400).json({ok: false, message: 'Cart is empty!'})
        }


        //Check quantity
        for (const item of userCart.products) {
            const product = await prisma.product.findUnique({
                where:{p_id: item.productId},
                select:{quantity: true, title: true}
            })
            if(!product || item.count > product.quantity){
                return res.status(400).json({ok: false, message: `ขออภัย, สินค้า ${product?.title || 'product'} หมด`})
            }
        }

        //Create a new Order
        const order = await prisma.order.create({
            data:{
                products:{
                    create: userCart.products.map((item)=> ({
                        productId: item.productId,
                        count: item.count,
                        price: item.price
                    }))
                },
                orderedBy:{
                    connect: {user_id: req.user.id}
                },
                cartTotal: userCart.cartTotal
            }
        })

        //Update product 
        const update = userCart.products.map((item)=>({
            where: {p_id: item.productId},
            data:{
                quantity: {decrement: item.count},
                sold: {increment: item.count}
            }
        }))

        await Promise.all(
            update.map((updated)=> prisma.product.update(updated))
        )

        await prisma.cart.deleteMany({
            where:{orderedById: Number(req.user.id)}
        })
        // console.log(blukUpdate)


        res.json({ok: true, order})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error"
        })
    }
}


exports.getOrder = async (req, res) => {
    try {
        //Code
        const orders = await prisma.order.findMany({
            where:{orderedById: Number(req.user.id)},
            include:{
                products:{
                    include:{
                        product: true
                    }
                }
            }
        })

        if(orders.length === 0){
            return res.status(400).json({ok: false, message: 'No order!'})
        }
        
        res.json({ok: true, orders})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Server error"
        })
    }
}