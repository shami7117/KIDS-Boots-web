"use client"
import Image from 'next/image';
import React, { useState } from 'react';

const FilterSidebar = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountries, setSelectedCountries] = useState([]);
    const countries = [
        { id: 1, img: '/images/flag1.png', name: 'Germany', code: 'US' },
        { id: 2, img: '/images/flag2.png', name: 'France', code: 'CA' },
        { id: 3, img: '/images/flag3.png', name: 'Netherlands', code: 'CA' },
        { id: 4, img: '/images/flag4.png', name: 'Belgium', code: 'CA' },
        { id: 5, img: '/images/flag5.png', name: 'Greece', code: 'CA' },
        { id: 6, img: '/images/flag6.png', name: 'Poland', code: 'CA' },
        // Add more countries...
    ];
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCheckboxChange = (country) => {
        if (selectedCountries.includes(country)) {
            setSelectedCountries(selectedCountries.filter((c) => c !== country));
        } else {
            setSelectedCountries([...selectedCountries, country]);
        }
    };

    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    



    return (
        <div className='bg-[#EAF8FF3B] min-w-[287px] h-full w-full text-[#777777] px-6 py-6 border border-gray-200 rounded-md'>
            <div className='flex flex-col  md:basis-[20%]'>
                <h2 className='text-[24px] font-semibold text-left text-black'>Filters</h2>
                <hr className='border-t border-gray-400 my-2' />

                {/* Location */}
                <h3 className='text-[24px] font-semibold my-4 text-black'>Location</h3>
                <div className='relative'>
                    <input
                        type="text"
                        placeholder="Search countries..."
                        className="w-full mb-2 px-4 py-2 rounded border"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <div className="space-y-2">
                        {filteredCountries.map((country) => (
                            <label key={country.id} className="flex items-center space-x-2">
                                
                                <input
                                    type="checkbox"
                                    className="form-checkbox"

                                />
                                <Image src={country.img} width={21} height={14} alt=''/>
                                <span>{country.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <hr className='border-t border-gray-400 my-6' />



                {/* Category */}
                <h3 className='text-[24px] font-semibold my-4 text-black'>Category</h3>
                <label className='flex items-center mt-2'>
                    <input
                        type='radio'
                        className='mr-2'
                    />
                    Abduction Bar
                </label>
                <label className='flex items-center mt-2'>
                    <input
                        type='radio'
                        className='mr-2'
                    />
                    AFO System
                </label>
                <div className='ml-5'>
                    <label className='flex items-center mt-2'>
                        <input
                            type='radio'
                            className='mr-2'
                        />
                        Standard
                    </label>
                    <label className='flex items-center mt-2'>
                        <input
                            type='radio'
                            className='mr-2'
                        />
                        Toe Stilt
                    </label>
                    <label className='flex items-center mt-2'>
                        <input
                            type='radio'
                            className='mr-2'
                        />
                        Planter Flexion Stop
                    </label>
                    <label className='flex items-center mt-2'>

                        Others...
                    </label>

                </div>
                <hr className='border-t border-gray-400 my-6' />

                <h3 className='text-[24px] font-semibold my-4 text-black'>Price</h3>
                <div className='relative'>
                    <div className=''>
                        <label className='flex items-center mt-2'>
                            <input
                                type='radio'
                                className='mr-2'
                            />
                            $0 - $60
                        </label>
                        <label className='flex items-center mt-2'>
                            <input
                                type='radio'
                                className='mr-2'
                            />
                            $100 - $120
                        </label>
                        <label className='flex items-center mt-2'>
                            <input
                                type='radio'
                                className='mr-2'
                            />
                            $150 - $200
                        </label>
                        <label className='flex items-center mt-2'>
                            <input
                                type='radio'
                                className='mr-2'
                            />
                            $200 - $350
                        </label>
                        <label className='flex items-center mt-2'>
                            <input
                                type='radio'
                                className='mr-2'
                            />
                            $300 - $500
                        </label>
                        <div className='flex gap-6 items-center mt-3'>
                            <div>
                                <input type='text' className='w-14 h-10 rounded-md border pl-3' placeholder='0' />

                            </div>
                            <p>-</p>
                            <div>
                                <input type='text' className='w-14 h-10 rounded-md border pl-3' placeholder='$555' />

                            </div>

                        </div>


                    </div>
                    <hr className='border-t border-gray-400 my-6' />
                </div>


                {/* Color Selection */}
                <h3 className='text-[24px] font-semibold my-4 text-black'>Color</h3>
                <div className='flex flex-col gap-4'>
                    <div className='flex gap-3 items-center'>
                        <p className='h-7 w-7 rounded-full bg-[#D9D9D9]'></p>
                        <p>Gray</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <p className='h-7 w-7 rounded-full bg-[#00ADDF]'></p>
                        <p>Blue</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <p className='h-7 w-7 rounded-full bg-[#FF87C5]'></p>
                        <p>Pink</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <p className='h-7 w-7 rounded-full bg-[#F28500]'></p>
                        <p>Tangerine</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <p className='h-7 w-7 rounded-full bg-[#E4A502]'></p>
                        <p>Yellow</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <p className='h-7 w-7 rounded-full bg-[#A0CEF8]'></p>
                        <p>Light Blue</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <p className='h-7 w-7 rounded-full bg-[#F56F45]'></p>
                        <p>Red</p>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <p>Others...</p>
                    </div>
                </div>
                <hr className='border-t border-gray-400 my-6' />
                {/* Color checkboxes here */}

                {/* Rating */}
                <h3 className='text-[24px] font-semibold my-4 text-black'>Rating</h3>
                <div className=''>
                    <label className='flex items-center mt-2'>
                        <input
                            type='radio'
                            className='mr-2'
                        />
                        5 Star
                    </label>
                    <label className='flex items-center mt-2'>
                        <input
                            type='radio'
                            className='mr-2'
                        />
                        4 Star
                    </label>
                    <label className='flex items-center mt-2'>
                        <input
                            type='radio'
                            className='mr-2'
                        />
                        3 Star
                    </label>
                    <label className='flex items-center mt-2'>
                        <input
                            type='radio'
                            className='mr-2'
                        />
                        2 Star
                    </label>
                    <label className='flex items-center mt-2'>
                        <input
                            type='radio'
                            className='mr-2'
                        />
                        1 Star
                    </label>



                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
