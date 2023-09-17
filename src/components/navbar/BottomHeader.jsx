import React, { useState, useEffect } from 'react';
import Wrapper from '../shared/Wrapper'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { BsArrowDown } from 'react-icons/bs'
import { MdKeyboardArrowDown } from 'react-icons/md'
import Link from 'next/link'
const BottomHeader = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const [userCountry, setUserCountry] = useState(null);
    const [userRegion, setUserRegion] = useState(null);
    const [userAddress, setUserAddress] = useState(null);

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
                        setUserRegion(data.region);
                        setUserAddress(data.staddress);
                    });
                } catch (error) {
                    console.log("LOCATION ERROR", error)
                    setUserCountry('');
                    setUserRegion('');
                    setUserAddress('');

                }
            } else {
                setUserCountry('Geolocation is not available in your browser.');
            }
        } catch (error) {
            console.log(error)
        }
    },);

    console.log("COUNTRY", userCountry)

    const handleCategoryHover = () => {
        setShowDropdown(true);
    };

    const handleCategoryLeave = () => {
        setShowDropdown(false);
    };
    return (
        <div className='bg-primary-purple-color text-white h-[54px] md:flex hidden'>
            <Wrapper>
                <div className='flex justify-between gap-[40rem] py-4'>
                    <div>
                        <ul className='flex gap-6 items-center cursor-pointer'>
                            <Link href="/">
                                Home
                            </Link>
                            <li
                                onClick={handleCategoryHover}
                                onMouseLeave={handleCategoryLeave}
                            >
                                Categories
                                {showDropdown && (
                                    <div className='flex gap-3 z-10 flex-col absolute bg-white text-black py-4 px-4 rounded-md shadow-md '
                                    >
                                        <Link href='/product-listing'>Buy AFO System</Link>
                                        <Link href='/product-listing'>Buy Abduction Bar</Link>

                                    </div>
                                )}
                            </li>
                            <Link className='whitespace-nowrap' href="/product-listing">
                                Buy New Products
                            </Link>


                        </ul>
                    </div>
                    <div className='hidden gap-1 whitespace-nowrap justify-center items-center cursor-pointer xl:flex'>

                        <HiOutlineLocationMarker size={21} />
                        <p>
                            {userCountry}
                        </p>
                        {/* <MdKeyboardArrowDown size={21} /> */}
                    </div>
                </div>
            </Wrapper>
        </div>
    )
}

export default BottomHeader