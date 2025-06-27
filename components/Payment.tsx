'use client'
import { Drink, useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Payment = ({amount}: {amount : number}) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { router, login, cartItems, products, showPayment, setShowPayment, setCartItems } = useAppContext();
    const [qrImage, setQrImage] = useState<any>(null);
    const [username, setUsername] = useState<string>('')
    const [time, setTime] = useState<string>('')
    const [slip, setSlip] = useState<File | null>(null);

    const generateQR = async () => {
        try {
            const response = await axios.post('/api/order/qr', {amount});
            if (response.data.success) {
                setQrImage(response.data.qr); 
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            toast.error('ไม่สามารถสร้าง QR ได้');
        }
    }

    const orderSubmitHandler = async () => {
        if (!isFormValid) {
            toast.error('กรุณากรอกข้อมูลให้ครบ');
            return;
        }
        setIsSubmitting(true);
        const { seat, round } = login;
        let orderItems = cartItems.map((item) => {
            const product = products.find(product => product._id === item.productId);
            return {
                ...item,
                name: product ? product.name : "",
                price: product ? item.price : 0,
                imageUrl: product ? product.imageUrl : "",
            };
        });

        // สร้าง FormData
        const formData = new FormData();
        formData.append('seat', seat);
        formData.append('round', round);
        formData.append('amount', amount.toString());
        formData.append('orderItems', JSON.stringify(orderItems));
        formData.append('username', username);
        formData.append('time', time);
        if (slip) {
            formData.append('slip', slip);
        }

        try {
            const response = await axios.post('/api/order/add', formData)
            
            if (response.data.success) {
                toast.success(response.data.message);
                setCartItems([]);
                router.push('/orders')
                setShowPayment(false)
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }


    useEffect(() => {
        
        if (showPayment) {
            document.body.style.overflow = 'hidden';
            generateQR();
        } else {
            document.body.style.overflow = '';
            setQrImage(null);
        }
        return () => {
            document.body.style.overflow = '';
        }
        
    }, [showPayment]);

    // เช็คว่ากรอกข้อมูลครบหรือไม่
    const isFormValid = username.trim() !== '' && time.trim() !== '' && slip !== null;

    return (
        <div className={`${showPayment ? 'flex' : 'hidden'} absolute  bg-primary/90 z-60  w-full h-screen items-center justify-center px-12`}>
            <section className='relative flex flex-col p-12 bg-white text-center gap-3'>
                <X onClick={() => setShowPayment(false)} className='absolute right-0 top-0 m-2'/>
                <p className='text-3xl w-70'>สแกนเพื่อชำระเงิน</p>
                {qrImage ? (
                    <Image src={qrImage} alt="QR Code" className="mx-auto" width={200} height={200}/>
                ) : (
                    <p>กำลังสร้าง QR...</p>
                )}
                <div className="flex flex-col items-start gap-2 mt-4">
                    <p className='text-xl'>ชื่อ-นามสกุล</p>
                    <input 
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        className="border border-gray-400 p-2 w-full" 
                        type="text" 
                        placeholder='เช่น นายสมชาย ยิ่งใหญ่'
                    />
                </div>
                <div className="flex flex-col items-start gap-2">
                    <p className='text-xl'>เวลาที่โอนเงิน</p>
                    <input 
                        onChange={(e) => setTime(e.target.value)}
                        value={time}
                        className="border border-gray-400 p-2 w-full" 
                        type="text" 
                        placeholder='เช่น 00:00'
                    />
                </div>
                <div className="flex flex-col items-start gap-2">
                    <p className='text-xl'>สลิปการโอนเงิน</p>
                    <input 
                        className="border border-gray-400 p-2 w-full" 
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setSlip(e.target.files[0]);
                            }
                        }}
                    />
                    {slip && (
                        <img
                            src={URL.createObjectURL(slip)}
                            alt="slip preview"
                            className="mt-2 w-12 h-auto rounded"
                        />
                    )}
                    <button
                        onClick={orderSubmitHandler}
                        className='w-full bg-primary p-2 rounded-xl text-white text-xl mt-2'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'กำลังยืนยัน...' : 'ยืนยัน'}
                    </button>
                </div>
            </section>
        </div>
    )
}

export default Payment
