import Image from "next/image";
import PaypalModel from "./PaypalModel";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PayPalButton } from "react-paypal-button-v2";
import { useRouter } from "next/router";
import * as Yup from 'yup';
import {
    collection,
    addDoc, doc, getDoc, setDoc,
} from "firebase/firestore";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { auth, db } from "../../../Firebase/firebase.js";
import CommissionApi from "@/lib/commission";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ThreeDots } from 'react-loader-spinner'

const Cartcheckout = () => {


    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [CreateTime, setCreateTime] = useState('');
    const [PaymentSource, setPaymentSource] = useState('');
    const [CheckOrderId, setCheckOrderId] = useState(false);
    const { query } = router;
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        address: '',
        phone: '',
        shop: '',
        password1: '',
        password2: '',
        register: 'Company',
        country: '',
        region: ''
    });


    const paypalScript = () => {
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=AdOM2VEU6QamQhnfeJK0UTlajsCoAzNobIE-weZo0gx-R3Kbyo1UgXSC&currency=USD"
        script.type = "text/javascript";
        script.async = true;
        document.body.appendChild(script);
    }

    useEffect(() => {
        paypalScript();
    }, [])


    let userId
    try {

        const user = auth.currentUser;
        userId = user.uid
        console.log("USER ID ", userId);


    } catch (error) {
        console.log("USER ID ERROR", error);
    }
    let totalAmount
    const { data: CommissionData, isLoading, isError } = useQuery(
        ['Commission', userId],
        async () => {

            const response = await CommissionApi.getAllCommission();
            return response;// Assuming your API returns data property

        }
    );
    console.log("COMMISSION", CommissionData);


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



    const items = query.items;
    let data = items
    try {
        data = JSON.parse(items)
    } catch (error) {
        console.log(error)
    }
    console.log("ITEM", data)
    const amountString = query.amount;
    let amount = amountString
    try {
        amount = JSON.parse(amountString);
    } catch (error) {
        console.log(error)
    }





    const percentCommission = ((CommissionData && CommissionData[0]?.buyer / 100) * amount);
    totalAmount = percentCommission + amount + CommissionData && CommissionData[0]?.shipping;


    const validationSchema = Yup.object().shape({
        fname: Yup.string()
            .required('First Name is required')
            .test('not-email', 'First Name cannot be an email', value => {
                // Check if the value does not look like an email address
                return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            })
            .test('not-number', 'First Name cannot be a number', value => {
                // Check if the value is not a number only if it's not empty
                if (value) {
                    return isNaN(Number(value));
                }
                return true; // Allow empty values without triggering this test
            }),

        lname: Yup.string()
            .required('Last Name is required')
            .test('not-email', 'Last Name cannot be an email', value => {
                // Check if the value does not look like an email address
                return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            })
            .test('not-number', 'Last Name cannot be a number', value => {
                // Check if the value is not a number only if it's not empty
                if (value) {
                    return isNaN(Number(value));
                }
                return true; // Allow empty values without triggering this test
            }),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string()
            .required('Phone is required')
            .test('valid-phone', 'Invalid phone number', value => {
                if (!value) return true; // Allow empty value

                // Check if the value starts with '+'
                if (!value.startsWith('+')) {
                    return false;
                }

                // Check if the rest of the value is a valid number
                const numberPart = value.slice(1); // Remove the '+' symbol
                return !isNaN(numberPart);
            })
            .matches(/^\+\d{1,11}$/, 'Phone number should start with + and contain 1 to 11 digits')
            .max(13, 'Phone number should not be more than 13 digits'),
        region: Yup.string()
            .required('Region  is required')
            .test('not-a-number', 'Region cannot be a number', value => {
                if (!value) return true; // Allow empty values (already handled by 'required')
                return isNaN(Number(value));
            }),
        city: Yup.string()
            .required('City is required')
            .test('not-select-category', 'Please select a Valid City', value => {
                return value !== 'Select City';
            }),
        postCode: Yup.string()
            .required('Post Code is required')
            .test('valid-post-code', 'Invalid Post Code', value => {
                if (!value) return true; // Allow empty value

                // Check if value is a valid number
                return !isNaN(value);
            })
            .max(10, "Code can't exceed 10 digits"),
        country: Yup.string().required('Please select a country').test('not-select-category', 'Please select a Valid Country', value => {
            return value !== 'Select Country';
        }),
        address: Yup.string().required('Address is required'),

    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle radio buttons and checkbox
        const newValue = type === 'radio' ? value : type === 'checkbox' ? checked : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (orderId === "") {
                setCheckOrderId(true)
                await validationSchema.validate(formData, { abortEarly: false });
            }
            else {
                console.log("ORDER ID", orderId)
                await validationSchema.validate(formData, { abortEarly: false });
                const collectionRef = collection(db, "Orders");
                const docRef = doc(collectionRef, orderId);
                const orderData = CreateTime;
                const dateOnly = orderData.split("T")[0];

                const values = {
                    fName: formData.fname,
                    lName: formData.lname,
                    email: formData.email,
                    postCode: formData.postCode,
                    city: formData.city,
                    phone: formData.phone,
                    region: formData.region,
                    address: formData.address,
                    country: formData.country,
                    orderId: orderId,
                    orderDate: dateOnly,
                    payment: PaymentSource,
                    amount: amount,
                    commission: percentCommission,
                    buyerId: userId,
                    status: "New",
                    sellerIds: data?.map((item) => {
                        return item.sellerId !== undefined ? item.sellerId : '';
                    }),
                };

                console.log("VALUES OF ALL", values)
                await setDoc(docRef, values, { merge: true });

                NotificationManager.success("Your Order has been placed Successfully!");
                router.push('/');

                setLoading(false);

            }

        } catch (error) {

            if (error instanceof Yup.ValidationError) {
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                console.log("VALIDATION ERROR", newErrors)

                setErrors(newErrors);
                setLoading(false);

            }
            else {
                const message = error.message
                var modifiedText = message.replace("Firebase:", '');
                setErrors("");
                NotificationManager.error(modifiedText);
                console.log("FIREBASE ERROR", error)
                setLoading(false);
            }
        }
    };



    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <NotificationContainer />

            {/* parent  */}
            <form onSubmit={(e) => { handleSubmit(e) }} className="flex md:flex-row flex-col gap-10">
                {/* left  */}
                <div className="flex flex-col basis-[100%] md:basis-[60%] rounded-md border">
                    <div>
                        <div className="my-3 p-6">
                            <h1 className="text-2xl font-semibold pb-6">Billing Address</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p">
                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="text-[16px] font-medium text-black"
                                    >
                                        First Name*
                                    </label>
                                    <input
                                        type="text"
                                        id="fname"
                                        name="fname"
                                        value={formData.fname}
                                        onChange={handleChange}
                                        placeholder="James"

                                        className="w-full py-2 px-3 mt-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                                    />
                                    {errors.fname && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1   mt-0">{errors.fname}</div>}
                                </div>
                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className="text-[16px] font-medium text-black"
                                    >
                                        Last Name*
                                    </label>
                                    <input
                                        type="text"

                                        placeholder="Williams"
                                        id="lname"
                                        name="lname"
                                        value={formData.lname}
                                        onChange={handleChange}
                                        className="w-full py-2 px-3 mt-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                                    />
                                    {errors.lname && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1   mt-0">{errors.lname}</div>}
                                </div>
                            </div>
                            <div className="my-3">
                                <label
                                    htmlFor="country"
                                    className="text-[16px] font-medium text-black mb-3"
                                >
                                    Country/Region*
                                </label>
                                <input
                                    type="region"
                                    id="region"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    placeholder="New York"
                                    // value={formData.country}
                                    // onChange={handleChange}
                                    className="w-full mt-3 py-2 px-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                                />
                                {errors.region && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1   mt-0">{errors.region}</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 ">
                                <div>
                                    <label
                                        htmlFor="address"
                                        className="text-[16px] font-medium text-black"
                                    >
                                        Address*
                                    </label>
                                    <input
                                        placeholder="House number and street name"
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        // value={formData.address}
                                        // onChange={handleChange}
                                        className="w-full py-2 px-3 mt-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                                    />
                                    {errors.address && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1   mt-0">{errors.address}</div>}
                                </div>
                                <div className="mt-9">
                                    <select
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Appartment, suite, unit, etc"
                                        // value={formData.country}
                                        // onChange={handleChange}
                                        className="w-full py-[9px] px-3 border text-[#777777] border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                                    >
                                        <option value="" className="text-[#777777]">Select Country</option>
                                        <option value="New York">abc</option>
                                        {/* Add more country options as needed */}
                                    </select>
                                    {errors.country && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1  ">{errors.country}</div>}
                                </div>
                            </div>
                            <div className="mt-3">
                                <label
                                    htmlFor="address"
                                    className="text-[16px] font-medium text-black"
                                >
                                    Postal Code*
                                </label>
                                <input
                                    placeholder="75778"
                                    type="text"
                                    id="postCode"
                                    name="postCode"
                                    value={formData.postCode}
                                    onChange={handleChange}
                                    // value={formData.address}
                                    // onChange={handleChange}
                                    className="w-full py-2 px-3 mt-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                                />
                                {errors.postCode && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1   mt-0">{errors.postCode}</div>}
                            </div>
                            <div className="mt-3">
                                <label
                                    htmlFor="address"
                                    className="text-[16px]  font-medium text-black"
                                >
                                    Town/City*
                                </label>
                                <input
                                    type="text"
                                    placeholder="New York"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    // value={formData.address}
                                    // onChange={handleChange}
                                    className="w-full py-2 mt-3  px-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                                />
                                {errors.city && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1   mt-0">{errors.city}</div>}

                            </div>
                            <div>
                                <label
                                    htmlFor="address"
                                    className="text-[16px]  font-medium text-black my-3"
                                >
                                    Phone Number*
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 445567 889"
                                    // value={formData.address}
                                    // onChange={handleChange}
                                    className="w-full py-2 px-3 my-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                                />
                                {errors.phone && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1   mt-0">{errors.phone}</div>}
                            </div>
                            <label
                                htmlFor="address"
                                className="text-[16px] mt-3 font-medium text-black"
                            >
                                Email Address*
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="James67@gmail.com"
                                // value={formData.address}
                                // onChange={handleChange}
                                className="w-full py-2 px-3 mt-3 border border-[#06010130] rounded transition duration-300 focus:outline-none focus:border-blue-500 hover:border-blue-300"
                            />
                            {errors.email && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1   mt-0">{errors.email}</div>}

                        </div>
                    </div>
                </div>
                {/* right  */}
                <div className="flex flex-col basis-[100%] md:basis-[40%] gap-10">
                    <div className="rounded-md border">
                        <div className="flex flex-col p-6">

                            <p className="text-[24px] font-[600] mb-3">
                                Your Order
                            </p>
                            <div className="flex justify-between text-[#777777]  border-b mb-5">
                                <p >
                                    Product
                                </p>
                                <p className="mb-3">
                                    SubTotal
                                </p>

                            </div>

                            {
                                data?.map((item) => {
                                    return <div className="flex justify-between text-[#777777]  border-b mb-5">
                                        <p className="text-[16px] w-[265px]">
                                            <span className="uppercase">{item.item}</span>
                                            ({item.type})({item.color})
                                            <br />
                                            x{item.quantity}
                                        </p>
                                        <p className="mb-3 text-black font-semibold">
                                            ${item.price}

                                        </p>
                                    </div>
                                })
                            }<br />

                            <div className='flex justify-between'>
                                <p className='text-[#777777] text-[18px] font-[500]'>
                                    Subtotal
                                </p>
                                <p className='text-[18px] font-[500] text-left'>
                                    ${amount?.toFixed(2)}
                                </p>
                            </div>
                            <div className='flex justify-between'>
                                <p className='text-[#777777] text-[18px] font-[500]'>
                                    Shipping Fees
                                </p>
                                <p className='text-[18px] font-[500] text-left '>
                                    ${CommissionData[0]?.shipping}
                                </p>
                            </div>
                            <div className='flex justify-between'>
                                <p className='text-[#777777] text-[18px] font-[500]'>
                                    commission fees
                                </p>
                                <p className='text-[18px] font-[500] text-left'>
                                    ${percentCommission?.toFixed(2)}
                                </p>
                            </div>

                        </div>
                        <div className='flex justify-between py-6 bg-[#D9D9D961] rounded-b-md p-6'>
                            <p className='text-[#777777] text-[18px] font-[500]'>
                                Total
                            </p>
                            <p className='text-[18px] font-[500] text-left'>
                                ${totalAmount?.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <div className="flex flex-col p-6">
                            <p className="text-[24px] font-[600] mb-3">
                                Select Payment Method
                            </p>
                            <div className="border rounded-md mb-3 flex justify-between items-center p-3">
                                <div className="flex gap-3">
                                    <input onClick={handleModalOpen} type="radio" name="" id="" />
                                    <p>
                                        PayPal
                                    </p>
                                </div>
                                <div>
                                    <Image src='/images/paypal.png' alt="" width={1080} height={1080} className="max-w-[37px] max-h-[37px] " style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                </div>

                            </div>
                            {isModalOpen && <PayPalButton

                                amount={totalAmount}
                                // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                onSuccess={(details, data) => {
                                    console.log("details", details)
                                    console.log("data", data)
                                    setOrderId(data.orderID);
                                    setCreateTime(details.update_time);
                                    setPaymentSource(data.paymentSource);

                                    NotificationManager.success("Transact   ion Successful!");



                                    // OPTIONAL: Call your server to save the transaction
                                    // return fetch("/paypal-transaction-complete", {
                                    //     method: "post",
                                    //     body: JSON.stringify({
                                    //         orderID: data.orderID
                                    //     })
                                    // });
                                }}
                            />}
                            {CheckOrderId && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1   mt-0">Payment is Required</div>}
                        </div>
                    </div>
                    <div>
                        {/* <Link href={'/order-completion'}> */}
                        <button type="submit" className='bg-[#00ADDF] text-[16px] w-full h-[50px] text-white rounded-md'>
                            Confirm Order
                        </button>
                        {/* </Link> */}

                    </div>
                </div>
            </form>
        </div>
    );
};

export default Cartcheckout;
