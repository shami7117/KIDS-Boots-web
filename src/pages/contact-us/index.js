import React from 'react';
import Wrapper from '../../components/shared/Wrapper';
import Layout from '../../components/shared/layout/Layout';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { useState } from 'react'
import Link from 'next/link';
import * as Yup from 'yup';
import { InfinitySpin } from 'react-loader-spinner'
import { v4 as uuidv4 } from "uuid";

import {
    collection,
    addDoc, doc, getDoc, setDoc,
} from "firebase/firestore";
import { auth, db } from "../../../Firebase/firebase.js";
import { notification } from 'antd';
import { useRouter } from 'next/router';

const ContactUs = () => {
    const router = useRouter()
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: '',
    });


    const validationSchema = Yup.object().shape({
        fullName: Yup.string()
            .required('First Name is required')
            .test('not-email', 'Name cannot be an email', value => {
                // Check if the value does not look like an email address
                return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            })
            .test('not-number', 'Name cannot be a number', value => {
                // Check if the value is not a number
                return isNaN(Number(value));
            }),
        email: Yup.string().email('Invalid email').required('Email is required'),
        subject: Yup.string()
            .required('Subject is required')
            .test('not-a-number', 'Subject cannot be a number', value => {
                if (!value) return true; // Allow empty values (already handled by 'required')
                return isNaN(Number(value));
            }),
        message: Yup.string().required('Message is required'),

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            console.log('Form data is valid:', formData);
            setLoading(true);

            const collectionRef = collection(db, "ContactUs");
            const docRef = doc(collectionRef, uuidv4());

            const values = {
                name: formData.fullName,
                email: formData.email,

                subject: formData.subject,

                message: formData.message
            };
            await setDoc(docRef, values, { merge: true });



            notification.open({
                type: "success",
                message: "Successfully submitted!",
                placement: "top",
            });


            router.push('/');

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


                notification.open({
                    type: "error",
                    message: modifiedText,
                    placement: "top",
                });




                console.log(error)


                setLoading(false);
            }





        }



    };

    return (
        <Wrapper>

            <div className='pt-4'>
                <Layout>
                    <p className='text-[14px] md:text-[18px] '> <Link href={'/'}>
                        Home
                    </Link>  {'>'}
                        <span className='font-[600] '>  Contact Us  </span>
                    </p>
                </Layout>
            </div>

            <div className='flex flex-col-reverse md:flex-row py-[4rem]'>
                <div className='p-4'>
                    <h1 className='text-[32px] font-semibold'>Contact Us</h1>
                    <p className="mb-2">Fill the form below or write us .We will help you as soon as possible.</p>
                    <div className='flex flex-col md:flex-row mt-7'>
                        <div className='mb-4  md:mr-5 bg-[#FAEDF1] flex flex-col items-center px-10 py-5'>

                            <div className='border border-[#1A9CDA] rounded-full p-3'>
                                <FiPhone size={32} color='#1A9CDA' />
                            </div>
                            <h1 className='text-[24px] font-[500]'>Phone</h1>
                            <p className='px-4 pt-4'>+1 (267) 805 8550</p>

                        </div>
                        <div className='mb-4 bg-[#0076AE1F] flex flex-col items-center px-10 py-5'>
                            <div className='border border-[#1A9CDA] rounded-full p-3'>
                                <FiMail size={32} color='#1A9CDA' />
                            </div>
                            <h1 className='text-[24px] font-[500]'>Email</h1>
                            {/* <p>support@clubfoot.online</p> */}
                            <p>contact@clubfoot.online</p>
                            {/* <p>info@clubfoot.online</p>
                            <p>sales@clubfoot.online</p> */}

                        </div>
                    </div>

                    <div className='bg-[#46CC6B14] py-7 px-6'>
                        <div className='mb-5 mx-4'>
                            <div className="flex items-start">
                                <div className='border border-[#1A9CDA]   rounded-full p-3'>
                                    <FiMapPin size={32} color='#1A9CDA' />
                                </div>
                                <div className="ml-3">
                                    <h1 className='text-[24px] font-[500]'>Address</h1>
                                    <p className='text-[#777777] font-[16px]'>
                                        8 The Green #4000 Dover,
                                    </p>
                                    <p className='text-[#777777]'>DE 19901, United States</p>
                                </div>
                            </div>
                        </div>
                        {/* Google Map Snippet */}
                        <iframe
                            width='100%'
                            height='160'
                            frameBorder='0'
                            scrolling='no'
                            marginHeight='0'
                            marginWidth='0'
                            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2101841401635!2d-73.98631788492222!3d40.75889637932875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x7e2651687b1e66e1!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1630186065097!5m2!1sen!2sus'
                        ></iframe>
                    </div>
                </div>
                <div className='flex-grow py-[1.8rem] bg-[#FAFAFA] px-[2rem]'>
                    <h1 className='text-[32px] text-center font-[600] my-5'>Get in Touch</h1>
                    <form onSubmit={(e) => { handleSubmit(e) }} >

                        <div className='mb-3'>
                            <label className='block text-[#000000] font-[16px] mb-1' htmlFor='fullName'>
                                Full Name
                            </label>
                            <input
                                type='text'
                                id='fullName'
                                name='fullName'
                                className='w-full border border-[#D1D5DB] rounded-md p-2'
                                onChange={handleChange}
                                value={formData.fullName}
                                placeholder="James Williams"
                            />
                            {errors.fullName && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[#000000] mb-1 mt-1  mt-0">{errors.fullName}</div>}
                        </div>
                        <div className='mb-3'>
                            <label className='block text-[#000000] font-[16px] mb-1' htmlFor='email'>
                                Email Address
                            </label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                className='w-full border border-[#D1D5DB] rounded-md p-2'
                                onChange={handleChange}
                                value={formData.email}
                                placeholder="JamesWilliams@email.com"
                            />
                        </div>
                        {errors.email && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[#000000] mb-1 mt-1  mt-0">{errors.email}</div>}
                        <div className='mb-3'>
                            <label className='block text-[#000000] font-[16px] mb-1' htmlFor='subject'>
                                Subject
                            </label>
                            <input
                                type='text'
                                id='subject'
                                name='subject'
                                className='w-full border border-[#D1D5DB] rounded-md p-2'
                                onChange={handleChange}
                                value={formData.subject}
                                placeholder="Subject Here"
                            />
                            {errors.subject && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[#000000] mb-1 mt-1  mt-0">{errors.subject}</div>}

                        </div>
                        <div className='mb-4'>
                            <label className='block text-[#000000] font-[16px] mb-1' htmlFor='message'>
                                Message
                            </label>
                            <textarea
                                id='message'
                                name='message'
                                className='w-full border border-[#D1D5DB] rounded-md p-2 h-32'
                                onChange={handleChange}
                                value={formData.message}
                                placeholder="Type Message Here"
                                style={{ resize: "none" }}
                            ></textarea>
                            {errors.message && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[#000000] mb-1 mt-1  mt-0">{errors.message}</div>}
                        </div>
                        <div className='flex justify-center items-center'>
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
                                /> : <button
                                    type='submit'
                                    className='bg-[#A51F6C] text-white px-4 py-2 rounded-md hover:bg-[##A51F6C] w-full'

                                >
                                    Send Now
                                </button>
                            }
                        </div>

                    </form>
                </div>
            </div>
        </Wrapper>
    );
};

export default ContactUs;
