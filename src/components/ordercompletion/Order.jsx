import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
const Order = () => {
  return (
    <div className='flex flex-col justify-center items-center text-center gap-5'>
      <Image src={'/images/shopping-bag.png'} width={1080} height={1080} className='max-w-[142px] max-h-[142px]' style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <h1 className='text-[#46CC6B] font-[700] text-[24px] '>
        Order Successful!
      </h1>
      <p>
        Thank you so much for choosing Clubfoot.online.
      </p>
      <p className='md:max-w-[548px]'>
        We appreciate your trust in us and look forward to serving you. Your support helps us make clubfoot care accessible and affordable. Feel free to reach out if you have any questions or need assistance.      </p>
      <button className='w-[306px] h-[50px] text-white bg-[#1A9CDA] rounded-md'>
        <Link href="/">
          Go Back Home
        </Link>

      </button>
    </div>
  )
}

export default Order