"use client";
import Head from "next/head";
import Image from "next/image";
import {
  notification
} from "antd";
import SellerApi from "@/lib/sellers";
import BuyerApi from "@/lib/UsersApi.js"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { auth, db } from "../../../Firebase/firebase.js";
import 'react-notifications/lib/notifications.css';
import * as Yup from 'yup';
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
import { ThreeDots } from 'react-loader-spinner'


const ProfilePage = () => {
  const router = useRouter();

  let userId

  try {
    const user = auth.currentUser;
    userId = user.uid
  } catch (error) {
    console.log(error)
  }


  const { data, isLoading, isError } = useQuery(
    ['Sellers'],
    async () => {

      const response = await SellerApi.getUserByUserId(userId);
      return response;// Assuming your API returns data property

    }
  );
  const { data: BuyerData, isLoading: BuyerLoading, isError: BuyerError } = useQuery(
    ['Buyers'],
    async () => {

      const response = await BuyerApi.getUserByUserId(userId);
      return response;// Assuming your API returns data property

    }
  );

  console.log("SELLER", data)
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: data !== null ? data?.firstName : BuyerData?.firstName,
    lastName: data !== null ? data?.lastName : BuyerData?.lastName,
    email: data !== null ? data?.email : BuyerData?.email,
    phone: data !== null ? data?.phone : BuyerData?.phone,
    country: data !== null ? data?.country : BuyerData?.country,
    register: data !== null ? data?.register : BuyerData?.register,
    address: data !== null ? data?.address : BuyerData?.address,
  });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required')
      .test('not-email', 'First Name cannot be an email', value => {
        // Check if the value does not look like an email address
        return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      })
      .test('not-number', 'First Name cannot be a number', value => {
        // Check if the value is not a number
        return isNaN(Number(value));
      }),
    lastName: Yup.string()
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
    country: Yup.string().required('Please select a country').test('not-select-category', 'Please select a Valid Country', value => {
      return value !== 'Select Country';
    }),
    address: Yup.string().required('Address is required'),

  });
  const validationSchemaBuyer = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required')
      .test('not-email', 'First Name cannot be an email', value => {
        // Check if the value does not look like an email address
        return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      })
      .test('not-number', 'First Name cannot be a number', value => {
        // Check if the value is not a number
        return isNaN(Number(value));
      }),
    lastName: Yup.string()
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
    country: Yup.string().required('Please select a country').test('not-select-category', 'Please select a Valid Country', value => {
      return value !== 'Select Country';
    }),
    address: Yup.string().required('Address is required'),

  });


  console.log("FORM", formData)
  const [isFormEdited, setIsFormEdited] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsFormEdited(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {





      if (data !== null) {
        await validationSchema.validate(formData, { abortEarly: false });
        console.log('Form data is valid:', formData);
        setLoading(true);
        const values = {
          firstName: formData.firstName,
          email: formData.email,
          lastName: formData.lastName,
          country: formData.country,
          phone: formData.phone,
          register: formData?.register,
          address: formData.address
        };
        const ref = doc(db, "Sellers", userId);
        await setDoc(ref, values, { merge: true });
        notification.open({
          type: "success",
          message: "Successfully Updated!",
          placement: "top",
        });
      }
      else {
        await validationSchemaBuyer.validate(formData, { abortEarly: false });
        console.log('Form data is valid:', formData);
        setLoading(true);
        const values = {
          firstName: formData.firstName,
          email: formData.email,
          lastName: formData.lastName,
          country: formData.country,
          phone: formData.phone,
          address: formData.address
        };
        const ref = doc(db, "Users", userId);
        await setDoc(ref, values, { merge: true });
        notification.open({
          type: "success",
          message: "Successfully Updated!",
          placement: "top",
        });
      }






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

        console.log("FIREBASE ERROR", error)


        setLoading(false);
      }





    }



  };

  const logOut = async () => {
    try {
      await auth.signOut();
      notification.open({
        type: "success",
        message: "Logged out",
        placement: "top",
      });
      router.push('/');


    } catch (error) {
      // An error happened during sign-out.
      console.error(error);
    }

  }
  if (isLoading) {
    return <div className="flex justify-center items-center"> <ThreeDots
      height="150"
      width="150"
      radius="9"
      color="#4fa94d"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClassName=""
      visible={true}
    />
    </div>
  }
  if (BuyerLoading) {
    return <div className="flex h-[100vh] justify-center items-center"> <ThreeDots
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
    return <h1>Error fetching data</h1>
  }

  return (
    <div className="max-w-[890px] overflow-hidden">
      <div className="flex flex-col md:flex-row ">
        <div className=" w-[325px] mx-auto md:mx-0  md:w-80 flex md:flex-col flex-wrap order-last  rounded-md  ">
          <div className="flex flex-col flex-grow mb-4 items-center bg-[#FFFFFF] shadow-md border rounded-md px-3 py-5 md:h-[280px] md:w-[260px] ">
            <div className="flex items-center justify-center mt-1">
              <div className="w-30 h-28 rounded-full  overflow-hidden">
                <Image
                  src="/images/userrrr.png"
                  width={400}
                  height={400}
                  alt="Admin Image"
                  className="w-[100px] h-[100px]"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain', // You can use other values like 'cover', 'contain', etc.
                  }}
                />
              </div>
            </div>

            <h1 className="font-semibold mt-4 text-[18px]">{data !== null ? data.firstName : BuyerData?.firstName} {data !== null ? data.lastName : BuyerData?.lastName}  </h1>
            <h1 className="font-normal mt-1 text-[#777777]">Businessmen</h1>
            <div className="flex gap-2">
              <Image
                src={"/images/location.svg"}
                width={10}
                height={10}
                alt="dd"
              ></Image>
              <h1 className="font-normal mt-1 text-[#1A9CDA]">{data !== null ? data.country : BuyerData?.country}  </h1>
            </div>
            <div className="mt-0 w-full mt-0 flex flex-col  ">
              <button onClick={logOut} className="w-full bg-[#1A9CDA] text-white py-2 rounded-[5px] text-[16px] font-[500]">
                Log Out
              </button>
              {/* <button className="w-full border py-2 rounded-[5px] text-[16px] font-[500]">
                Delete Account
              </button> */}
            </div>
          </div>
          <div className="w-full flex flex-grow flex-1 flex-wrap mt-2 md:mt-0">
            <div className="bg-[#FFFFFF] flex flex-col md:h-[150px]  border justify-around  shadow-md md:w-[260px] rounded-lg py-3 px-5 sm:ml-3   md:ml-0 md:my-3 w-full   h-full overflow-hidden">
              <div className="flex items-start my-2 ">
                <div className="relative w-5 h-5 mr-3">
                  <Image
                    src="/images/email.svg" // Replace with the path to your email icon image
                    layout="fill"
                    objectFit="contain"
                    alt="Email Icon"
                  />
                </div>
                <p className="md:text-[14px] text-[12px] font-[400]">{data !== null ? data.email : BuyerData?.email}</p>
              </div>
              <div className="flex items-center my-2">
                <div className=" relative w-5 h-5 mr-3">
                  <Image
                    src="/images/phone.svg" // Replace with the path to your phone icon image
                    layout="fill"
                    objectFit="contain"
                    alt="Phone Icon"
                  />
                </div>
                <p className="md:text-[14px] text-[12px] font-[400]">{data !== null ? data.phone : BuyerData?.phone}</p>
              </div>
              <div className="flex items-center my-2">
                <div className="relative w-5 h-5 mr-3">
                  <Image
                    src="/images/address.svg" // Replace with the path to your location icon image
                    layout="fill"
                    objectFit="contain"
                    alt="Location Icon"
                  />
                </div>
                <p className="md:text-[14px] text-[12px] font-[400]">
                  {data !== null ? data.address : BuyerData?.address}               </p>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-full  mt-5 md:mt-0 md:w-full md:flex-row flex flex-col ">
          <div className="w-full   px-6 ">
            <form className=" border-b border-[#DFDFDF] px-6 pb-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="text-[16px] font-normal text-[#777777]"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                  />
                  {errors.firstName && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.firstName}</div>}

                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="text-[16px] font-normal text-[#777777]"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                  />
                  {errors.lastName && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.lastName}</div>}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-[16px] font-normal text-[#777777]"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                  />
                  {errors.email && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.email}</div>}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="text-[16px] font-normal text-[#777777]"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                  />
                  {errors.phone && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.phone}</div>}
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="text-[16px] font-normal text-[#777777]"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                  >
                    <option value="">Select Country</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                  </select>
                  {errors.country && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.country}</div>}
                </div>
                {/* <div>
                  <label
                    htmlFor="city"
                    className="text-[16px] font-normal text-[#777777]"
                  >
                    City
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                  >
                    <option value="">Select City</option>
                    <option value="New York">New York</option>
                  </select>
                </div> */}
                {
                  data !== null && <div className="w-full">
                    <label
                      htmlFor="register"
                      className="text-[16px] font-normal text-[#777777]"
                    >
                      Register As
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.register}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    >
                      <option value="">Select Country</option>
                      <option value="Individual">Individual</option>
                      <option value="Company">Company</option>
                    </select>
                    {errors.register && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.register}</div>}
                  </div>
                }

              </div>
              {/* <div className="mt-4">
                  <label
                    htmlFor="about"
                    className="text-[16px] font-normal text-[#777777]"
                  >
                    About Me
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    placeholder="Write here..."
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    rows={4}
                    style={{ resize: "none" }}
                  />
                </div> */}
              <div className="w-full flex justify-center sm:justify-end ">
                <button
                  type="submit"
                  className="mt-6 bg-[#A51F6C] text-white py-2 px-4 rounded transition duration-300 hover:bg-[#E82494]"
                >
                  Update Profile
                </button>

              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
