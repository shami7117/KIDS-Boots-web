import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { auth, db } from "../../../Firebase/firebase.js";
import {
    notification
} from "antd";
import {
    collection,
    addDoc, doc, getDoc, setDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { InfinitySpin } from 'react-loader-spinner'


const ListingModal = ({ isOpen, onClose, triggerFunction }) => {
    const modalRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    let userId
    try {
        const user = auth.currentUser;
        userId = user.uid;

    } catch (error) {
        console.log(error)
    }

    const [formData, setFormData] = useState({
        category: 'afo',
        size: '',
        priceFrom: '',
        priceTo: '',

    });


    const validationSchema = Yup.object().shape({

        size: Yup.string().required('Please select a Size').test('not-select-category', 'Please select a Valid Size', value => {
            return value !== 'Select Size';
        }),



    });

    const abductionValidationSchema = Yup.object().shape({

        priceFrom: Yup.string()
            .required('Price range is required')
            .test('valid-phone', 'Invalid Price', value => {
                if (!value) return true; // Allow empty value

                // Check if value is a valid number
                return !isNaN(value);
            }),
        priceTo: Yup.string()
            .required('Price range is required')
            .test('valid-phone', 'Invalid Price', value => {
                if (!value) return true; // Allow empty value

                // Check if value is a valid number
                return !isNaN(value);
            }),


        size: Yup.string().required('Please select a Size').test('not-select-category', 'Please select a Valid Size', value => {
            return value !== 'Select Size';
        }),




    });

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    const handleChange = (e) => {
        const { name, type, checked } = e.target;
        let newValue;

        if (type === 'radio') {
            newValue = e.target.value;
        } else if (type === 'checkbox') {
            newValue = checked;
        } else if (type === 'file') {
            newValue = e.target.files[0];
            formData.file = newValue;
            // Capture the selected file
        } else {
            newValue = e.target.value;
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            if (formData.category === "afo") {
                await validationSchema.validate(formData, { abortEarly: false });
                console.log('Form data is valid:', formData);
                setErrors("");

            }
            else {
                await abductionValidationSchema.validate(formData, { abortEarly: false });
                console.log('Form data is valid:', formData);
                setErrors("");

            }




            setErrors("");
            let docRef;
            try {
                const collectionRef = collection(db, "Updates");
                docRef = doc(collectionRef, uuidv4());
            } catch (error) {
                console.log(error)
            }



            await setDoc(docRef, formData, { merge: true });
            notification.open({
                type: "success",
                message: 'Submitted successfully!',
                placement: "top",
            });
            onClose();

            triggerFunction();
            setFormData({
                category: 'afo',
                size: '',
                priceFrom: '',
                priceTo: '',
            })

            setLoading(false)


        } catch (error) {
            console.log(error);

            if (error instanceof Yup.ValidationError) {
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
                setLoading(false)
            }
            else {
                // createNotification('error', "Email already user!")
                // NotificationManager.error(error);
                if (error === "FirebaseError: Firebase: Error (auth/email-already-in-use).") {
                    notification.open({
                        type: "error",
                        message: 'Email already used!',
                        placement: "top",
                    });

                } else {
                    notification.open({
                        type: "error",
                        message: error,
                        placement: "top",
                    });

                }
                console.log("CATCH ERROR", error)
                setLoading(false)



            }

        }
    }


    return (
        <div
            className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'
                }`}
        >
            <form onSubmit={handleSubmit} ref={modalRef} className="bg-white w-[340px] md:w-[500px]   py-10 px-8 justify-center items-center rounded-md shadow-md">
                <div className="flex flex-col  mb-3 w-full">
                    <div>
                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-black">Category*</span>
                            <select
                                name="category"
                                required
                                className="text-[#777777] block w-full -mb-4 xl:mb-0 mt-1 p-2 bg-[#B4C7ED0D] border-[#2668E826] border-2 rounded-md"
                                onChange={(e) => { handleCategoryChange(e); handleChange(e); }}
                                value={formData.category}
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

                                    className="text-[#777777] block w-full -mb-4 xl:mb-0 mt-1 p-2 bg-[#B4C7ED0D] border-[#2668E826] border-2 rounded-md"
                                    onChange={(e) => { handleChange(e); }}
                                    value={formData.size}
                                >
                                    <option value="">Select Size</option>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>

                                </select>
                                {errors.size && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.size}</div>}

                            </label>
                        )}
                        {selectedCategory === 'abduction' && (
                            <label className="block mb-6">
                                <span className="text-[16px] font-[500] text-black">Size*</span>
                                <select
                                    name="size"
                                    required
                                    className="text-[#777777] block w-full -mb-4 xl:mb-0 mt-1 p-2 bg-[#B4C7ED0D] border-[#2668E826] border-2 rounded-md"
                                    onChange={(e) => { handleChange(e); }}
                                    value={formData.size}
                                >
                                    <option value="">Select Size</option>
                                    <option value="Extra Short">Extra Short</option>
                                    <option value="Short">Short</option>
                                    <option value="Long">Long</option>
                                </select>
                                {errors.size && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.size}</div>}

                            </label>
                        )}
                    </div>
                    {selectedCategory === 'abduction' && (
                        <div>
                            <span className="text-[16px] font-[500] text-[#000000]">Price Range</span>

                            <label className="block mb-6">
                                <span className="text-[16px] font-[500] text-[#000000]"> From*</span>
                                <input
                                    type="number"
                                    name="priceFrom"
                                    className="block w-full mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                    placeholder="$878"
                                    onChange={(e) => { handleChange(e); }}
                                    value={formData.priceFrom}
                                />
                                {errors.priceFrom && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.priceFrom}</div>}

                            </label>
                            <label className="block mb-6">
                                <span className="text-[16px] font-[500] text-[#000000]">To*</span>
                                <input
                                    type="number"
                                    name="priceTo"
                                    className="block w-full mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                    placeholder="$878"
                                    onChange={(e) => { handleChange(e); }}
                                    value={formData.priceTo}
                                />
                                {errors.priceTo && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.priceTo}</div>}
                            </label>
                        </div>
                    )}
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
                        /> : <button type='submit' className='w-full h-[46px] flex justify-center mx-auto items-center text-white bg-primary-pink-color rounded-[5px]'>
                            Submit
                        </button>
                    }
                </div>
            </form>
        </div>
    );
};

export default ListingModal;
