import Link from 'next/link'
import React from 'react'
import { useState } from 'react';
import * as Yup from 'yup';
import {
    collection,
    addDoc, doc, getDoc, setDoc,
} from "firebase/firestore";
import { auth, db } from "../../../Firebase/firebase.js";
import { createUserWithEmailAndPassword, FirebaseAuthException } from "firebase/auth"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router.js';
import { InfinitySpin } from 'react-loader-spinner'
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';


const SellerReg = () => {
    const router = useRouter();

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isRegister, setRegister] = useState(false);


    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        address: '',
        shopAddress: '',
        phone: '',
        shop: '',
        password1: '',
        password2: '',
        register: 'Company',
        country: '',
    });

    const validationSchema = Yup.object().shape({
        fname: Yup.string()
            .required('First Name is required')
            .test('not-email', 'First Name cannot be an email', value => {
                // Check if the value does not look like an email address
                return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            })
            .test('not-number', 'First Name cannot be a number', value => {
                // Check if the value is not a number
                return isNaN(Number(value));
            }),
        lname: Yup.string()
            .required('Last Name is required')
            .test('not-email', 'Last Name cannot be an email', value => {
                // Check if the value does not look like an email address
                return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            })
            .test('not-number', 'Last Name cannot be a number', value => {
                // Check if the value is not a number
                return isNaN(Number(value));
            }),
        email: Yup.string().email('Invalid email').required('Email is required'),
        register: Yup.string()
            .required('Please select a Category')
            .test('not-select-category', 'Please select a valid Category', value => {
                return value !== 'Select Category';
            }),
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
        shop: Yup.string()
            .required('Shop Name is required')
            .test('not-a-number', 'Shop name cannot be a number', value => {
                if (!value) return true; // Allow empty values (already handled by 'required')
                return isNaN(Number(value));
            }),
        password1: Yup.string()
            .required('Password is required')
            .min(6, 'Password should be at least 6 characters'),
        password2: Yup.string()
            .required('Password confirmation is required')
            .oneOf([Yup.ref('password1'), null], 'Passwords must match'),
        country: Yup.string().required('Please select a country').test('not-select-category', 'Please select a Valid Country', value => {
            return value !== 'Select Country';
        }),
        address: Yup.string().required('Address is required'),
        shopAddress: Yup.string().required('Shop Address is required'),

    });

    const shopValidationSchema = Yup.object().shape({
        fname: Yup.string()
            .required('First Name is required')
            .test('not-email', 'First Name cannot be an email', value => {
                // Check if the value does not look like an email address
                return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            }),
        lname: Yup.string()
            .required('Last Name is required')
            .test('not-email', 'Last Name cannot be an email', value => {
                // Check if the value does not look like an email address
                return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            }),
        email: Yup.string().email('Invalid email').required('Email is required'),
        register: Yup.string()
            .required('Please select a Category')
            .test('not-select-category', 'Please select a valid Category', value => {
                return value !== 'Select Category';
            }),
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
        password1: Yup.string()
            .required('Password is required')
            .min(6, 'Password should be at least 6 characters'),
        password2: Yup.string()
            .required('Password confirmation is required')
            .oneOf([Yup.ref('password1'), null], 'Passwords must match'),
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
        if (formData.register === 'Company') {
            setRegister(true)
        }
        else {
            setRegister(false)
        }
        console.log(isRegister, formData.register)

        try {
            if (formData.register === 'Company') {
                await validationSchema.validate(formData, { abortEarly: false });
                console.log('Form data is valid:', formData);
                setLoading(true);
            }
            else {
                await shopValidationSchema.validate(formData, { abortEarly: false });
                console.log('Form data is valid:', formData);
                setLoading(true);
            }



            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password2);
            const user = userCredential.user;
            console.log("userID", user.uid)
            const collectionRef = collection(db, "Sellers");
            const docRef = doc(collectionRef, user.uid);

            const values = {
                fName: formData.fname,
                email: formData.email,
                lName: formData.lname,
                shop: formData.shop,
                country: formData.country,
                phone: formData.phone,
                register: formData.register,
                address: formData.address
            };
            await setDoc(docRef, values, { merge: true });

            await signInWithEmailAndPassword(auth, formData.email, formData.password2);




            NotificationManager.success("Successfully Registered");




            router.push('/product-upload');

            setLoading(false);



        } catch (error) {

            if (error instanceof Yup.ValidationError) {
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
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


    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const togglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };




    return (
        <div className="py-10 md:w-[900px] md:mx-auto md:px-10 px-5 flex flex-col justify-center mt-6 xl:mt-0 bg-white shadow-md ">
            <NotificationContainer />
            <form onSubmit={(e) => { handleSubmit(e) }}>
                <h1 className="text-2xl font-semibold">Seller Information</h1>
                <p className="text-[16px] font-[400] text-[#777777] mb-8">
                    {" "}
                    Fill the form below or write us .We will help you as soon as possible.
                </p>
                <div className="mt-4 gap-6 xl:flex xl:justify-between">
                    <div>
                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-[#000000]">First Name*</span>
                            <input
                                type="text"
                                name="fname"
                                value={formData.fname}
                                onChange={handleChange}


                                className="
            block
            xl:w-96
                w-72
            mt-1
            -mb-4
            xl:mb-0
            rounded-md

             py-2 px-3 bg-[#B4C7ED0D] border-[#2668E826]  border-2
          "
                                placeholder="James"
                            />
                            {errors.fname && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.fname}</div>}

                        </label>
                    </div>
                    <div className="">
                        <label className="block mb-3">
                            <span className="text-[16px] font-[500] text-[black]">Last Name*</span>
                            <input
                                type="text"

                                value={formData.lname}
                                onChange={handleChange}
                                name="lname"
                                className="
            block
            xl:w-96
            w-72
            mt-1
            -mb-4
            xl:mb-0
             
            rounded-md

             py-2 px-3 bg-[#B4C7ED0D] border-[#2668E826]  border-2
          "
                                placeholder="James"
                            />
                            {errors.lname && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.lname}</div>}
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block md:mt-0 mt-6 mb-6">
                        <span className="text-[16px] font-[500] text-[black]">Email Address*</span>
                        <input
                            value={formData.email}
                            onChange={handleChange}
                            type="text"

                            name="email"
                            className="
            block
            xl:w-full
            w-72
            mt-1
            -mb-4
            xl:mb-0
             
            rounded-md

             py-2 px-3 bg-[#B4C7ED0D] border-[#2668E826]  border-2
          "
                            placeholder="James68@gmail.com"
                        />
                        {errors.email && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.email}</div>}
                    </label>
                </div>

                <div>
                    <label className="block mb-6">
                        <span className="text-[16px] font-[500] text-[black]">Phone Number*</span>
                        <input
                            value={formData.phone}
                            onChange={handleChange}
                            type="text"
                            name="phone"

                            className="
            block
            xl:w-full
            w-72
            mt-1
            -mb-4
            xl:mb-0
             
            rounded-md

             py-2 px-3 bg-[#B4C7ED0D] border-[#2668E826]  border-2
          "
                            placeholder="+91 6787887 888"
                        />
                        {errors.phone && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.phone}</div>}
                    </label>
                </div>

                {/* =================== */}

                <div className='xl:mt-3 xl:flex xl:justify-between'>
                    <div>
                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-[black]">Country*</span>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}

                                className="
            block
            xl:w-96
                w-72
            -mb-4
            xl:mb-0
            mt-1
             py-2 px-3  bg-[#B4C7ED0D] border-[#2668E826] border-2
            rounded-md"
                            >
                                <option  >Select Country</option>

                                <option value="USA">USA</option>
                                <option value="INDIA">INDIA</option>
                                <option value="UK">UK</option>
                                <option value="CANADA">CANADA</option>
                            </select>
                            {errors.country && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.country}</div>}
                        </label>
                    </div>

                    {/* =============================== */}
                    <div>
                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-[black]">Register as*</span>
                            <select
                                value={formData.register}
                                onChange={handleChange}
                                name="register"
                                placeholder='Select Category'
                                className="
            block
            xl:w-96
                w-72
            -mb-4
            xl:mb-0
            mt-1
             py-2 px-3  bg-[#B4C7ED0D] border-[#2668E826] border-2
            rounded-md"
                            >

                                <option value="Company">Company</option>
                                <option value="Individual">Individual</option>

                            </select>
                            {errors.register && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.register}</div>}
                        </label>
                    </div>

                </div>

                <div>
                    <label className="block mb-6">
                        <span className="text-[16px] font-[500] text-black">Address*</span>
                        <input
                            value={formData.address}
                            onChange={handleChange}
                            type="text"
                            name="address"
                            className="block xl:w-full pb-10 w-72 mt-1 mb-6 xl:mb-0 rounded-md py-2 px-3 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                            placeholder="Write your complete address here"
                        />
                        {errors.address && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.address}</div>}
                    </label>
                </div>
                {formData.register === 'Company' && <> <h1 className="text-2xl font-semibold">Shop Information</h1>
                    <p className="text-[16px] font-[400] text-[#777777] mb-8">Fill the form below or write us .We will help you as soon as possible.</p>
                    <div>
                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-[black]">Shop Name*</span>
                            <input
                                value={formData.shop}
                                onChange={handleChange}
                                type="text"
                                name="shop"

                                className="
            block
            xl:w-full
            w-72
            mt-1
            -mb-4
            xl:mb-0
             
            rounded-md

             py-2 px-3 bg-[#B4C7ED0D] border-[#2668E826]  border-2
          "
                                placeholder="James Shop Online"
                            />
                            {errors.shop && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.shop}</div>}
                        </label>
                    </div>
                    <div>
                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-black">Address*</span>
                            <input

                                value={formData.shopAddress}
                                onChange={handleChange}
                                type="text"
                                name="shopAddress"
                                className="block xl:w-full pb-10 w-72 mt-1 mb-6 xl:mb-0 rounded-md py-2 px-3 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                placeholder="Write your complete address here"
                            />
                            {errors.shopAddress && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.shopAddress}</div>}
                        </label>
                    </div></>}

                <div className="xl:mt-3 xl:flex xl:justify-between">
                    <div>
                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-[black]">Password*</span>
                            <div className='block flex  xl:w-96 w-72 mt-1 mb-6 xl:mb-0 rounded-md py-2 px-3 bg-[#B4C7ED0D] border-[#2668E826]  border-2'>
                                <input
                                    value={formData.password1}
                                    onChange={handleChange}
                                    type={showPassword ? 'text' : 'password'}
                                    name="password1"
                                    className='w-full h-full  outline-none'
                                    placeholder="Password"
                                />
                                <span
                                    className={`password-toggle cursor-pointer ${showPassword ? 'show' : 'hide'}`}
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </span>
                            </div>

                            {errors.password1 && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[#000000] mb-1 mt-1  mt-0">{errors.password1}</div>}
                        </label>
                    </div>
                    <div>
                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-[#000000]">Re-Enter password*</span>
                            <div className='block flex  xl:w-96 w-72 mt-1 mb-6 xl:mb-0 rounded-md py-2 px-3 bg-[#B4C7ED0D] border-[#2668E826]  border-2'>
                                <input
                                    value={formData.password2}
                                    onChange={handleChange}
                                    type={showPassword1 ? 'text' : 'password'}
                                    name="password2"
                                    className='w-full h-full outline-none'

                                    placeholder="Re-Enter Password"
                                />
                                <span
                                    className={`password-toggle cursor-pointer ${showPassword1 ? 'show' : 'hide'}`}
                                    onClick={togglePasswordVisibility1}
                                >
                                    {showPassword1 ? 'Hide' : 'Show'}
                                </span>
                            </div>
                            {errors.password2 && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[#000000] mb-1 mt-1  mt-0">{errors.password2}</div>}
                        </label>
                    </div>
                </div>
                <div className='mt-5 flex justify-center items-center'>
                    {
                        loading ? <InfinitySpin
                            visible={true}
                            width="200"
                            ariaLabel="InfinitySpin -loading"
                            wrapperStyle={{}}
                            wrapperClass="InfinitySpin -wrapper"
                            color="#A51F6C"

                            // colors={['#F4442E', '#F4442E', '#F4442E', '#F4442E', '#F4442E']}
                            backgroundColor="#F4442E"
                        /> : <button type='submit' className='w-[250px] md:w-[302px] h-[46px] flex justify-center mx-auto items-center text-white bg-primary-pink-color rounded-[5px]'>
                            Create Seller Account
                        </button>
                    }

                </div>
            </form>

        </div>
    )
}

export default SellerReg