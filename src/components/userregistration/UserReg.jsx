import React from "react";
import { useState } from "react";
import * as Yup from 'yup';
import { v4 as uuidv4 } from "uuid";
import { InfinitySpin } from 'react-loader-spinner'
import { useRouter } from "next/router";
import { auth, db } from "../../../Firebase/firebase.js";
import 'react-notifications/lib/notifications.css';
import {
  notification
} from "antd";
import {
  collection,
  addDoc, doc, getDoc, setDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, FirebaseAuthException } from "firebase/auth"
import { signInWithEmailAndPassword } from "firebase/auth";

const UserReg = () => {
  const router = useRouter();


  const countries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo (Congo-Brazzaville)',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czechia (Czech Republic)',
    'Democratic Republic of the Congo (Congo-Kinshasa)',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'East Timor (Timor-Leste)',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Holy See',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Ivory Coast',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar (formerly Burma)',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Korea',
    'North Macedonia (formerly Macedonia)',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine State',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Tibet',
    'Timor-Leste (East Timor)',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States of America',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe'
  ];

  const [searchText, setSearchText] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);


  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    postCode: '',
    phone: '',
    city: '',
    password1: '',
    password2: '',
    region: '',
    address: '',

  });


  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [fullNumber, setFullNumber] = useState('');

  const handleCountryCodeChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountryCode(countryCode);
    // setFullNumber(countryCode);
    setFormData({
      ...formData, // Spread the existing values
      phone: countryCode, // Update only the phone value
    });
  };
  const [errors, setErrors] = useState({});

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
    postCode: Yup.string()
      .required('Post Code is required')
      .test('valid-post-code', 'Invalid Post Code', value => {
        if (!value) return true; // Allow empty value

        // Check if value is a valid number
        return !isNaN(value);
      })
      .max(10, "Code can't exceed 10 digits"),
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
      .matches(/^\+\d{1,13}$/, 'Phone number should start with + and contain 1 to 13 digits')
      .max(13, 'Phone number should not be more than 13 digits'),

    city: Yup.string()
      .required('City is required')
      .test('not-select-category', 'Please select a Valid Region', value => {
        return value !== 'Select City';
      }),
    password1: Yup.string()
      .required('Password is required')
      .min(6, 'Password should be at least 6 characters'),
    password2: Yup.string()
      .required('Password confirmation is required')
      .oneOf([Yup.ref('password1'), null], 'Passwords must match'),
    address: Yup.string().required('Address is required'),
    region: Yup.string().required('Please select a Region').test('not-select-category', 'Please select a Valid Region', value => {
      return value !== 'Select Region';
    }),

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

  const handleSelectChange = (e) => {

    setSearchText(e.target.value);
    const filtered = countries.filter((country) =>
      country.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCountries(filtered);
    setFormData({
      ...formData, // Spread the existing values
      region: e.target.value, // Update only the phone value
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await validationSchema.validate(formData, { abortEarly: false });
      console.log('Form data is valid:', formData);
      setLoading(true);






      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password2);
      const user = userCredential.user;
      console.log("userID", user.uid)
      const collectionRef = collection(db, "Users");
      const docRef = doc(collectionRef, user.uid);

      const values = {
        firstName: formData.fname,
        lastName: formData.lname,
        email: formData.email,
        postCode: formData.postCode,
        city: formData.city,
        phone: formData.phone,
        region: formData.region,
        address: formData.address
      };
      await setDoc(docRef, values, { merge: true });

      await signInWithEmailAndPassword(auth, formData.email, formData.password2);





      notification.open({
        type: "success",
        message: "Successfully Registered!",
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
        console.log("VALIDATION ERROR", newErrors)

        setErrors(newErrors);
        setLoading(false);

      }
      else {
        const message = error.message
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
          notification.open({
            type: "error",
            message: "Email already in use!",
            placement: "top",
          });
          setErrors("");

        }
        else {
          var modifiedText = message.replace("Firebase:", '');
          setErrors("");

          notification.open({
            type: "error",
            message: modifiedText,
            placement: "top",
          });
        }



        console.log(error.message)


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
      <form onSubmit={(e) => { handleSubmit(e) }}>
        <h1 className="text-2xl font-semibold">User Information</h1>
        <p className="text-[16px] font-[500] text-[#000000] mb-8">
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

             p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2
          "
                placeholder="James"
              />
              {errors.fname && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.fname}</div>}
            </label>
          </div>
          <div className="">
            <label className="block mb-3">
              <span className="text-[16px] font-[500] text-[#000000]">Last Name*</span>
              <input
                type="text"

                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="
            block
            xl:w-96
            w-72
            mt-1
            -mb-4
            xl:mb-0
             
            rounded-md

             p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2
          "
                placeholder="James"
              />
              {errors.lname && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.lname}</div>}
            </label>
          </div>
        </div>

        <div>
          <label className="block md:mt-0 mt-6 mb-6">
            <span className="text-[16px] font-[500] text-[#000000]">Email Address*</span>
            <input
              type="text"

              name="email"
              value={formData.email}
              onChange={handleChange}
              className="
            block
            xl:w-full
            w-72
            mt-1
            -mb-4
            xl:mb-0
             
            rounded-md

             p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2
          "
              placeholder="James68@gmail.com"
            />
            {errors.email && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.email}</div>}
          </label>
        </div>




        <div className='my-4 gap-6 xl:flex xl:justify-between'>
          <div className="w-full mb-4 block">
            <label htmlFor="country-code" className="text-[16px] font-[500] text-[#000000]">Enter Phone Code:</label>

            <select className="
            block
            xl:w-full
            w-72
            mt-1
            -mb-4
            xl:mb-0
             
            rounded-md

             py-2.5 px-3 bg-[#B4C7ED0D] border-[#2668E826]  border-2
          " id="country-code" onChange={handleCountryCodeChange} value={selectedCountryCode}>
              <option value="">Select a country code</option>
              <option value="+1">United States (+1)</option>
              <option value="+1">United States (+1)</option>
              <option value="+44">United Kingdom (+44)</option>
              <option value="+33">France (+33)</option>
              <option value="+49">Germany (+49)</option>
              <option value="+39">Italy (+39)</option>
              <option value="+34">Spain (+34)</option>
              <option value="+31">Netherlands (+31)</option>
              <option value="+41">Switzerland (+41)</option>
              <option value="+46">Sweden (+46)</option>
              <option value="+47">Norway (+47)</option>
              <option value="+91">India (+91)</option>
              <option value="+92">Pakistan (+92)</option>

            </select>
          </div>
          <div className="w-full mb-4 block">
            <label htmlFor="full-number" className="text-[16px] font-[500] text-[#000000]">Enter Full Number:</label>
            <input
              placeholder='Phone Number'
              type="text"
              id="phone"
              name='phone'
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
              value={formData.phone}
              readOnly={!selectedCountryCode}
              onChange={handleChange}

            />
            {errors.phone && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.phone}</div>}
          </div>

        </div>


        {/* =================== */}

        <div>
          <label className="block mb-6">
            <span className="text-[16px] font-[500] text-[#000000]">Address*</span>
            <input
              type="text"

              name="address"
              value={formData.address}
              onChange={handleChange}
              className="
            block
            xl:w-full
            w-72
            mt-1
            -mb-4
            xl:mb-0
            rounded-md
               
             px-2 pt-2 pb-16 bg-[#B4C7ED0D] border-[#2668E826]  border-2
          "
              placeholder="Write your complete address here"
            />
            {errors.address && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.address}</div>}
          </label>
        </div>

        {/* =============================== */}
        <div>
          <label className="block mb-6">
            <span className="text-[16px] font-[500] text-[#000000]">Posta/ZIP Code*</span>
            <input
              type="text"
              name="postCode"
              value={formData.postCode}
              onChange={handleChange}

              className="
            block
            xl:w-full
            w-72
            mt-1
            -mb-4
            xl:mb-0
            rounded-md
            p-2 bg-[#B4C7ED0D] border-[#2668E826]  border-2
          "
              placeholder="5756"
            />
          </label>
          {errors.postCode && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.postCode}</div>}
        </div>
        <div className="flex md:justify-between mb-3 flex-col md:flex-row">
          <div>
            <label className="block mb-6">
              <span className="text-[16px] font-[500] text-black">City*</span>

              <select
                name="city"
                value={formData.city}
                onChange={handleChange}

                className="
            block
            text-[#777777]
            xl:w-96
                w-72
            -mb-4
            xl:mb-0
            mt-1
             p-2  bg-[#B4C7ED0D] border-[#2668E826] border-2
            rounded-md"
              >
                <option value="cake">Select City</option>
                <option value="cake">New York</option>
                <option value="cat">abc</option>
                <option value="meme">as</option>
                <option value="zoom">sa</option>
              </select>
              {errors.city && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.city}</div>}
            </label>
          </div>
          <div>
            <label className="block mb-6">
              <span className="text-[16px] font-[500] text-black">Country*</span>


              <select name='country'
                id='country'
                className="
            block
            xl:w-96
                w-72
            -mb-4
            xl:mb-0
            mt-1
             py-2 px-3  bg-[#B4C7ED0D] border-[#2668E826] border-2
            rounded-md"
                value={searchText}
                onChange={handleSelectChange}
              >
                <option value="">Select a country</option>
                {filteredCountries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.region && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.region}</div>}
            </label>

          </div>

        </div>
        <div className="xl:-mt-3 xl:flex xl:justify-between">
          <div>
            <label className="block mb-6">
              <span className="text-[16px] font-[500] text-[#000000]">Password*</span>
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
              {errors.password1 && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.password1}</div>}
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
              {errors.password2 && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.password2}</div>}
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
              Create user Account
            </button>
          }

        </div>

      </form>

    </div>
  );
};

export default UserReg;
