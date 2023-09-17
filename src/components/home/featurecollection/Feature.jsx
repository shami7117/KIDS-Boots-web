import React from 'react'
import { Libre_Franklin } from 'next/font/google'
import Wrapper from '@/components/shared/Wrapper'
import Image from 'next/image'
import { RiArrowLeftRightLine } from 'react-icons/ri'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductApi from "@/lib/product";
import { ThreeDots } from 'react-loader-spinner'


const Feature = () => {
  // const [data, setData] = useState([
  //   {
  //     img: '/images/shoe1.png',
  //     title: 'Mitchell Ponseti® AFO standard with Ponseti®',
  //     drop: '$100.00',
  //     price: '$120.00',
  //     color: 'D9D9D9',
  //     isHeartFilled: false,
  //   },
  //   {
  //     img: '/images/shoe2.png',
  //     title: 'Mitchell Ponseti® AFO standard with Ponseti®',
  //     drop: '$100.00',
  //     price: '$120.00',
  //     color: 'A51F6C',
  //     isHeartFilled: false,
  //   },
  //   {
  //     img: '/images/shoe3.png',
  //     title: 'Mitchell Ponseti® AFO standard with Ponseti®',
  //     drop: '$100.00',
  //     price: '$120.00',
  //     color: 'A0CEF8',
  //     isHeartFilled: false,
  //   },
  //   {
  //     img: '/images/shoe4.png',
  //     title: 'Mitchell Ponseti® AFO standard with Ponseti®',
  //     drop: '$100.00',
  //     price: '$120.00',
  //     color: 'D9D9D9',
  //     isHeartFilled: false,
  //   },
  // ])



  const handleHeartClick = (index) => {
    const newData = [...data];
    newData[index].isHeartFilled = !newData[index].isHeartFilled;
    setData(newData);
  };


  const { data, isLoading, isError } = useQuery(
    ['FeaturedProducts'],
    async () => {

      const response = await ProductApi.getFeaturedProducts();
      return response;// Assuming your API returns data property

    }
  );
  console.log("Featured", data)

  if (isLoading) {
    return <div className="flex justify-center items-center"> <ThreeDots
      height="100"
      width="100"
      radius="9"
      color="#A51F6C"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClassName=""
      visible={true}
    />
    </div>
  }
  if (isError) {
    return <h1>Error</h1>
  }

  return (
    <div className={`  mt-20`}>
      <Wrapper>
        <div className='bg-[#D14D721A] rounded-md px-10 justify-center flex items-center flex-col py-10 '>
          <h1 className='text-[40px] font-[700] '>
            Feature Collection
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:mt-20 mt-32">
            {data.map((card, index) => (
              <div key={index} className='flex flex-col group justify-center items-center hover:-translate-y-3 ease-in duration-300 '>
                <Link href={`/product-details/${card.id}`}

                  className={`bg-white pt-5 h-[265px] cursor-pointer  w-[276px] rounded-md justify-center items-center ${index === 0 || index === 2 ? 'elevated' : 'lowered '
                    }`}
                >
                  {/* Card content */}
                  <Image src={card.file} alt='' width={1080} height={1080} className='m-auto max-w-[200px] max-h-[200px]' style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  <div className='flex gap-[1px] mt-10 itemsssssss opacity-0 group-hover:opacity-100 transition-all duration-300 '>
                    <button className='bg-[#2A2F4F] h-[45px] w-[51px] flex items-center justify-center bottom-0'>
                      <RiArrowLeftRightLine size={20} className='text-white' />
                    </button>
                    <Link href={`/product-details/${card.id}`}>
                      <button className='bg-[#A51F6C] text-white h-[45px] w-[175px] flex items-center justify-center bottom-0 cursor-pointer'>
                        Add to Cart
                      </button>
                    </Link>
                    <button className='bg-[#2A2F4F] h-[45px] w-[51px] flex items-center justify-center bottom-0'>
                      {card.isHeartFilled ? (
                        <AiFillHeart
                          size={20}
                          className='text-[#A51F6C] cursor-pointer'
                          onClick={(e) => {
                            e.preventDefault();
                            handleHeartClick(index);
                          }}
                        />
                      ) : (
                        <AiOutlineHeart
                          size={20}
                          className='text-white cursor-pointer'
                          onClick={(e) => {
                            e.preventDefault();
                            handleHeartClick(index);
                          }}
                        />
                      )}

                    </button>
                  </div>
                </Link>
                <div className='flex justify-center items-center text-center font-[600] text-[16px]'>
                  <p className={`${index === 0 || index === 2 ? 'mt-9' : 'mt-9 '
                    }`}>{card.category}</p>
                </div>
                <div className='flex gap-3 my-1 items-center'>
                  <span className='text-[#707070] text-xs line-through'>${card.price}</span>
                  <span className='text-primary-pink-color text-[18px] font-[500]'>
                    ${card.price}
                  </span>
                </div>
                <div>
                  <p className='text-[#777777] font-[500] text-[16px]'>Available Colors</p>
                </div>
                <div className='flex justify-center items-center mt-2'>
                  <p className={`w-[21px] h-[21px] border border-solid border-[2px] rounded-full`}
                    style={{ backgroundColor: `${card.color}` }}  >
                  </p>

                </div>
              </div>
            ))}
          </div>

        </div>
      </Wrapper>

    </div>
  )
}

export default Feature