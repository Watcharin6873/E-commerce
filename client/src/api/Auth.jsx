import axios from "axios";


 export const currentUser = async(token) => await axios.post('http://localhost:5000/api/asset/current-user', 
    {},
    {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
)

export const currentAdmin = async (token) =>{
    return await axios.post('http://localhost:5000/api/asset/current-admin',
        {},
        {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
    )
}