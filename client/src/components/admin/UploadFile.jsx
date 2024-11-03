import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Resize from 'react-image-file-resizer'
import { uploadFiles, removeFiles } from '../../api/Product'
import useEcomStore from '../../store/ecom-store'
import { Loader } from 'lucide-react';

const UploadFile = (props) => {

    const token = useEcomStore((state) => state.token)

    const { form, setForm } = props
    const [isLoading, setIsLoading] = useState(false)

    const handleOnChange = (e) => {
        setIsLoading(true)
        const files = e.target.files //[] empty array
        if (files) {
            setIsLoading(true)
            let allFiles = form.images
            for (let i = 0; i < files.length; i++) {
                // console.log(files[i])

                // Validate
                const file = files[i]
                if (!file.type.startsWith('image/')) {
                    toast.error(`file ${file.name} is not image!`)
                    continue
                }

                // image Rezise
                Resize.imageFileResizer(
                    files[i],
                    720,
                    720,
                    "JPEG",
                    100,
                    0,
                    (data) => {
                        // function endpoint backend
                        uploadFiles(token, data)
                            .then(res => {
                                toast.success('Upload image success!')
                                allFiles.push(res.data)
                                setForm({
                                    ...form,
                                    images: allFiles
                                })
                                setIsLoading(false)
                            })
                            .catch(err => {
                                setIsLoading(false)
                                console.log(err)
                            })
                    },
                    "base64"
                )
            }
        }

    }

    const handleDeleteImage = (public_id) =>{
        const images = form.images
        removeFiles(token, public_id)
            .then(res=>{
                const filterImage = images.filter((item)=>{
                    return item.public_id !== public_id
                })
                setForm({
                    ...form,
                    images: filterImage
                })
                toast.error(res.data)
            })
            .catch(err=>{
                console.log(err)
            })
    }

    return (
        <div className='my-4'>
            <div className='flex mx-4 gap-4 my-4'>
                {/* image */}
                {
                    isLoading && <Loader className='w-16 h-16 animate-spin' />
                }
                {
                    form.images.map((item, index)=>
                        <div 
                            key={index}
                            className='relative '
                        >
                            <img 
                                className='w-24 h-24 hover:scale-105'
                                src={item.url} 
                            />
                            <span 
                                className='absolute top-0 right-0 bg-red-500 p-1 rounded cursor-pointer'
                                onClick={()=>handleDeleteImage(item.public_id)}
                            >
                                X
                            </span>
                        </div>
                    )
                }
            </div>
            <div>
                <input
                    type='file'
                    name='images'
                    multiple
                    onChange={handleOnChange}
                />
            </div>
        </div>
    )
}

export default UploadFile