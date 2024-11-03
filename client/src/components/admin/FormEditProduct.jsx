import React, { useEffect, useState } from 'react'
import {
    createProduct,
    getProduct,
    updateProduct
} from '../../api/Product'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'
import UploadFile from './UploadFile'
import { useParams, useNavigate } from 'react-router-dom'

const initialState = {
    title: "Core I7",
    description: "desc",
    price: "17000",
    quantity: 10,
    categoryId: '',
    images: []
}

const FormEditProduct = () => {

    const token = useEcomStore((state) => state.token)
    const getCategory = useEcomStore((state) => state.getCategory)
    const categories = useEcomStore((state) => state.categories)
    const [form, setForm] = useState(initialState)
    const { id } = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        getCategory()
        fetchProduct(token, id, form)
    }, [])

    const fetchProduct = async (token, id, form) => {
        try {
            const res = await getProduct(token, id, form)
            setForm(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await updateProduct(token,id, form)
            console.log(res)
            toast.success(`แก้ไขข้อมูล ${res.data.title} เรียบร้อยแล้ว!`)
            navigate('/admin/product')
        } catch (err) {
            console.log(err)
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
                <button className='bg-blue-500'>แก้ไขสินค้า</button>
            </form>
        </div>
    )
}

export default FormEditProduct