'use client'
import Slip from '@/components/admin/Slip';
import { useAppContext } from '@/context/AppContext'
import axios from 'axios';
import { CupSoda } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

type OrderItem = {
    _id: string,
    name: string;
    quantity: number;
    option?: string;
    addon: string[];
    selectedTime?: string;
    request?: string;
};

type PaymentInfo = {
    username: string;
    time: string;
    slipUrl: string;
}

type Order = {
    _id: string;
    allOrder: OrderItem[];
    seat?: string;
    round?: string;
    paymentInfo: PaymentInfo;
    date: string;
    amount: number;
    status: string;
    payment: string;
};

const Orders = () => {

    const { adminToken, setShowSlip, showSlip } = useAppContext();
    const [orders, setOrders] = useState<Order[]>([])

    const fetchAllOrders = async () => {

        try {
          
          const response = await axios.get('/api/order/list')
          if (response.data.success) {
            setOrders(response.data.orders.reverse())
          } else {
            toast.error(response.data.message)
          }
    
        } catch (error: any) {
          console.log(error)
          toast.error(error.message)
        }
    
      }

    const statusHandler = async ( event: any, orderId: string ) => {
    try {
        const status = event.target.value
        const response = await axios.post('/api/order/status', {orderId, status})
        if (response.data.success) {
        await fetchAllOrders()
        }
    } catch (error: any) {
        console.log(error)
        toast.error(error.message)
    }
    }

    useEffect(() => {
        if (adminToken !== '') {
            fetchAllOrders();
        }
    }, [adminToken, showSlip])
    

    return (
        <div className='w-full'>
            <h3>Order Page</h3>
            <div>
            {
            orders.map((order, index) => {

                let count = 0;

                return (
                <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_1.5fr_1.1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
                    <CupSoda className='w-12 h-12 border-2 p-2 text-gray-400 border-gray-300'/>
                    <div>   
                        <div>
                        {order.allOrder.map((item, index) => {

                            count += item.quantity

                            if (index === order.allOrder.length - 1) {
                                return (
                                    <div className='text-gray-500' key={index}>
                                        <p className='font-medium text-black py-0.5'> {item.name} x {item.quantity}</p>
                                        <p>{item.option}</p>
                                        {item.addon.map((addon, addonIndex) => (
                                            <p key={addonIndex}>+ {addon}</p>
                                        ))}
                                        <p>{item.selectedTime}</p>
                                        <p className='text-gray-400'>{item.request}</p>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className='text-gray-500' key={index}>
                                        <p className='font-medium text-black py-0.5'> {item.name} x {item.quantity}</p>
                                        <p>{item.option}</p>
                                        {item.addon.map((addon, addonIndex) => (
                                            <p key={addonIndex}>+ {addon}</p>
                                        ))}
                                        <p>{item.selectedTime}</p>
                                        <p className='text-gray-400'>{item.request}</p>
                                        <p>,</p>
                                    </div>
                                );
                            }
                        })}
                        </div>
                    </div>
                    <div>
                        <p className='text-sm sm:text-[15px]'>Items : {count}</p>
                        <p className='mt-3'>ที่นั่ง : {order.seat}</p>
                        <p>รอบ : {order.round}</p>
                        <p>วันที่ : {new Date(order.date).toLocaleDateString()}</p>
                    </div>

                    <p className='text-sm sm:text-[15px]'>฿{order.amount}</p>
                   
                    
                    <div className='flex flex-col-reverse lg:flex-col gap-2'>
                        
                        {order.payment === 'Checked' &&
                            <div className='flex items-center justify-between'>
                                <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold border rounded border-gray-300'>
                                <option value="Order Placed">Order Placed</option>
                                <option value="Delivered">Delivered</option>
                                </select>
                                <p
                                className={`min-w-3 h-3 rounded-full ${
                                    order.status !== "Delivered" ? "bg-green-500" : "bg-gray-400"
                                }`}
                                />
                            </div>
                        }

                        <div className='flex items-center justify-between'>
                            {/* <p
                            className={`min-w-3 h-3 rounded-full ${
                                order.payment === "Checked" ? "bg-green-500" : order.payment === "Deny" ? "bg-red-500" : "bg-gray-400"
                            }`}
                            /> */}
                            <p onClick={() => setShowSlip(order._id)} className='p-2 font-semibold border rounded border-gray-300'>ตรวจสอบสลิป</p>
                        </div>
                        
                        

                        {/* Check Slip Panel */}
                        {showSlip === order._id && ( 
                            <div>
                                <Slip 
                                    orderId={order._id} 
                                    username={order.paymentInfo.username}
                                    time={order.paymentInfo.time}
                                    slipUrl={order.paymentInfo.slipUrl}
                                    paymentStatus={order.payment}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )})
            }
        </div>
        </div>
    )
}

export default Orders
