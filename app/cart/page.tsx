"use client"

import { assets } from '@/assets/assets'
import Navbar from '@/components/Navbar'
import Payment from '@/components/Payment'
import { useAppContext } from '@/context/AppContext'
import axios from 'axios'
import { ArrowLeft, ShoppingBasket, ShoppingCart, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import toast from 'react-hot-toast'

const Cart = () => {

    const { router, login, cartItems, products, getCartAmount, removeFromCart, setShowPayment } = useAppContext();

    const paymentHandler = async () => {

        const { seat, round } = login;
        const amount = getCartAmount();
        let orderItems = cartItems;

        orderItems = orderItems.map((item) => {
            const product = products.find(product => product._id === item.productId);
            return {
                ...item,
                name: product ? product.name : "",
                price: product ? item.totalPrice / item.quantity : 0,
                imageUrl: product ? product.imageUrl : "",
            };
        })
        
        try {
            const response = await axios.post('/api/order/payment', { seat, round, amount, orderItems })    
            if (response.data.success) {
                const {session_url} = response.data
                window.location.replace(session_url)
            } else {
                toast.error(response.data.message)
            }          
        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }

    }

    return (
        <div>
            <Navbar/>
            <Payment amount={getCartAmount()}/>
            <section className='px-4 md:px-8'>
                <div className='h-18 w-full'></div>
                <div onClick={() => router.push('/')} className='flex gap-1 mb-4'>
                    <ArrowLeft/>
                    <p className='text-gray-500'>ย้อนกลับ</p>
                </div>
                <p className='text-2xl font-semibold'>สรุปคำสั่งซื้อ</p>

                {cartItems.length !== 0 ? cartItems.map((item, index) => {

                    const productData = products.find((product) => product._id === item.productId)

                    return (
                        <div key={index}>
                            <div className='mt-4 flex justify-between'>
                                <div className='flex gap-4'>
                                    <Image 
                                        src={productData?.imageUrl ? productData.imageUrl : assets.empty}
                                        alt="image" 
                                        width={0} 
                                        height={0} 
                                        sizes="100vw" 
                                        className='w-16 h-fit'
                                    />

                                    <div className='flex flex-col'>
                                        <p className='font-medium'>{productData?.name} <span className='text-gray-500'>x {item.quantity}</span></p>
                                        <div className='text-xs text-gray-500'>
                                            <p>{item.option}</p>
                                            {item.addon.map((addon, index) => (
                                                <p key={index}>+ {addon}</p>
                                            ))}
                                            <p className='text-gray-400'>{item.selectedTime}</p>
                                            <p className='text-gray-300'>{item.request}</p>
                                        </div>
                                    </div>   
                                </div>

                                <div className='flex flex-col justify-between'>
                                    <p className='font-medium'>฿{item.totalPrice}</p> 
                                    <div className='justify-end flex'>
                                        <Trash2 onClick={() => removeFromCart(item)} />     
                                    </div>
                                </div>
                            </div>
                            <hr className='mt-4 text-gray-400/50'/>
                        </div>
                    )
            }): 
            <div className='flex flex-col items-center justify-center h-140 text-gray-400'>
                <Image src={assets.cart_empty} alt='' width={400} height={400}/>
            </div>
            }
                
            </section>

            <section className='fixed border-t border-gray-300 w-full bg-white pb-8 p-4 bottom-0 justify-center items-center'>
                {cartItems.length !== 0 
                ? 
                <div className='flex flex-col gap-3 justify-center items-center'>
                    <div className='w-full font-medium flex justify-between items-center'>
                        <p>รวมทั้งหมด</p>
                        <p className='text-xl'>฿{getCartAmount()}</p>
                    </div>
                    <div onClick={() => setShowPayment(true)} className='w-full flex flex-1 justify-center items-center p-4 bg-primary text-white font-medium rounded-lg'>
                        <p>ยืนยันคำสั่งซื้อ</p>
                    </div>
                </div>
                :
                <div onClick={() => router.push('/')} className='w-full flex flex-1 justify-center items-center p-4 bg-primary text-white font-medium rounded-lg'>
                    <p>เลือกสินค้าต่อ</p>
                </div>
                }
            </section>
        </div>
    )
}

export default Cart
