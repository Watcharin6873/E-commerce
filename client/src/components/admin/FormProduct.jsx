import React, { useEffect, useState } from 'react'
import {
    createProduct,
    deleteProduct,
    listProduct
} from '../../api/Product'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'
import UploadFile from './UploadFile'
import { Link } from 'react-router-dom'
import { FilePenLine, Trash2 } from 'lucide-react'

const initialState = {
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryId: "",
    images: []
}

const FormProduct = () => {

    const token = useEcomStore((state) => state.token)
    const getCategory = useEcomStore((state) => state.getCategory)
    const categories = useEcomStore((state) => state.categories)
    const getProducts = useEcomStore((state) => state.getProducts)
    const products = useEcomStore((state) => state.products)
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: 0,
        quantity: 0,
        categoryId: "",
        images: []
    })
    // console.log(products)

    useEffect(() => {
        getCategory()
        getProducts(20)
    }, [])

    // console.log(products)

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await createProduct(token, form)
            console.log(res)
            toast.success(`เพิ่มข้อมูล ${res.data.title} เรียบร้อยแล้ว!`)
            setForm(initialState)
            getProducts()
        } catch (err) {
            console.log(err)
        }
    }

    const handleDelete = async (id) => {

        if (window.confirm('ต้องการลบหรือไม่? ')) {
            try {
                const res = await deleteProduct(token, id)
                toast.error(res.data)
                getProducts()
            } catch (err) {
                console.log(err)
            }
        }
    }


    return (
        <div className='container mx-auto p-4 bg-white shadow-md'>
            <form onSubmit={handleSubmit}>
                <h1>เพิ่มข้อมูลสินค้า</h1>
                <input
                    className='border'
                    value={form.title}
                    onChange={handleOnChange}
                    placeholder='Title'
                    name='title'
                />
                <input
                    className='border'
                    value={form.description}
                    onChange={handleOnChange}
                    placeholder='Description'
                    name='description'
                />
                <input
                    className='border'
                    value={form.price}
                    onChange={handleOnChange}
                    placeholder='Price'
                    name='price'
                    type='number'
                />
                <input
                    className='border'
                    value={form.quantity}
                    onChange={handleOnChange}
                    placeholder='Quantity'
                    name='quantity'
                    type='number'
                />
                <select
                    className='border'
                    name='categoryId'
                    onChange={handleOnChange}
                    value={form.categoryId}
                    required
                >
                    <option value="" disabled>Please Select</option>
                    {
                        categories.map((item, index) =>
                            <option key={index} value={item.cat_id}>{item.name}</option>
                        )
                    }
                </select>
                <hr />
                {/* Upload image product */}
                <UploadFile form={form} setForm={setForm} />
                <button 
                    className='bg-blue-500 p-2 rounded-md shadow-md 
                    hover:scale-105 hover:translate-y-1 hover:duration-200'
                >
                    เพิ่มสินค้า
                </button>
            </form>

            <table className="mt-1 table w-full border">
                <thead>
                    <tr className='bg-gray-200 boder'>
                        <th scope="col">No.</th>
                        <th scope="col">รูปภาพ</th>
                        <th scope="col">ชื่อสินค้า</th>
                        <th scope="col">รายละเอียด</th>
                        <th scope="col">ราคา</th>
                        <th scope="col">จำนวน</th>
                        <th scope="col">จำนวนที่ขาย</th>
                        <th scope="col">วันที่อัปเดต</th>
                        <th scope="col">จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((item, index) => {
                            // console.log(item)
                            return (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                        {
                                            item.images.length > 0
                                                ?
                                                <img
                                                    className='w-24 h-24 rounded-md shadow-md m-1'
                                                    src={item.images[0].url}
                                                />
                                                :
                                                <div className='flex items-center justify-center w-24 h-24
                                                 bg-gray-200 rounded-md shadow-md m-1'>
                                                    No Image
                                                </div>
                                        }
                                    </td>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.sold}</td>
                                    <td>{item.updatedAt}</td>
                                    <td className='flex gap-2 cursor-pointer'>
                                        <p className='bg-yellow-500 rounded-md 
                                        p-1 shadow-md hover:scale-105 hover:translate-y-1 hover:duration-200'>
                                            <Link to={'/admin/product/' + item.p_id}>
                                                <FilePenLine />
                                            </Link>
                                        </p>
                                        <p
                                            className='bg-red-500 rounded-md p-1 shadow-md 
                                            hover:scale-105 hover:translate-y-1 hover:duration-200'
                                            onClick={() => handleDelete(item.p_id)}
                                        >
                                            <Trash2 />
                                        </p>
                                    </td>
                                </tr>
                            )
                        })
                    }


                </tbody>
            </table>
        </div>
    )
}

export default FormProduct