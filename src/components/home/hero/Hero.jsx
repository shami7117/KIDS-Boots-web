"use client"
import Wrapper from '@/components/shared/Wrapper'

import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';



// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import { FiArrowUpRight } from 'react-icons/fi';
import Image from 'next/image';
import { Libre_Franklin } from 'next/font/google'
import Link from 'next/link'
const font = Libre_Franklin({ subsets: ['latin'] })
const Hero = () => {
  return (
    <div className={font.className}>

      <div className='mt-10 max-w-[1400px] mx-auto'>
        <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
          <SwiperSlide>
            <div className='max-w-screen-xl bg-[#F2F7FA] rounded-[5px] px-10  mx-auto flex items-center flex-col md:flex-row md:justify-between'>
              {/* left */}
              <div className='basis-[100%] pt-10 flex flex-col md:basis-[50%] items-start justify-start '>
                <div className='h-10 w-10 rounded-full bg-[#D14D724A] '>

                </div>
                <h1 className='font-[700] text-[32px] md:text-[48px] text-primary-pink-color'>
                  Empowering Lives<span className='text-black'>,<br />One
                    Step at a Time"
                  </span>
                </h1>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantiumSed ut perspiciatis unde omnis iste  </p>
                <button className='flex gap-3 items-center justify-center w-[162px] h-[50px] mt-10 bg-primary-pink-color text-white rounded-[5px]'>
                  <Link href="/product-listing">
                  Shop Now
                  </Link>
                  <FiArrowUpRight size={20} />
                </button>
                <div className='w-7 h-7 bg-[#D14D721A] rounded-full mt-5' >

                </div>
              </div>
              {/* right  */}
              <div className='flex basis-[100%] md:basis-[50%] flex-col justify-end items-end'>
                <div className='relative'>

                  {/* Background Image */}
                  <Image src={'/images/bg.png'} alt='' width={1440} height={1440} className='absolute top-0 left-0 w-full h-full z-0 object-contain' />
                  <Image src={'/images/baloon.png'} alt='' width={500} height={500} className='absolute top-0 left-0 w-full h-full z-0 ' />

                  {/* Background Circle */}
                  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:w-80 md:h-80 w-52 h-52 rounded-full bg-[#B6DFF3] z-2'></div>

                  {/* Banner Image */}
                  <Image src={'/images/bannerr.png'} alt='' width={2440} height={1080} className='relative w-[623px] z-10' />
                  <div className='w-5 h-5 absolute inset-0 mt-[20rem] md:mt-[27rem] rounded-full  bg-[#B6DFF3]'>

                  </div>
                </div>
              </div>

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='max-w-screen-xl bg-[#F2F7FA] rounded-[5px] px-10  mx-auto flex items-center flex-col md:flex-row md:justify-between border h-full'>
              {/* left */}
              <div className='basis-[100%] pt-10 flex flex-col md:basis-[50%] items-start justify-start '>
                <div className='h-10 w-10 rounded-full bg-[#D14D724A] '>

                </div>
                <h1 className='font-[700] text-[32px] md:text-[48px] text-primary-pink-color'>
                  Empowering Lives<span className='text-black'>,<br />One
                    Step at a Time"
                  </span>
                </h1>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantiumSed ut perspiciatis unde omnis iste  </p>
                <button className='flex gap-3 items-center justify-center w-[162px] h-[50px] mt-10 bg-primary-pink-color text-white rounded-[5px]'>
                  Shop Now
                  <FiArrowUpRight size={20} />
                </button>
                <div className='w-7 h-7 bg-[#D14D721A] rounded-full mt-5' >

                </div>
              </div>
              {/* right  */}
              <div className='flex basis-[100%] md:basis-[50%] flex-col justify-end items-end'>
                <div className='relative'>

                  {/* Background Image */}
                  <Image src={'/images/bg.png'} alt='' width={1440} height={1440} className='absolute top-0 left-0 w-full h-full z-0 object-contain' />
                  <Image src={'/images/baloon.png'} alt='' width={500} height={500} className='absolute top-0 left-0 w-full h-full z-0 ' />

                  {/* Background Circle */}
                  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:w-80 md:h-80 w-52 h-52 rounded-full bg-[#B6DFF3] z-2'></div>

                  {/* Banner Image */}
                  <Image src={'/images/bannerr.png'} alt='' width={2440} height={1080} className='relative w-[623px] z-10'  />
                  <div className='w-5 h-5 absolute inset-0 mt-[20rem] md:mt-[27rem] rounded-full  bg-[#B6DFF3]'>

                  </div>
                </div>
              </div>

            </div>
          </SwiperSlide>

        </Swiper>

      </div>

    </div>
  )
}

export default Hero