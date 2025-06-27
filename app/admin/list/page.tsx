'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast';
import { SquarePen } from 'lucide-react';
import Update from '@/components/admin/Update';
import { useAppContext } from '@/context/AppContext';
import { assets } from '@/assets/assets';

const List = () => {

    const { openEdit, setOpenEdit } = useAppContext();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {

            const response = await axios.get('/api/product/list');
            
            if (response.data.success) {       
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message)
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.message);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [openEdit]);

    return (
        <div className='relative'>
            <p className='pb-2'>All Products List</p>
            <div className='flex flex-col gap-2'>
                
                {/* --- List Table Title --- */}

                <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-400 bg-gray-100 text-sm'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b className='text-center'>Bestseller</b>
                </div>

                {/* --- Product List --- */}

                {
                    products.map((item, index) => (
                      <div key={index}>
                        <div className='grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border border-gray-300 text-sm'>
                            <img className='w-12' src={item.imageUrl ? item.imageUrl : assets.upload_area} alt="" />
                            <p>{item.name}</p>
                            <p className='ml-2'>{item.category}</p>
                            <p>฿{item.price}</p>
                            <div className='right-0 flex justify-center gap-2'>
                              <SquarePen onClick={() => setOpenEdit(item._id)} className='md:text-center cursor-pointer'/>                         
                            </div>
                        </div>
                      
                        {/* Edit Panel */}
                        {openEdit === item._id && ( 
                            <div className="w-full fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                <Update />
                            </div>
                        )}
                      </div>
                        
                    ))
                }

            </div>

        </div>
    )
}

export default List

