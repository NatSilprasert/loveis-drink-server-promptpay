import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image'
import React from 'react'

const ProductCard = ({ product }: { product: any }) => {

  const { router } = useAppContext();

  return (
    <div onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }} className='border border-gray-400/50 rounded-xl'>
        <Image className="object-cover rounded-t-xl" src={product.imageUrl ? product.imageUrl : assets.empty} alt="image" width={256} height={256}  />
        <div className='flex flex-col mx-2 my-3 gap-1'>
            <p className='font-semibold'>{product.name}</p>
            <p className='text-xl'>฿{product.price}</p>
        </div>
    </div>
  )
}

export default ProductCard
