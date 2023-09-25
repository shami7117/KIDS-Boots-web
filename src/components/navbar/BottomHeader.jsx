import React, { useState, useEffect } from 'react';
import Wrapper from '../shared/Wrapper'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { BsArrowDown } from 'react-icons/bs'
import { MdKeyboardArrowDown } from 'react-icons/md'
import Link from 'next/link'
import { useRouter } from 'next/router';
import axios from 'axios';






const BottomHeader = () => {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const [Location, setLocation] = useState(false);

    const [userCountry, setUserCountry] = useState(null);
    const [userRegion, setUserRegion] = useState(null);
    const [userAddress, setUserAddress] = useState(null);


    const apiKey = '67273a00-5c4b-11ed-9204-d161c2da74ce'; // Replace with your actual API key
    const apiUrl = `https://geolocation-db.com/json/${apiKey}`;

    const getUserCountry = async () => {
        try {
            const response = await axios.get(apiUrl); // Use your geolocation API here
            const { country_name } = response.data;

            setUserCountry(country_name);
            console.log(`User's country: ${country_name}`);
            return country_name;
        } catch (error) {
            console.error('Error fetching user location:', error);
            return null;
        }
    };

    console.log("User's country:", userCountry);



    console.log("COUNTRY", userCountry)
    const handleLocationClick = async () => {
        const country = await getUserCountry();

        if (country) {
            router.push({
                pathname: '/product-listing',
                query: { country }
            });
        } else {
            // Handle the case where userCountry is null or empty
        }
    };
    const handleCategoryHover = () => {
        setShowDropdown(true);
    };

    const handleCategoryLeave = () => {
        setShowDropdown(false);
    };


    return (
        <div className='bg-primary-purple-color text-white h-[54px] md:flex hidden'>
            <Wrapper>
                <div className='flex justify-between items-center gap-[40rem] py-4'>
                    <div>
                        <ul className='flex gap-6 items-center justify-between cursor-pointer'>
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
                                        <Link href={{
                                            pathname: '/product-listing',
                                            query: { category: 'afo' },
                                        }}>Buy AFO System</Link>
                                        <Link href={{
                                            pathname: '/product-listing',
                                            query: { category: 'abduction' },
                                        }}>Buy Abduction Bar</Link>

                                    </div>
                                )}
                            </li>
                            <Link className='whitespace-nowrap' href="/product-listing">
                                Buy New Products
                            </Link>


                        </ul>

                    </div>
                    <div onClick={handleLocationClick}

                        className='hidden gap-1   whitespace-nowrap justify-center items-center cursor-pointer xl:flex'>

                        <HiOutlineLocationMarker size={21} />
                        <p>
                            {userCountry !== null ? userCountry : <span >Enable Location</span>}
                        </p>
                        {/* <MdKeyboardArrowDown size={21} /> */}
                    </div>
                </div>
            </Wrapper>
        </div>
    )
}

export default BottomHeader