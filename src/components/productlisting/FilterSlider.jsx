"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

const FilterSidebar = ({ updateValue }) => {



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
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        category: '',
        country: '',
        minPrice: '0',
        maxPrice: '0',
        color: '',

    });
    console.log("DATA", formData)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle radio buttons and checkbox
        const newValue = type === 'radio' ? value : type === 'checkbox' ? checked : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };
    useEffect(() => {
        updateValue(formData);

    })

    const countries = [

        { id: 1, img: "/images/flag1.png", name: "Germany", code: "US" },
        { id: 2, img: "/images/flag2.png", name: "France", code: "CA" },
        { id: 3, img: "/images/flag3.png", name: "Netherlands" },
        { id: 4, img: "/images/flag4.png", name: "Belgium", code: "CA" },
        { id: 5, img: "/images/flag5.png", name: "Greece", code: "CA" },
        { id: 6, img: "/images/flag6.png", name: "Poland", code: "CA" },

    ];
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#EAF8FF3B] min-w-[287px] h-full w-full text-[#777777] px-6 py-6 border border-gray-200 rounded-md">
            <div className="flex flex-col  md:basis-[20%]">
                <h2 className="text-[24px] font-semibold text-left text-black">
                    Filters
                </h2>
                <hr className="border-t border-gray-400 my-2" />

                {/* Location */}
                <h3 className="text-[24px] font-semibold my-4 text-black">Location</h3>
                <div className="relative">
                    {/* <input
                        type="text"
                        placeholder="Search countries..."
                        className="w-full focus:outline-none mb-2 px-4 py-2 pr-10 rounded border"
                        onChange={(e) => {
                            handleChange(e);
                            if (e.target.value) {
                                // Set formData.category to 'abduction' when checked
                                setFormData({ ...formData, country: formData.name });
                            }
                        }}
                        value={formData.country}

                    />
                    <div className="absolute top-0 right-0 px-2 py-2">
                        <AiOutlineSearch size={20} />
                    </div> */}
                    {/* <label className="flex items-center my-2 space-x-3">
                        <input type="checkbox" className="form-checkbox" />
                        <p>
                            Closest to me

                        </p>
                    </label> */}
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" onChange={(e) => {
                                handleChange(e);
                                if (e.target.checked) {
                                    // Set formData.category to 'abduction' when checked
                                    setFormData({ ...formData, country: userCountry });
                                }
                            }} checked={formData.country === userCountry}
                                value={userCountry} className="form-checkbox" />
                            {/* <Image src={country.img} width={21} height={14} alt="" /> */}
                            <h1>Current:</h1>
                            <span>{userCountry}</span>
                        </label>
                        {filteredCountries.map((country) => (
                            <label key={country.id} className="flex items-center space-x-2">
                                <input type="checkbox" onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, country: country.name });
                                    }
                                }} checked={formData.country === country.name}
                                    value={country.name} className="form-checkbox" />
                                <Image src={country.img} width={21} height={14} alt="" />
                                <span>{country.name}</span>
                            </label>
                        ))}
                    </div>


                </div>
                <hr className="border-t border-gray-400 my-6" />

                {/* Category */}
                <h3 className="text-[24px] font-semibold my-4 text-black">Category</h3>
                <label className="flex items-center mt-2">
                    <input
                        onChange={(e) => {
                            handleChange(e);
                            if (e.target.checked) {
                                // Set formData.category to 'abduction' when checked
                                setFormData({ ...formData, category: 'abduction' });
                            }
                        }}
                        checked={formData.category === 'abduction'}
                        value='abduction'
                        type="radio"
                        name="category"
                        className="mr-2"
                    />
                    Abduction Bar
                </label>

                <label className="flex items-center mt-2">
                    <input
                        onChange={(e) => {
                            handleChange(e);
                            if (e.target.checked) {
                                // Set formData.category to 'abduction' when checked
                                setFormData({ ...formData, category: 'afo' });
                            }
                        }} checked={formData.category === 'afo'}
                        value='afo'
                        type="radio"
                        name="category  " className="mr-2" />
                    AFO System
                </label>
                {/* <div className="ml-5">
                    <label className="flex items-center mt-2">
                        <input type="radio" className="mr-2" />
                        Standard
                    </label>
                    <label className="flex items-center mt-2">
                        <input type="radio" className="mr-2" />
                        Toe Stilt
                    </label>
                    <label className="flex items-center mt-2">
                        <input type="radio" className="mr-2" />
                        Planter Flexion Stop
                    </label>
                    <label className="flex items-center mt-2">
                        <input type="radio" className="mr-2" />
                        Others...</label>
                </div> */}
                <hr className="border-t border-gray-400 my-6" />

                <h3 className="text-[24px] font-semibold my-4 text-black">Price</h3>
                <div className="relative">
                    <div className="">
                        <label className="flex items-center mt-2">
                            <input type="radio"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, maxPrice: '60', minPrice: '0' });
                                    }
                                }} checked={formData.minPrice === '0' && formData.maxPrice === '60'}
                                value={"60"}
                                name="maxPrice"
                                className="mr-2" />
                            $0 - $60
                        </label>
                        <label className="flex items-center mt-2">
                            <input type="radio"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, maxPrice: '120', minPrice: '100' });
                                    }
                                }} checked={formData.minPrice === '100' && formData.maxPrice === '120'}
                                value={"120"}

                                name="maxPrice"
                                className="mr-2" />
                            $100 - $120
                        </label>
                        <label className="flex items-center mt-2">
                            <input type="radio"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, maxPrice: '200', minPrice: '150' });
                                    }
                                }}
                                checked={formData.minPrice === '150' && formData.maxPrice === '200'}
                                value={"200"}

                                name="maxPrice"
                                className="mr-2" />
                            $150 - $200
                        </label>
                        <label className="flex items-center mt-2">
                            <input type="radio"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, maxPrice: '350', minPrice: '200' });
                                    }
                                }} checked={formData.minPrice === '200' && formData.maxPrice === '350'}
                                value={"350"}

                                name="maxPrice"
                                className="mr-2" />
                            $200 - $350
                        </label>
                        <label className="flex items-center mt-2">
                            <input type="radio"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, maxPrice: '500', minPrice: '300' });
                                    }
                                }} checked={formData.minPrice === '300' && formData.maxPrice === '500'}
                                value={"500"}

                                name="maxPrice"
                                className="mr-2" />
                            $300 - $500
                        </label>
                        <div className="flex gap-6 items-center mt-3">
                            <div>
                                <input
                                    type="text"
                                    onChange={(e) => { handleChange(e); }}
                                    value={formData.minPrice}
                                    name="minPrice"
                                    className="w-14 h-10 rounded-md border pl-3"
                                    placeholder="0"
                                />
                            </div>
                            <p>-</p>
                            <div>
                                <input
                                    onChange={(e) => { handleChange(e); }}
                                    value={formData.maxPrice}
                                    name="maxPrice"
                                    type="text"
                                    className="w-14 h-10 rounded-md border pl-3"
                                    placeholder="$555"
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="border-t border-gray-400 my-6" />
                </div>

                {/* Color Selection */}
                <h3 className="text-[24px] font-semibold my-4 text-black">Color</h3>
                <div className="flex flex-col gap-4">
                    <div className="flex gap-3 items-center">
                        <p className="h-7 w-7 rounded-full bg-[#D9D9D9]"></p>
                        <label className="flex items-center mt-2">
                            <input type="checkbox"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, color: "gray" });
                                    }
                                }} checked={formData.color === "gray"}
                                value={"350"}

                                name="maxPrice"
                                className="mr-2" />
                            Gray
                        </label>
                    </div>
                    <div className="flex gap-3 items-center">
                        <p className="h-7 w-7 rounded-full bg-[#00ADDF]"></p>
                        <label className="flex items-center mt-2">
                            <input type="checkbox"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, color: "blue" });
                                    }
                                }} checked={formData.color === "blue"}
                                value={"350"}

                                name="maxPrice"
                                className="mr-2" />
                            Blue
                        </label>                    </div>
                    <div className="flex gap-3 items-center">
                        <p className="h-7 w-7 rounded-full bg-[#FF87C5]"></p>
                        <label className="flex items-center mt-2">
                            <input type="checkbox"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, color: "pink" });
                                    }
                                }} checked={formData.color === "pink"}
                                value={"350"}

                                name="maxPrice"
                                className="mr-2" />
                            Pink
                        </label>                    </div>
                    <div className="flex gap-3 items-center">
                        <p className="h-7 w-7 rounded-full bg-[#F28500]"></p>
                        <label className="flex items-center mt-2">
                            <input type="checkbox"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, color: "tangerine" });
                                    }
                                }} checked={formData.color === "tangerine"}
                                value={"350"}

                                name="maxPrice"
                                className="mr-2" />
                            Tangerine
                        </label>                    </div>
                    <div className="flex gap-3 items-center">
                        <p className="h-7 w-7 rounded-full bg-[#E4A502]"></p>
                        <label className="flex items-center mt-2">
                            <input type="checkbox"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, color: "yellow" });
                                    }
                                }} checked={formData.color === "yellow"}
                                value={"350"}

                                name="maxPrice"
                                className="mr-2" />
                            Yellow
                        </label>                         </div>
                    <div className="flex gap-3 items-center">
                        <p className="h-7 w-7 rounded-full bg-[#A0CEF8]"></p>
                        <label className="flex items-center mt-2">
                            <input type="checkbox"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, color: "Light Blue" });
                                    }
                                }} checked={formData.color === "Light Blue"}
                                value={"350"}

                                name="maxPrice"
                                className="mr-2" />
                            Light Blue
                        </label>                         </div>
                    <div className="flex gap-3 items-center">
                        <p className="h-7 w-7 rounded-full bg-[#F56F45]"></p>
                        <label className="flex items-center mt-2">
                            <input type="checkbox"
                                onChange={(e) => {
                                    handleChange(e);
                                    if (e.target.checked) {
                                        // Set formData.category to 'abduction' when checked
                                        setFormData({ ...formData, color: "red" });
                                    }
                                }} checked={formData.color === "red"}
                                value={"350"}

                                name="maxPrice"
                                className="mr-2" />
                            Red
                        </label>                         </div>
                    {/* <div className="flex gap-3 items-center">
                        <p>Others...</p>
                    </div> */}
                </div>
                <hr className="border-t border-gray-400 my-6" />
                {/* Color checkboxes here */}

                {/* Rating */}
                {/* <h3 className="text-[24px] font-semibold my-4 text-black">Rating</h3>
                <div className="">
                    <label className="flex items-center mt-2">
                        <input type="radio" className="mr-2" />5 Star
                    </label>
                    <label className="flex items-center mt-2">
                        <input type="radio" className="mr-2" />4 Star
                    </label>
                    <label className="flex items-center mt-2">
                        <input type="radio" className="mr-2" />3 Star
                    </label>
                    <label className="flex items-center mt-2">
                        <input type="radio" className="mr-2" />2 Star
                    </label>
                    <label className="flex items-center mt-2">
                        <input type="radio" className="mr-2" />1 Star
                    </label>
                </div> */}
            </div>
        </div>
    );
};

export default FilterSidebar;
