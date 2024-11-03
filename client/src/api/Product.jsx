import axios from "axios";


export const createProduct = async(token, form) =>{
    return await axios.post('http://localhost:5000/api/asset/product', form,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    )
}


export const listProduct = async(count = 20) =>{
    return await axios.get('http://localhost:5000/api/asset/products/'+count)
}


export const uploadFiles = async(token, form) =>{
    return await axios.post('http://localhost:5000/api/asset/uploadImages', {
        image: form
    },
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    )
}


export const removeFiles = async(token, public_id) =>{
    return await axios.post('http://localhost:5000/api/asset/removeImage', {
        public_id
    },
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    )
}


export const getProduct = async(token, p_id) =>{
    return await axios.get('http://localhost:5000/api/asset/product/'+ p_id,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    )
}


export const updateProduct = async(token, p_id, form) =>{
    return await axios.put('http://localhost:5000/api/asset/product/'+ p_id,form,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    )
}


export const deleteProduct = async(token, p_id) =>{
    return await axios.delete('http://localhost:5000/api/asset/product/'+ p_id,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    )
}


export const searchFilters = async(arg) =>{
    return await axios.post('http://localhost:5000/api/asset/search/filters', arg)
}