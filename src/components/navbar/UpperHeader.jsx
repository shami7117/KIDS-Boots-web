"use client"
import React, { useState, useEffect } from 'react';
import Wrapper from '../shared/Wrapper'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
import Image from 'next/image';
import { MdKeyboardArrowDown } from "react-icons/md";
import Link from 'next/link';

const UpperHeader = () => {
    const items = [
        {
            key: '1',
            label: 'Item 1',
            imageSrc: '/path/to/image1.png',
        },
        {
            key: '2',
            label: 'Item 2',
            imageSrc: '/path/to/image2.png',
        },
        {
            key: '3',
            label: 'Item 3',
            imageSrc: '/path/to/image3.png',
        },
    ];

    const [userCountry, setUserCountry] = useState(null);

    useEffect(() => {
        try {
            if ('geolocation' in navigator) {
                try {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        const { coords } = position;
                        const response = await fetch(
                            `https://geocode.xyz/${coords.latitude},${coords.longitude}?json=1`
                        );
                        const data = await response.json();
                        console.log("DATA", data)

                        setUserCountry(data.country);
                    });
                } catch (error) {
                    console.log("LOCATION ERROR", error)
                    setUserCountry('');

                }
            } else {
                setUserCountry('Geolocation is not available in your browser.');
            }
        } catch (error) {
            console.log(error)
        }
    }, []);

    return (
        <div className='bg-primary-pink-color text-white'>
            <Wrapper>
                <div className='flex justify-between h-[45px] items-center md:text-[16px] text-[9px]'>
                    <ul className='flex gap-6 font-[400]'>
                        <Link href="/contact-us">Contact Us</Link>
                        <Link href="/about-us">About Us</Link>
                        <Link href="/faq">FAQ</Link>
                    </ul>
                    <div className='flex gap-6 items-center font-[400]'>
                        <div>
                            <p>
                                $/USD
                            </p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            {/* <Image src={"/images/usa.png"} width={200} height={200} alt='' className='w-[25px]' /> */}
                            <p>{userCountry}</p>
                            {/* <MdKeyboardArrowDown size={20} /> */}
                        </div>
                    </div>

                </div>
            </Wrapper>

        </div>
    )
}

export default UpperHeader