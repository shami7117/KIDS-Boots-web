import React, { useState } from 'react';
import { BsBoxFill } from 'react-icons/bs';
import { IoBagAdd } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import AddedProducts from '../userdashboard/AddedProducts';
import SoldItems from '../userdashboard/SoldItems';
import Orders from "../userdashboard/Orders.js"
import ProfilePage from '../userdashboard/ProfilePage';
import { auth, db } from "../../../Firebase/firebase.js";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { useRouter } from "next/router.js";
import SellerApi from '@/lib/sellers';
import UserApi from '@/lib/buyer';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";



const Sidebar = () => {
    const [activeItem, setActiveItem] = useState("window1");

    const handleItemClick = (index) => {
        setActiveItem(index === activeItem ? null : index);
    };


    let userId

    try {
        const user = auth.currentUser;
        userId = user.uid
    } catch (error) {
        console.log(error)
    }



    const { data: SellerData, isLoading, isError } = useQuery(
        ['Sellers'],
        async () => {

            const response = await SellerApi.getUserByUserId(userId);
            return response;// Assuming your API returns data property

        }
    );
    const { data: buyerData, isLoading: buyerLoading, isError: buyerError } = useQuery(
        ['Buyers'],
        async () => {

            const response = await UserApi.getUserByUserId(userId);
            return response;// Assuming your API returns data property

        }
    );
    console.log("SELLER", SellerData)
    console.log("BUYER", buyerData)


    return (
        <div className='hidden md:flex w-ful gap-3 md:gap-10'>
            <div className="bg-[#1A9CDA0D] h-auto w-[90px] md:w-1/4 py-8 px-3 rounded-md text-black">
                <h2 className="text-2xl font-semibold mb-6 pl-3 md:flex hidden">User Dashboard</h2>
                <div className="flex justify-center mx-3">
                    <ul className="flex flex-col">
                        {
                            SellerData !== null && <button
                                className={`flex px-7 text-[18px] font-[500]  gap-4 rounded-md h-12 py-3 space-x-2 my-2 ${activeItem === "window1" ? 'activeBar' : ''}`}
                                onClick={() => setActiveItem("window1")}
                            >
                                <IoBagAdd size={25} className='' />
                                <span className='md:flex hidden'>
                                    Added Products
                                </span>
                            </button>
                        }
                        {
                            SellerData !== null && <button
                                className={`flex text-[18px] font-[500] gap-4 px-7 rounded-md h-12 py-2 space-x-2 my-2 ${activeItem === "window2" ? 'activeBar' : ''}`}
                                onClick={() => setActiveItem("window2")}
                            >
                                <BsBoxFill size={25} />
                                <span className='md:flex hidden'>PromoCode</span>
                            </button>
                        }

                        <button
                            className={`flex text-[18px] font-[500]   gap-4 px-7 rounded-md h-12 py-2 space-x-2 my-2 ${activeItem === "window4" ? 'activeBar' : ''}`}
                            onClick={() => setActiveItem("window4")}
                        >
                            <FaUser size={25} />
                            <span className='md:flex hidden'>Orders</span>
                        </button>
                        <button
                            className={`flex text-[18px] font-[500]   gap-4 px-7 rounded-md h-12 py-2 space-x-2 my-2 ${activeItem === "window3" ? 'activeBar' : ''}`}
                            onClick={() => setActiveItem("window3")}
                        >
                            <BsBoxFill size={25} />
                            <span className='md:flex hidden'>Profile Page</span>
                        </button>
                    </ul>
                </div>
            </div>
            <div className='md:w-full'>
                {activeItem === "window1" && SellerData !== null && <AddedProducts />}
                {activeItem === "window2" && SellerData !== null && <SoldItems />}
                {activeItem === "window3" && <ProfilePage />}
                {activeItem === "window4" && <Orders />}
            </div>
        </div>
    );
}

export default Sidebar;
