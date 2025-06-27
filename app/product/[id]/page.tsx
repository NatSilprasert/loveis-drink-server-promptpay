"use client"
import Navbar from '@/components/Navbar';
import { useAppContext } from '@/context/AppContext';
import { ArrowLeft, Check, SquareMinus, SquarePlus } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Drink } from '@/context/AppContext';
import { assets } from '@/assets/assets';

const ProductItem = () => {

    const { id } = useParams();
    const { router, addToCart, products } = useAppContext();

    const [productData, setProductData] = useState<any>(null);
    const [option, setOption] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('ก่อนเริ่มการแสดง');
    const [addon, setAddon] = useState<string[]>([]);
    const [request, setRequest] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [bean, setBean] = useState('dark roast');
    const [isAdding, setIsAdding] = useState(false);

    const addonPrices: { [key: string]: number } = {
        "shot dark": 20,
        "shot medium": 30,
        "oat milk": 20,
        "honey": 10,
        "vanilla syrup": 10,
        "dark roast": 0,
        "medium roast": 10,
    };
    const getTotalPrice = () => {
        if (!productData) return 0;
        const basePrice = Number(productData.price) || 0;
        const addonTotal = addon.reduce((sum, name) => sum + (addonPrices[name] || 0), 0);
        return (basePrice + addonTotal);
    };

    useEffect(() => {
        if (products && products.length > 0) {
            fetchProductData();
        }
    }, [products]);

    const fetchProductData = () => {
        const found = products.find((item) => item._id === id);
        if (found) {
            setProductData(found);
            setOption(found.option[0])
        }
      } 

    const drink: Drink = {
        productId: String(id),
        price: getTotalPrice(),
        option,
        selectedTime,
        addon,
        request,
        quantity
    }

    const increase = () => {
        setQuantity((prev) => prev + 1);
    }

    const decrease = () => {
        if (quantity > 1) setQuantity((prev) => prev - 1); // ป้องกันไม่ให้ติดลบ
    };

    const handleAddonToggle = (name: string) => {
        setAddon(prev =>
            prev.includes(name)
                ? prev.filter(item => item !== name)
                : [...prev, name]
        );
    };

    const handleBeanSelect = (name: string) => {
        setBean(name);
        setAddon(prev => {
            const filtered = prev.filter(item => item !== "dark roast" && item !== "medium roast");
            return [...filtered, name];
        });
    };

    const handleAddToCart = async (drink: Drink) => {
        setIsAdding(true);
        try {
            await addToCart(drink);
        } finally {
            setIsAdding(false);
        }
    };

    if (!productData) return <div className='w-full min-h-screen flex items-center justify-center'>Loading...</div>;

    return (
        <div>
            <Navbar/>
            <div className='h-18 w-full'></div>
            <ArrowLeft onClick={() => router.push('/')} className='absolute mx-2 mt-2 text-black bg-white rounded-full p-1 w-8 h-8 border border-gray-300'/>
            <Image 
                src={productData.imageUrl ? productData.imageUrl : assets.empty}
                alt="image" 
                width={0} 
                height={0} 
                sizes="100vw" 
                className='w-full h-auto'
            />
            <section className='pt-3'>
                <div className='px-4 md:px-8'>
                    <div className='flex justify-between items-center'>
                        <p className='text-xl font-semibold'>{productData.name}</p>
                        <p className='text-2xl font-semibold'>฿{productData.price}</p>
                    </div>
                    <p className='text-xs mt-2 text-gray-400'>{productData.description}</p>
                </div>

                <hr className='mt-4 text-gray-400/50'/>

                <div className='flex flex-col gap-3 mt-4 px-4 md:px-8'>
                    <p className='text-xl font-semibold'>ตัวเลือก</p>
                    {productData.option.map((item: string,index: number) => (
                        <div key={index} className='ml-1 flex items-center gap-2 text-gray-600'> 
                            <div onClick={() => setOption(item)} className={`${option === item ? 'border-7 border-primary' : 'border-2'} w-5 h-5 rounded-full border-gray-300`}></div>
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
                <hr className='mt-4 text-gray-400/50'/>

                {!productData.signature && productData.category === 'coffee' &&
                    <div>
                        <section className='flex flex-col gap-3 mt-4 px-4 md:px-8'>
                            <p className='text-xl font-semibold'>เมล็ดกาแฟ</p>
                            <div className='ml-1 flex items-center gap-2 text-gray-600'> 
                                <div
                                    onClick={() => handleBeanSelect('dark roast')}
                                    className={`${bean === 'dark roast' ? 'border-7 border-primary' : 'border-2'} w-5 h-5 rounded-full border-gray-300`}
                                ></div>
                                <p>dark roast</p>
                            </div>
                            <div className='ml-1 flex items-center gap-2 justify-between text-gray-600'>
                                <div className='flex gap-2'>
                                    <div
                                        onClick={() => handleBeanSelect('medium roast')}
                                        className={`${bean === 'medium roast' ? 'border-7 border-primary' : 'border-2'} w-5 h-5 rounded-full border-gray-300`}
                                    ></div>
                                    <p>medium roast</p>
                                </div>
                                <p>+10</p>
                            </div>
                        </section>
                        <hr className='mt-4 text-gray-400/50'/>
                    </div>
                }

                <section className='flex flex-col gap-3 mt-4 px-4 md:px-8'>
                    <p className='text-xl font-semibold'>เวลาที่ต้องการเครื่องดื่ม</p>
                    <div className='ml-1 flex items-center gap-2 text-gray-600'> 
                        <div onClick={() => setSelectedTime('ก่อนเริ่มการแสดง')} className={`${selectedTime === 'ก่อนเริ่มการแสดง' ? 'border-7 border-primary' : 'border-2'} w-5 h-5 rounded-full border-gray-300`}></div>
                        <p>ก่อนเริ่มการแสดง</p>
                    </div>
                    <div className='ml-1 flex items-center gap-2 text-gray-600'>
                        <div onClick={() => setSelectedTime('ช่วงพักเบรกระหว่างองก์')} className={`${selectedTime === 'ช่วงพักเบรกระหว่างองก์' ? 'border-7 border-primary' : 'border-2'} w-5 h-5 rounded-full border-gray-300`}></div>
                        <p>ช่วงพักเบรกระหว่างองก์</p>
                    </div>
                </section>
                <hr className='mt-4 text-gray-400/50'/>

`               {!productData.signature &&
                    <div>
                        <div className='flex flex-col gap-3 mt-4 px-4 md:px-8'>
                            <div className='flex justify-between'>
                                <p className='text-xl font-semibold'> ตัวเลือกเพิ่มเติม</p>
                                <p className='text-gray-400'>optional</p>
                            </div>
                            <div className='ml-1 flex justify-between text-gray-600'>  
                                <div className='flex items-center gap-3'>
                                    <div
                                        onClick={() => handleAddonToggle('shot dark')}
                                        className={`flex items-center justify-center text-white w-5 h-5 rounded-sm border-2 border-gray-300 cursor-pointer ${addon.includes('shot dark') ? 'bg-primary border-primary' : ''}`}
                                    >
                                        <Check />
                                    </div>
                                    <p>shot dark</p>
                                </div>
                                <p>+20</p>
                            </div>
                            <div className='ml-1 flex justify-between text-gray-600'>  
                                <div className='flex items-center gap-3'>
                                    <div
                                        onClick={() => handleAddonToggle('shot medium')}
                                        className={`flex items-center justify-center text-white w-5 h-5 rounded-sm border-2 border-gray-300 cursor-pointer ${addon.includes('shot medium') ? 'bg-primary border-primary' : ''}`}
                                    >
                                        <Check />
                                    </div>
                                    <p>shot medium</p>
                                </div>
                                <p>+30</p>
                            </div>
                            <div className='ml-1 flex justify-between text-gray-600'>  
                                <div className='flex items-center gap-3'>
                                    <div
                                        onClick={() => handleAddonToggle('oat milk')}
                                        className={`flex items-center justify-center text-white w-5 h-5 rounded-sm border-2 border-gray-300 cursor-pointer ${addon.includes('oat milk') ? 'bg-primary border-primary' : ''}`}
                                    >
                                        <Check />
                                    </div>
                                    <p>oat milk</p>
                                </div>
                                <p>+20</p>
                            </div>
                            <div className='ml-1 flex justify-between text-gray-600'>  
                                <div className='flex items-center gap-3'>
                                    <div
                                        onClick={() => handleAddonToggle('honey')}
                                        className={`flex items-center justify-center text-white w-5 h-5 rounded-sm border-2 border-gray-300 cursor-pointer ${addon.includes('honey') ? 'bg-primary border-primary' : ''}`}
                                    >
                                        <Check />
                                    </div>
                                    <p>honey</p>
                                </div>
                                <p>+10</p>
                            </div>
                            <div className='ml-1 flex justify-between text-gray-600'>  
                                <div className='flex items-center gap-3'>
                                    <div
                                        onClick={() => handleAddonToggle('vanilla syrup')}
                                        className={`flex items-center justify-center text-white w-5 h-5 rounded-sm border-2 border-gray-300 cursor-pointer ${addon.includes('vanilla syrup') ? 'bg-primary border-primary' : ''}`}
                                    >
                                        <Check />
                                    </div>
                                    <p>vanilla syrup</p>
                                </div>
                                <p>+10</p>
                            </div>
                        </div>
                        <hr className='mt-4 text-gray-400/50'/>
                    </div>
                }
            </section>

            <section className='p-4'>
                <div className='flex justify-between'>
                    <p className='text-xl font-semibold'>หมายเหตุถึงร้านค้า</p>
                    <p className='text-gray-400'>optional</p>
                </div>
                <textarea 
                    className='p-3 mt-3 w-full border rounded-lg border-gray-300' 
                    name="request" 
                    id="request"
                    placeholder='ส่งข้อความถึงร้านค้า'
                    value={request}
                    onChange={e => setRequest(e.target.value)}
                >
                </textarea>
            </section>

            <div className='h-36 w-full'></div>

            <section className='fixed flex border-t border-gray-300 w-full bg-white pb-8 p-4 bottom-0 gap-3 justify-center items-center'>
                <div className='flex gap-4 items-center'>
                    <SquareMinus onClick={() => decrease()} className='text-black/80 w-8 h-8' />
                    <p className='font-medium'>{quantity}</p>
                    <SquarePlus onClick={() => increase()} className='text-black/80 w-8 h-8' />
                </div>
                <button
                    onClick={() => handleAddToCart(drink)}
                    className='md:max-w-1/3 flex flex-1 justify-between p-4 bg-primary text-white font-medium rounded-lg disabled:opacity-60'
                    disabled={isAdding}
                >
                    <p>{isAdding ? 'กำลังเพิ่มลงตะกร้า...' : 'เพิ่มลงตะกร้า'}</p>
                    <p>฿{getTotalPrice() * quantity}</p>
                </button>
            </section>
        </div>
    )
}

export default ProductItem
