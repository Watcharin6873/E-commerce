import axios from "axios";


export const createCategory = async(token, form) =>{
    return await axios.post('http://localhost:5000/api/asset/category', form,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    )
}


export const listCategory = async() =>{
    return await axios.get('http://localhost:5000/api/asset/category')
}


export const removeCategory = async(token, id) =>{
    return await axios.delete('http://localhost:5000/api/asset/category/'+id,
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    )
}