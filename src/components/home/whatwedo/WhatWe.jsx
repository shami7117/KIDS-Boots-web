import Wrapper from '@/components/shared/Wrapper'
import React from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import { Libre_Franklin } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
const font = Libre_Franklin({ subsets: ['latin'] })
const WhatWe = () => {
    return (
        <div className={`${font.className} pt-10 md:py-5 `}>
            <Wrapper>
                <div className=''>
                <Image src={'/images/Vector.png'}  alt='' width={150} height={150} className='hidden md:flex'/>
                <div className='flex md:mt-[-3rem] flex-col justify-center items-center text-center'>
                    <h1 className='text-[40px] font-[700] '>
                        What We Do
                    </h1>
                    <p className='md:w-[569px] text-[#313131]'>
                    Welcome to the Clubfoot.online, your trusted platform dedicated to supporting families affected by clubfoot. We understand that navigating clubfoot treatment, especially with the renowned Ponseti method, can be challenging. That's why we've created a unique online space where compassion, affordability, and community come together to empower you on this journey.                    </p>
                  <Link href={'/what-we-do'}>
                    <button className='flex gap-3 items-center justify-center w-[162px] h-[50px] mt-5 bg-primary-pink-color text-white rounded-[5px]'>
                       Learn More
                        <FiArrowUpRight size={20} />
                    </button>
                  </Link>

                </div>
                <Image src={'/images/Vector.png'}  alt='' width={150} height={150} className='hidden  right-28 md:flex float-right mt-[-5rem] '/>

                </div>

            </Wrapper>
        </div>
    )
}

export default WhatWe