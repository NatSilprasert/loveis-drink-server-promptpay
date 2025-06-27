"use client"

import { assets } from '@/assets/assets'
import Navbar from '@/components/Navbar'
import { useAppContext } from '@/context/AppContext'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect } from 'react'

type OrderItem = {
  imageUrl: string;
  name: string;
  quantity: number;
  selectedTime: string;
  option?: string;
  addon: string[];
  request?: string;
  totalPrice: number;
};

const Orders = () => {

  const { router, products, orderItems, fetchUserData } = useAppContext() as {
    router: any;
    products: any;
    orderItems: OrderItem[];
    fetchUserData: any;
  };

  useEffect(() => {
    fetchUserData();
}, []);

  return (
    <div>
      <Navbar/>
      <section className='px-4 md:px-8'>
        <div className='h-18 w-full'></div>
        <div onClick={() => router.push('/')} className='flex gap-1 mb-4'>
            <ArrowLeft/>
            <p className='text-gray-500'>ย้อนกลับ</p>
        </div>
        <p className='text-2xl font-semibold'>รายการที่สั่ง</p>
        {orderItems.length !== 0 ? orderItems.map((item, index) => {

          return (
              <div key={index}>
                  <div className='mt-4 flex justify-between'>
                      <div className='flex gap-4'>
                          <Image 
                              src={item.imageUrl ? item.imageUrl : assets.empty}
                              alt="image" 
                              width={0} 
                              height={0} 
                              sizes="100vw" 
                              className='w-16 h-fit'
                          />

                          <div className='flex flex-col'>
                              <p className='font-medium'>{item.name} <span className='text-gray-500'>x {item.quantity}</span></p>
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
                      
                      <p className='font-medium'>฿{item.totalPrice}</p> 
                         
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
          {orderItems.length === 0 &&
            <div onClick={() => router.push('/')} className='w-full flex flex-1 justify-center items-center p-4 bg-primary text-white font-medium rounded-lg'>
                <p>เลือกสินค้าต่อ</p>
            </div>
          }
      </section>

    </div>
  )
}

export default Orders
