import React from 'react'
import { useState } from 'react';
import * as Yup from 'yup';
import { v4 as uuidv4 } from "uuid";
import { InfinitySpin } from 'react-loader-spinner'
import { useRouter } from "next/router";
import { storage } from '../../../Firebase/firebase.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from "../../../Firebase/firebase.js";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import {
    collection,
    addDoc, doc, getDoc, setDoc,
} from "firebase/firestore";
const Storage = getStorage(storage);


const ProductUpload = () => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('afo');
    const [selectedSize, setSelectedSize] = useState('');
    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setSelectedSize(''); // Reset the selected size when category changes
    };

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    const [formData, setFormData] = useState({
        category: 'afo',
        size: '',
        brand: '',
        color: '',
        price: '',
        type: '',
        condition: '',
        box: '',
        side: '',
        description: '',
        file: null,
    });

    const validationSchema = Yup.object().shape({
        brand: Yup.string()
            .required('Brand Name is required')
            .test('not-a-number', 'Brand name cannot be a number', value => {
                if (!value) return true; // Allow empty values (already handled by 'required')
                return isNaN(Number(value));
            }),

        price: Yup.string()
            .required('Price is required')
            .test('valid-phone', 'Invalid Price', value => {
                if (!value) return true; // Allow empty value

                // Check if value is a valid number
                return !isNaN(value);
            }),
        color: Yup.string()
            .required('Color is required')
            .test('not-a-number', 'Color cannot be a number', value => {
                if (!value) return true; // Allow empty values (already handled by 'required')
                return isNaN(Number(value));
            }),

        condition: Yup.string().required('Please Select any option'),
        box: Yup.string().required('Please Select any option'),
        size: Yup.string().required('Please select a Size').test('not-select-category', 'Please select a Valid Size', value => {
            return value !== 'Select Size';
        }),
        type: Yup.string().required('Please select a type').test('not-select-category', 'Please select a Valid type', value => {
            return value !== 'Select type';
        }),
        side: Yup.string().required('Please Select any option'),
        file: Yup.mixed()
            .required('Image  is required')
            .test('file-type', 'Invalid file type', value => {
                if (!value) return true; // Allow empty value
                const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // Define the allowed file types
                return value && allowedTypes.includes(value.type);
            }),
        // .test('file-size', 'File size is too large', value => {
        //     if (!value) return true; // Allow empty value
        //     const maxSizeInBytes = 5 * 1024 * 1024; // 5MB maximum file size
        //     return value && value.size <= maxSizeInBytes;
        // }),
        description: Yup.string()
            .required('Description is required')
        // .test('not-a-number', 'Description cannot be a number', value => {
        //     if (!value) return true; // Allow empty values (already handled by 'required')
        //     return isNaN(Number(value));
        // }),

    });
    const abductionValidationSchema = Yup.object().shape({
        brand: Yup.string()
            .required('Brand Name is required')
            .test('not-a-number', 'Brand name cannot be a number', value => {
                if (!value) return true; // Allow empty values (already handled by 'required')
                return isNaN(Number(value));
            }),

        price: Yup.string()
            .required('Price is required')
            .test('valid-phone', 'Invalid Price', value => {
                if (!value) return true; // Allow empty value

                // Check if value is a valid number
                return !isNaN(value);
            }),

        condition: Yup.string().required('Please Select any option'),
        box: Yup.string().required('Please Select any option'),
        size: Yup.string().required('Please select a Size').test('not-select-category', 'Please select a Valid Size', value => {
            return value !== 'Select Size';
        }),

        file: Yup.mixed()
            .required('Image  is required')
            .test('file-type', 'Invalid file type', value => {
                if (!value) return true; // Allow empty value
                const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; // Define the allowed file types
                return value && allowedTypes.includes(value.type);
            }),
        // .test('file-size', 'File size is too large', value => {
        //     if (!value) return true; // Allow empty value
        //     const maxSizeInBytes = 5 * 1024 * 1024; // 5MB maximum file size
        //     return value && value.size <= maxSizeInBytes;
        // }),
        description: Yup.string()
            .required('Description is required')
        // .test('not-a-number', 'Description cannot be a number', value => {
        //     if (!value) return true; // Allow empty values (already handled by 'required')
        //     return isNaN(Number(value));
        // }),

    });

    let sellerID
    try {
        const user = auth.currentUser;
        sellerID = user.uid
    } catch (error) {
        console.log(error)
    }


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

    console.log("FILE", formData.file)

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





            const storageRef = ref(Storage, `${uuidv4()}_${formData.file.name}`);

            try {
                // Upload the file
                await uploadBytes(storageRef, formData.file);

                try {
                    // Get the download URL
                    const fileUrl = await getDownloadURL(storageRef);

                    // Set the URL in state
                    console.log('Uploaded file URL:', fileUrl);

                    setErrors("");
                    let docRef;
                    try {
                        const collectionRef = collection(db, "Products");
                        docRef = doc(collectionRef, uuidv4());
                    } catch (error) {
                        console.log(error)
                    }
                    console.log("UPLOADING>>>", fileUrl)


                    const values = {
                        sellerId: sellerID,
                        category: formData.category,
                        size: formData.size,
                        brand: formData.brand,
                        color: formData.color,
                        price: formData.price,
                        type: formData.type,
                        condition: formData.condition,
                        box: formData.box,
                        side: formData.side,
                        description: formData.description,
                        file: fileUrl,
                        status: "Pending",
                        featured: false,
                        popular: false,
                    };
                    await setDoc(docRef, values, { merge: true });
                    NotificationManager.success("Product uploaded successfully!");

                    setFormData({
                        category: 'afo',
                        size: '',
                        brand: '',
                        color: '',
                        price: '',
                        type: '',
                        condition: '',
                        box: '',
                        side: '',
                        description: '',
                        file: null
                    })
                    router.push('/')

                } catch (urlError) {
                    console.error('Error getting download URL:', urlError);
                    if (urlError === "FirebaseError: Firebase: Error (auth/email-already-in-use).") {
                        NotificationManager.error("Email already used!");
                        alert("Email already used!")

                    }

                }
                setLoading(false)

            } catch (uploadError) {
                console.error('Error uploading file:', uploadError);
                NotificationManager.error(uploadError);
                setLoading(false)

            }
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
                    NotificationManager.error("Email already used!");
                    alert("Email already used!")

                } else {
                    NotificationManager.error(error);

                }
                console.log("CATCH ERROR", error)
                setLoading(false)



            }

        }
    }


    return (
        <div className="py-10 md:w-[900px] md:mx-auto md:px-10 px-5 flex flex-col justify-center mt-6 xl:mt-0 bg-white shadow-md ">
            <NotificationContainer />
            <form onSubmit={(e) => { handleSubmit(e) }}>
                <h1 className="text-2xl font-semibold mb-2">Upload Products</h1>
                <p className="text-[16px] font-[500] text-[#000000] mb-8">
                    {" "}
                    Fill the form below or write us .We will help you as soon as possible.
                </p>


                <div className="flex md:justify-between mb-3 flex-col md:flex-row">
                    <div>
                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-black">Category*</span>
                            <select
                                name="category"
                                required
                                className="text-[#777777] block xl:w-96 w-72 -mb-4 xl:mb-0 mt-1 p-2 bg-[#B4C7ED0D] border-[#2668E826] border-2 rounded-md"
                                onChange={(e) => { handleCategoryChange(e); handleChange(e); }}
                                value={formData.category}
                            >

                                <option value="afo">AFO System</option>
                                <option value="abduction">Abduction Bar</option>
                            </select>
                        </label>
                    </div>
                    <div className='md:mt-0 mt-3'>

                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-black">Size*</span>
                            <select
                                name="size"

                                className="text-[#777777] block xl:w-96 w-72 -mb-4 xl:mb-0 mt-1 p-2 bg-[#B4C7ED0D] border-[#2668E826] border-2 rounded-md"
                                onChange={(e) => { handleChange(e); }}
                                value={formData.size}
                            >
                                {formData.category === 'abduction' ? <>
                                    <option value="">Select Size</option>
                                    <option value="Extra Short">Extra Short</option>
                                    <option value="Short">Short</option>
                                    <option value="Long">Long</option></> : <>
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
                                    <option value="12">12</option></>}



                            </select>
                            {errors.size && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.size}</div>}
                        </label>


                    </div>

                </div>
                <div className="xl:-mt-3 xl:flex xl:justify-between">
                    <div>
                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-[#000000]">Brand*</span>
                            <input
                                type="text"
                                name="brand"
                                onChange={(e) => { handleChange(e); }}
                                value={formData.brand}
                                className="block xl:w-96 w-72 mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                placeholder="Brand name"
                            />
                            {errors.brand && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.brand}</div>}
                        </label>

                    </div>
                    {selectedCategory === 'afo' && (
                        <div className='md:mt-0 mt-8'>
                            <label className="block mb-6">
                                <span className="text-[16px] font-[500] text-[#000000]">Color*</span>
                                <input
                                    type="text"
                                    name="color"
                                    onChange={(e) => { handleChange(e); }}
                                    value={formData.color}
                                    className="block xl:w-96 w-72 mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                    placeholder="Blue"
                                />
                                {errors.color && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.color}</div>}
                            </label>

                        </div>
                    )}
                </div>
                <div className="xl:-mt-3 xl:flex xl:justify-between">
                    <div>
                        <label className="block mb-6">
                            <span className="text-[16px] font-[500] text-[#000000]">Price*</span>
                            <input
                                type="number"
                                name="price"
                                onChange={(e) => { handleChange(e); }}
                                value={formData.price}
                                className="block xl:w-96 w-72 mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                placeholder="$878"
                            />
                            {errors.price && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.price}</div>}
                        </label>

                    </div>

                    {selectedCategory === 'abduction' || selectedCategory === 'afo' && (
                        <div>
                            <label className="block  mb-6">
                                <span className="text-[16px] font-[500] text-black">Type:</span>

                                <select
                                    name='type'
                                    onChange={(e) => { handleChange(e); }}
                                    value={formData.type}

                                    className=" text-[#777777]
            block
            xl:w-96
                w-72
            -mb-4
            xl:mb-0
            mt-1
             p-2  bg-[#B4C7ED0D] border-[#2668E826] border-2
            rounded-md"
                                >
                                    <option value="">Select type</option>
                                    <option value="Standard">Standard</option>

                                    <option value="Toe Slit">Toe Slit</option>
                                    <option value="Planter Flexion Stop">Planter Flexion Stop</option>
                                </select>
                                {errors.type && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.type}</div>}

                            </label>
                        </div>
                    )}
                </div>
                <div className='flex md:flex-row flex-col justify-between'>
                    <div className=''>
                        <p className='"text-[16px] font-[500] text-[#000000] mb-5'>Condition</p>
                        <div className='flex gap-5'>
                            <label className="flex gap-1 ">
                                <input
                                    onChange={(e) => { handleChange(e); }}
                                    checked={formData.condition === 'New'}
                                    value='New'
                                    type="radio"
                                    name="condition"
                                    className="block  mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                    placeholder="$878"
                                />
                                <span className="text-[16px] font-[400] text-[#777777]">New</span>
                            </label>
                            <label className="flex gap-1 ">
                                <input
                                    onChange={(e) => { handleChange(e); }}
                                    checked={formData.condition === 'Like New'}
                                    value='Like New'
                                    type="radio"
                                    name="condition"
                                    className="block  mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                    placeholder="$878"
                                />
                                <span className="text-[16px] font-[400] text-[#777777]">Like New</span>
                            </label>
                            <label className="flex gap-1 ">
                                <input
                                    onChange={(e) => { handleChange(e); }}
                                    checked={formData.condition === 'Used'}
                                    value='Used'
                                    type="radio"
                                    name="condition"
                                    className="block  mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                    placeholder="$878"
                                />
                                <span className="text-[16px] font-[400] text-[#777777]">Used</span>
                            </label>
                        </div>
                        {errors.condition && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.condition}</div>}
                    </div>
                    <div className=''>
                        <p className='"text-[16px] font-[500] text-[#000000] mb-5'>With Original Box</p>
                        <div className='flex gap-5 '>
                            <label className="flex gap-1 ">
                                <input
                                    onChange={(e) => { handleChange(e); }}
                                    checked={formData.box === 'Yes'}
                                    value='Yes'
                                    type="radio"
                                    name="box"
                                    className="block  mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                    placeholder="$878"
                                />
                                <span className="text-[16px] font-[400] text-[#777777]">Yes</span>
                            </label>
                            <label className="flex gap-1 ">
                                <input
                                    onChange={(e) => { handleChange(e); }}
                                    checked={formData.box === 'No'}
                                    value='No'
                                    type="radio"
                                    name="box"
                                    className="block  mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                    placeholder="$878"
                                />
                                <span className="text-[16px] font-[400] text-[#777777]">No</span>
                            </label>

                        </div>
                        {errors.box && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-6 mt-1  mt-0">{errors.box}</div>}
                    </div>
                    {formData.category === 'afo' && (
                        <div className=''>
                            <p className='"text-[16px] font-[500] text-[#000000] mb-5'>Side</p>
                            <div className='flex gap-5'>
                                <label className="flex gap-1 ">
                                    <input
                                        onChange={(e) => { handleChange(e); }}
                                        checked={formData.side === 'Left'}
                                        value='Left'
                                        type="radio"
                                        name="side"
                                        className="block  mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                        placeholder="$878"
                                    />
                                    <span className="text-[16px] font-[400] text-[#777777]">Left</span>
                                </label>
                                <label className="flex gap-1 ">
                                    <input
                                        onChange={(e) => { handleChange(e); }}

                                        checked={formData.side === 'Right'}
                                        value='Right'
                                        type="radio"
                                        name="side"
                                        className="block  mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                        placeholder="$878"
                                    />
                                    <span className="text-[16px] font-[400] text-[#777777]">Right</span>
                                </label>
                                <label className="flex gap-1 ">
                                    <input
                                        onChange={(e) => { handleChange(e); }}

                                        checked={formData.side === 'Pair'}
                                        value='Pair'
                                        type="radio"
                                        name="side"
                                        className="block  mt-1 mb-6 xl:mb-0 rounded-md p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2"
                                        placeholder="$878"
                                    />
                                    <span className="text-[16px] font-[400] text-[#777777]">Pair</span>
                                </label>
                            </div>
                            {errors.side && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-6 mt-1  mt-0">{errors.side}</div>}
                        </div>
                    )}

                </div>
                <div className="md:w-full flex flex-col">
                    <label
                        for=""
                        className="text-[16px] font-[500] text-[#000000] "
                    >
                        Description*
                    </label>
                    <input
                        onChange={(e) => { handleChange(e); }}

                        value={formData.description}
                        type="text"
                        name="description"
                        rows="4"
                        placeholder="Write the Product description here"
                        cols="50"
                        className="bg-[#B4C7ED0D] pb-20 h-[123px] text-[#777777] md:w-full w-[290px] mt-3 border-[#1A9CDA26] border-2 rounded-md p-3"
                    />
                    {errors.description && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.description}</div>}
                </div>
                <div>

                    <div class="flex items-start flex-col justify-center w-full mt-5">
                        <label for="file" class="flex flex-col items-center justify-center w-full h-[187px] border-2 border-[#00ADDF] border-dashed rounded-lg cursor-pointer bg-[#A0CEF80D] ">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M45.8992 7.40002C44.3875 7.40002 42.9377 8.00056 41.8687 9.06952C40.7998 10.1385 40.1992 11.5883 40.1992 13.1C40.1992 14.6118 40.7998 16.0616 41.8687 17.1305C42.9377 18.1995 44.3875 18.8 45.8992 18.8C47.411 18.8 48.8608 18.1995 49.9297 17.1305C50.9987 16.0616 51.5992 14.6118 51.5992 13.1C51.5992 11.5883 50.9987 10.1385 49.9297 9.06952C48.8608 8.00056 47.411 7.40002 45.8992 7.40002Z" fill="#00ADDF" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0 5.7C0 4.18827 0.600534 2.73845 1.66949 1.66949C2.73845 0.600534 4.18827 0 5.7 0L51.3 0C52.8117 0 54.2616 0.600534 55.3305 1.66949C56.3995 2.73845 57 4.18827 57 5.7V51.3C57 52.2413 56.7677 53.168 56.3236 53.998C55.8358 54.9058 55.1111 55.6643 54.2265 56.1929C53.3419 56.7215 52.3305 57.0005 51.3 57H5.7C4.18827 57 2.73845 56.3995 1.66949 55.3305C0.600534 54.2616 0 52.8117 0 51.3L0 5.7ZM18.43 11.9396L17.1 10.6096L3.8 23.9096V5.7C3.8 5.19609 4.00018 4.71282 4.3565 4.3565C4.71282 4.00018 5.19609 3.8 5.7 3.8H51.3C51.8039 3.8 52.2872 4.00018 52.6435 4.3565C52.9998 4.71282 53.2 5.19609 53.2 5.7V38H44.4866L18.4452 11.9548L18.43 11.9396Z" fill="#00ADDF" />
                                </svg>


                                <p class="mb-2 mt-4 text-[16px] md:font-[700]">Drop your image here. or  <span class="text-[#00ADDF]"> browse</span > </p>
                                <p class="text-[16px] text-[#777777]">Support jpg, PNG, PDF:{formData?.file?.name}</p>
                            </div>
                            <input id="file" onChange={(e) => { handleChange(e); }}
                                type="file" class="hidden" />
                        </label>
                        {errors.file && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.file}</div>}
                    </div>


                </div>

                <div className='w-full my-5'>
                    <p className='bg-[#D9D9D9] border border-[#E2A7A7] rounded-[5px] text-[14px] p-3 font-[400] text-[#777777]'>Hate speech, Phone numbers, emails or links are not allowed in the description. Otherwise the Ad will be deleted</p>
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
                        /> : <button type='submit' className='w-[250px] md:w-[302px] h-[46px] flex justify-center mx-auto items-center text-white bg-primary-pink-color rounded-[5px]'>
                            Upload Product
                        </button>
                    }
                </div>
            </form>
        </div>
    )
}

export default ProductUpload