import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useEffect, useState } from 'react';

const ListingModal = ({ isOpen, onClose }) => {
    const modalRef = useRef(null);

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);
    const [selectedCategory, setSelectedCategory] = useState('afo');
    const [selectedSize, setSelectedSize] = useState('');
    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setSelectedSize(''); // Reset the selected size when category changes
    };
    return (
        <div
            className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'
                }`}
        >
            <div ref={modalRef} className="bg-white w-[340px] md:w-[500px] md:h-[440px] py-10 px-8 justify-center items-center rounded-md shadow-md">
                <div className="flex flex-col  mb-3 w-full">
                    <div>
                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-black">Category*</span>
                            <select
                                name="category"
                                required
                                className="text-[#777777] block w-full -mb-4 xl:mb-0 mt-1 p-2 bg-[#B4C7ED0D] border-[#2668E826] border-2 rounded-md"
                                onChange={handleCategoryChange}
                                value={selectedCategory}
                            >

                                <option value="afo">AFO System</option>
                                <option value="abduction">Abduction Bar</option>
                            </select>
                        </label>
                    </div>
                    <div className='md:mt-0 mt-3'>
                        {selectedCategory === 'afo' && (
                            <label className="block mb-6">
                                <span className="text-[16px] font-[500] text-black">Size*</span>
                                <select
                                    name="size"
                                    required
                                    className="text-[#777777] block w-full -mb-4 xl:mb-0 mt-1 p-2 bg-[#B4C7ED0D] border-[#2668E826] border-2 rounded-md"
                                    onChange={(event) => setSelectedSize(event.target.value)}

                                >
                                    <option value="">0000</option>
                                    <option value="">000</option>
                                    <option value="">00</option>
                                    <option value="">0</option>
                                    <option value="">1</option>
                                    <option value="">2</option>
                                    <option value="">3</option>
                                    <option value="">4</option>
                                    <option value="">5</option>
                                    <option value="">6</option>
                                    <option value="">7</option>
                                    <option value="">8</option>
                                    <option value="">9</option>
                                    <option value="">10</option>
                                    <option value="">11</option>
                                    <option value="">12</option>

                                </select>
                            </label>
                        )}
                        {selectedCategory === 'abduction' && (
                            <label className="block mb-6">
                                <span className="text-[16px] font-[500] text-black">Size*</span>
                                <select
                                    name="size"
                                    required
                                    className="text-[#777777] block w-full -mb-4 xl:mb-0 mt-1 p-2 bg-[#B4C7ED0D] border-[#2668E826] border-2 rounded-md"
                                    onChange={(event) => setSelectedSize(event.target.value)}

                                >
                                    <option value="">Extra Short</option>
                                    <option value="">Short</option>
                                    <option value="">Long</option>
                                </select>
                            </label>
                        )}
                    </div>
                    {selectedCategory === 'abduction' && (
                        <div>
                            <label className="block mb-6">
                                <span className="text-[16px] font-[500] text-[#000000]">Price*</span>
                                <input
                                    type="number"
                                    name="name"
                                    className="block w-full mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                    placeholder="$878"
                                />
                            </label>
                        </div>
                    )}
                </div>
                <button
                            className="mt-4 w-full bg-primary-pink-color text-white py-2 px-4 rounded"
                            onClick={onClose}
                        >
                            Submit
                        </button>
            </div>
        </div>
    );
};

export default ListingModal;
