"use client"
import React, { useState, useEffect } from 'react';
import Wrapper from '../shared/Wrapper'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
import Image from 'next/image';
import { MdKeyboardArrowDown } from "react-icons/md";
import Link from 'next/link';
import { Select } from 'antd';
import { useRouter } from 'next/router';

const { Option } = Select;

const UpperHeader = () => {
    const router = useRouter();
    const [Currency, setCurrency] = useState('USD');
    // useEffect(() => {
    //     router.push({ query: { currency: Currency } })
    // })
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
                        <select defaultValue={"USD"}
                            className='bg-transparent outline-none'
                            value={Currency}
                            onChange={(e) => {
                                setCurrency(e.target.value)
                                const currentQueryParams = { ...router.query };

                                // Add a new query parameter
                                currentQueryParams.Currency = e.target.value;

                                // Update the URL with the new query parameters
                                router.push({
                                    pathname: router.pathname === "/cart-checkout" && '/cart-checkout', // Use the current path
                                    query: currentQueryParams, // Updated query parameters
                                });
                            }}
                        >


                            <option className='text-[#000] outline-none'
                                value="USD">$USD</option>
                            <option className='text-[#000] outline-none' value="EUR">€EURO</option>
                        </select>
                    </div>

                </div>
            </Wrapper>

        </div>
    )
}

export default UpperHeader