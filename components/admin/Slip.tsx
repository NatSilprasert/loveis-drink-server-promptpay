'use client'
import { Drink, useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Slip = ({orderId, username, time, slipUrl, paymentStatus}: {orderId: string, username: string, time: string, slipUrl: string, paymentStatus: string}) => { 

    const { showSlip, setShowSlip } = useAppContext();
    const [payment, setPayment] = useState(paymentStatus);

    const paymentHandler = async () => {
        try {
            const response = await axios.post('/api/order/paymentstatus', {payment, orderId})
            if (response.data.success) {
                toast.success(response.data.message)
                setShowSlip('')
            } else {
                toast.error(response.data.message)
            }
        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        
        if (showSlip !== '') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        }
        
    }, [showSlip]);

    return (
        <div className={`${showSlip !== '' ? 'flex' : 'hidden'} absolute z-60 right-0 top-0 w-full h-screen items-center justify-center px-12`}>
            <section className='relative flex flex-col p-12 bg-white text-center gap-3 border border-gray-400'>
                <X onClick={() => setShowSlip('')} className='absolute right-0 top-0 m-2'/>
                <p className='text-3xl w-70'>{!slipUrl && 'ไม่มี'}สลิปการโอนเงิน</p>
                {slipUrl && <Image src={slipUrl} alt="QR Code" className="mx-auto h-auto" width={300} height={0} sizes='100vw'/> }
                <div className="flex flex-col items-start gap-2 mt-4">
                    <p className='text-xl'>ชื่อ-นามสกุล : {username}</p>
                    <p className='text-xl'>เวลาที่โอนเงิน : {time}</p>
                </div>
                <select onChange={(event) => setPayment(event.target.value)} value={payment} className='p-2 text-l font-semibold border rounded border-gray-300'>
                    <option value="Unchecked">Unchecked</option>
                    <option value="Checked">Checked</option>
                    <option value="Deny">Deny</option>
                </select>
                <button onClick={paymentHandler} className='w-full bg-primary p-2 rounded-xl text-white text-xl mt-2'>ยืนยัน</button>
            </section>
        </div>
    )
}

export default Slip
