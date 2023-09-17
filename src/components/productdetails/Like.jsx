import Image from 'next/image';
import React, { useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { RiArrowLeftRightLine } from 'react-icons/ri';

const Like = () => {
    const [data, setData] = useState([
        {
            img: '/images/shoe1.png',
            title: 'Mitchell Ponseti® AFO standard with Ponseti®',
            price: '$100.00',
            drop: '$120.00',
            color: 'D9D9D9',
            isHeartFilled: false,
        },
        {
            img: '/images/shoe2.png',
            title: 'Mitchell Ponseti® AFO standard with Ponseti®',
            price: '$100.00',
            drop: '$120.00',
            color: 'A51F6C',
            isHeartFilled: false,
        },
        {
            img: '/images/shoe3.png',
            title: 'Mitchell Ponseti® AFO standard with Ponseti®',
            price: '$100.00',
            drop: '$120.00',
            price: '$120.00',
            color: 'A0CEF8',
            isHeartFilled: false,
        },
        {
            img: '/images/shoe4.png',
            title: 'Mitchell Ponseti® AFO standard with Ponseti®',
            price: '$100.00',
            drop: '$120.00',
            price: '$120.00',
            color: 'D9D9D9',
            isHeartFilled: false,
        },
    ])
    const handleHeartClick = (index) => {
        const newData = [...data];
        newData[index].isHeartFilled = !newData[index].isHeartFilled;
        setData(newData);
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-10">
            {data.map((card, index) => (
                <div key={index} className=' group flex flex-col justify-center items-center hover:-translate-y-3 ease-in duration-300'>
                    <div

                        className={`bg-[#d9d9d9b5] pt-5  w-[276px] rounded-md justify-center items-center `}
                    >
                        {/* Card content */}
                        <Image src={card.img} alt='' width={200} height={200} className='m-auto w-[200px] h-[200px]' />
                        <div className='flex gap-[1px] mt-10 itemsssssss opacity-0 group-hover:opacity-100 transition-all duration-300 '>
                            <div className='bg-[#2A2F4F] h-[45px] w-[51px] flex items-center justify-center bottom-0'>
                                <RiArrowLeftRightLine size={20} className='text-white' />
                            </div>
                            <button className='bg-[#A51F6C] text-white h-[45px] w-[175px] flex items-center justify-center bottom-0'>
                                Add to Cart
                            </button>
                            <div className='bg-[#2A2F4F] h-[45px] w-[51px] flex items-center justify-center bottom-0'>
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
                                            e.preventDefault(); // Prevent heart click from triggering link
                                            handleHeartClick(index);
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-center text-center font-[600] text-[16px]'>
                        <p className='mt-2 px-3'>{card.title}</p>
                    </div>
                    <div className='flex gap-3 my-1 items-center'>
                        <span className='text-[#707070] text-xs line-through'>{card.drop}</span>
                        <span className='text-primary-pink-color text-[18px] font-[500]'>
                            {card.price}
                        </span>
                    </div>
                    <div>
                        <p className='text-[#777777] font-[500] text-[16px]'>Available Colors</p>
                    </div>
                    <div className='flex gap-3 mt-2'>
                        <p className={`w-[21px] h-[21px] rounded-full bg-[#D9D9D9] `}>
                        </p>
                        <p className='w-[21px] h-[21px] rounded-full bg-[#A51F6C]'>
                        </p>
                        <p className='w-[21px] h-[21px] rounded-full bg-[#A0CEF8]'>
                        </p>
                    </div>
                </div>
            ))}
        </div>

    )
}

export default Like