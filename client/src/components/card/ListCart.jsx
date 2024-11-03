import React from 'react'
import { ListCheck } from 'lucide-react'
import useEcomStore from '../../store/ecom-store'
import { Link } from 'react-router-dom'

const ListCart = () => {

    const carts = useEcomStore((state) => state.carts)
    const getTotalPrice = useEcomStore((state) => state.getTotalPrice)

    const totalPrice = getTotalPrice().toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});


    return (
        <div className='bg-gray-100 rounded-md p-4'>
            {/* Headeer */}
            <div className='flex gap-4 mb-4'>
                <ListCheck size={36} />
                <p className='text-2xl font-bold'>
                    รายการสินค้า {carts.length} รายการ
                </p>
            </div>
            {/* List */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {/* Left */}
                <div className='col-span-2'>

                    {
                        carts.map((item, index) =>

                            <div key={index}
                                className='bg-white p-2 rounded-md shadow-md mb-2'
                            >
                                {/* Row 1 */}
                                <div className='flex justify-between mb-2'>
                                    {/* Left */}
                                    <div className='flex gap-2 items-center'>

                                        {
                                            item.images && item.images.length > 0
                                                ? <img className='w-16 h-16 rounded-md shadow-md' src={item.images[0].url} />
                                                : <div className='w-16 h-16 bg-gray-200 rounded-md flex text-center items-center' >
                                                    No Image
                                                </div>
                                        }
                                        <div>
                                            <p className='font-bold'>{item.title}</p>
                                            <p className='text-sm'>{item.price}x {item.count}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='font-bold text-blue-500'>
                                            {item.price}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )
                    }
                </div>
                {/* Right */}
                <div className='bg-white p-4 rounded-md shadow-md space-y-4'>
                    <p className='text-2xl font-bold'>ยอดรวม</p>
                    <div className='flex justify-between'>
                        <span className='text-2xl'>รวมสุทธิ</span>
                        <span className='text-2xl'>{totalPrice} บาท</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Link>
                            <button className='bg-red-500 w-full rounded-md 
                    text-white py-2 shadow-md hover:bg-red-600'>
                                สั่งซื้อ
                            </button>
                        </Link>

                        <Link to={'/shop'}>
                            <button className='bg-gray-500 w-full rounded-md 
                    text-white py-2 shadow-md hover:bg-gray-600'>
                                แก้ไขรายการ
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListCart