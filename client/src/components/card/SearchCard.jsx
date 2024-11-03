import React, { useEffect, useState } from 'react'
import useEcomStore from '../../store/ecom-store'
import Slider from 'rc-slider';

const SearchCard = () => {

    const getProducts = useEcomStore((state) => state.getProducts)
    const products = useEcomStore((state) => state.products)
    const actionSearchFilter = useEcomStore((state) => state.actionSearchFilter)
    const getCategory = useEcomStore((state) => state.getCategory)
    const categories = useEcomStore((state) => state.categories)
    const [text, setText] = useState('')
    const [categorySelected, setCategorySelected] = useState([])
    const [price, setPrice] = useState([100, 30000])
    const [ok, setOk] = useState(false)


    //Step 1 Search Text
    useEffect(() => {
        //Code
        const delay = setTimeout(() => {
            if (text) {
                actionSearchFilter({ query: text })
            }else{
                getProducts()
            }
        }, 300)

        return () => clearTimeout(delay)
    }, [text])

    //Step 2 Search by category
    useEffect(() => {
        getCategory()
    }, [])
    // console.log(categories)

    const handleChange = (e)=>{
        const inCheck = e.target.value //ค่าที่ Check
        const inState = [...categorySelected] //[1, 2, 3]
        const findCheck = inState.indexOf(inCheck) // ถ้าไม่เจอจะ Return -1

        if(findCheck === -1){
            inState.push(inCheck)
        }else{
            inState.splice(findCheck,1)
        }

        setCategorySelected(inState)

        if (inState.length > 0){
            actionSearchFilter({
                category: inState
            })
        }else{
            getProducts()
        }
    }


    //Step 3 Search by price
    useEffect(()=>{
        //Code
        actionSearchFilter({price})
    },[ok])

    const handlePrice = (value)=>{
        setPrice(value)

        setTimeout(()=>{
            setOk(!ok)
        }, 300)
    }

    return (
        <div>
            {/* Search by text */}
            <h1 className='text-xl font-bold mb-4'>ค้นหาสินค้า</h1>
            <input
                className='border rounded-md w-full mb-4 px-2'
                placeholder='ค้นหาสินค้า....'
                type='text'
                onChange={(e) => setText(e.target.value)}
            />
            <hr />
            {/* Search by categories */}
            <div>
                <h1 className='text-xl font-bold mb-4'>หมวดหมู่สินค้า</h1>
                <div>
                    {
                        categories.map((item, index) =>
                            <div key={index} className='flex gap-1'>
                                <input
                                    type='checkbox'
                                    value={item.cat_id}
                                    onChange={handleChange}
                                />
                                <label>{item.name}</label>
                            </div>
                        )
                    }
                </div>
            </div>
            <hr />
            {/* Search by price */}
            <div>
                <h1 className='text-xl font-bold mb-4'>
                    ค้นหาด้วยราคา
                </h1>
                <div>
                    <div className='flex justify-between'>
                        <span>Min : {price[0]}</span>
                        <span>Max : {price[1]}</span>
                    </div>
                    <Slider 
                        onChange={handlePrice}
                        range
                        min={0}
                        max={30000}
                        defaultValue={[100, 30000]}
                    />
                </div>
            </div>
        </div>
    )
}

export default SearchCard