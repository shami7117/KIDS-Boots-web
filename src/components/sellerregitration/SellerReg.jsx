import Link from 'next/link'
import React from 'react'
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import {
    collection,
    addDoc, doc, getDoc, setDoc,
} from "firebase/firestore";
import {
    notification
} from "antd";
import { auth, db } from "../../../Firebase/firebase.js";
import { createUserWithEmailAndPassword, FirebaseAuthException } from "firebase/auth"
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router.js';
import { InfinitySpin } from 'react-loader-spinner'
import 'react-notifications/lib/notifications.css';
import { Select } from 'antd';

const { Option } = Select;

const SellerReg = () => {
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


    const countryCodes = [
        { value: '+1', label: 'United States (+1)' },
        { value: '+44', label: 'United Kingdom (+44)' },
        { value: '+33', label: 'France (+33)' },
        { value: '+49', label: 'Germany (+49)' },
        { value: '+39', label: 'Italy (+39)' },
        { value: '+34', label: 'Spain (+34)' },
        { value: '+31', label: 'Netherlands (+31)' },
        { value: '+41', label: 'Switzerland (+41)' },
        { value: '+46', label: 'Sweden (+46)' },
        { value: '+47', label: 'Norway (+47)' },
        { value: '+91', label: 'India (+91)' },
        { value: '+92', label: 'Pakistan (+92)' },
        // Add more countries here
        { value: '+93', label: 'Afghanistan (+93)' },
        { value: '+355', label: 'Albania (+355)' },
        { value: '+213', label: 'Algeria (+213)' },
        { value: '+244', label: 'Angola (+244)' },
        { value: '+54', label: 'Argentina (+54)' },
        { value: '+374', label: 'Armenia (+374)' },
        { value: '+61', label: 'Australia (+61)' },
        { value: '+43', label: 'Austria (+43)' },
        { value: '+994', label: 'Azerbaijan (+994)' },
        { value: '+973', label: 'Bahrain (+973)' },
        { value: '+880', label: 'Bangladesh (+880)' },
        { value: '+375', label: 'Belarus (+375)' },
        { value: '+32', label: 'Belgium (+32)' },
        { value: '+501', label: 'Belize (+501)' },
        { value: '+229', label: 'Benin (+229)' },
        { value: '+975', label: 'Bhutan (+975)' },
        { value: '+591', label: 'Bolivia (+591)' },
        { value: '+387', label: 'Bosnia and Herzegovina (+387)' },
        { value: '+267', label: 'Botswana (+267)' },
        { value: '+55', label: 'Brazil (+55)' },
        { value: '+359', label: 'Bulgaria (+359)' },
        { value: '+226', label: 'Burkina Faso (+226)' },
        { value: '+257', label: 'Burundi (+257)' },
        { value: '+855', label: 'Cambodia (+855)' },
        { value: '+237', label: 'Cameroon (+237)' },
        { value: '+1', label: 'Canada (+1)' },
        { value: '+238', label: 'Cape Verde (+238)' },
        { value: '+236', label: 'Central African Republic (+236)' },
        { value: '+235', label: 'Chad (+235)' },
        { value: '+56', label: 'Chile (+56)' },
        { value: '+86', label: 'China (+86)' },
        { value: '+57', label: 'Colombia (+57)' },
        { value: '+269', label: 'Comoros (+269)' },
        { value: '+506', label: 'Costa Rica (+506)' },
        { value: '+385', label: 'Croatia (+385)' },
        { value: '+53', label: 'Cuba (+53)' },
        { value: '+357', label: 'Cyprus (+357)' },
        { value: '+420', label: 'Czech Republic (+420)' },
        { value: '+243', label: 'Democratic Republic of the Congo (+243)' },
        { value: '+45', label: 'Denmark (+45)' },
        { value: '+253', label: 'Djibouti (+253)' },
        { value: '+1', label: 'Dominican Republic (+1)' },
        { value: '+670', label: 'East Timor (+670)' },
        { value: '+593', label: 'Ecuador (+593)' },
        { value: '+20', label: 'Egypt (+20)' },
        { value: '+503', label: 'El Salvador (+503)' },
        { value: '+240', label: 'Equatorial Guinea (+240)' },
        { value: '+291', label: 'Eritrea (+291)' },
        { value: '+372', label: 'Estonia (+372)' },
        { value: '+251', label: 'Ethiopia (+251)' },
        { value: '+679', label: 'Fiji (+679)' },
        { value: '+358', label: 'Finland (+358)' },
        { value: '+33', label: 'France (+33)' },
        { value: '+241', label: 'Gabon (+241)' },
        { value: '+220', label: 'Gambia (+220)' },
        { value: '+995', label: 'Georgia (+995)' },
        { value: '+49', label: 'Germany (+49)' },
        { value: '+233', label: 'Ghana (+233)' },
        { value: '+30', label: 'Greece (+30)' },
        { value: '+502', label: 'Guatemala (+502)' },
        { value: '+224', label: 'Guinea (+224)' },
        { value: '+245', label: 'Guinea-Bissau (+245)' },
        { value: '+592', label: 'Guyana (+592)' },
        { value: '+509', label: 'Haiti (+509)' },
        { value: '+504', label: 'Honduras (+504)' },
        { value: '+852', label: 'Hong Kong (+852)' },
        { value: '+36', label: 'Hungary (+36)' },
        { value: '+354', label: 'Iceland (+354)' },
        { value: '+91', label: 'India (+91)' },
        { value: '+62', label: 'Indonesia (+62)' },
        { value: '+98', label: 'Iran (+98)' },
        { value: '+964', label: 'Iraq (+964)' },
        { value: '+353', label: 'Ireland (+353)' },
        { value: '+972', label: 'Israel (+972)' },
        { value: '+39', label: 'Italy (+39)' },
        { value: '+225', label: 'Ivory Coast (+225)' },
        { value: '+81', label: 'Japan (+81)' },
        { value: '+962', label: 'Jordan (+962)' },
        { value: '+7', label: 'Kazakhstan (+7)' },
        { value: '+254', label: 'Kenya (+254)' },
        { value: '+686', label: 'Kiribati (+686)' },
        { value: '+965', label: 'Kuwait (+965)' },
        { value: '+996', label: 'Kyrgyzstan (+996)' },
        { value: '+856', label: 'Laos (+856)' },
        { value: '+371', label: 'Latvia (+371)' },
        { value: '+961', label: 'Lebanon (+961)' },
        { value: '+266', label: 'Lesotho (+266)' },
        { value: '+231', label: 'Liberia (+231)' },
        { value: '+218', label: 'Libya (+218)' },
        { value: '+423', label: 'Liechtenstein (+423)' },
        { value: '+370', label: 'Lithuania (+370)' },
        { value: '+352', label: 'Luxembourg (+352)' },
        { value: '+853', label: 'Macau (+853)' },
        { value: '+389', label: 'Macedonia (+389)' },
        { value: '+261', label: 'Madagascar (+261)' },
        { value: '+265', label: 'Malawi (+265)' },
        { value: '+60', label: 'Malaysia (+60)' },
        { value: '+960', label: 'Maldives (+960)' },
        { value: '+223', label: 'Mali (+223)' },
        { value: '+356', label: 'Malta (+356)' },
        { value: '+692', label: 'Marshall Islands (+692)' },
        { value: '+222', label: 'Mauritania (+222)' },
        { value: '+230', label: 'Mauritius (+230)' },
        { value: '+262', label: 'Mayotte (+262)' },
        { value: '+52', label: 'Mexico (+52)' },
        { value: '+691', label: 'Micronesia (+691)' },
        { value: '+373', label: 'Moldova (+373)' },
        { value: '+377', label: 'Monaco (+377)' },
        { value: '+976', label: 'Mongolia (+976)' },
        { value: '+382', label: 'Montenegro (+382)' },
        { value: '+212', label: 'Morocco (+212)' },
        { value: '+258', label: 'Mozambique (+258)' },
        { value: '+95', label: 'Myanmar (+95)' },
        { value: '+264', label: 'Namibia (+264)' },
        { value: '+674', label: 'Nauru (+674)' },
        { value: '+977', label: 'Nepal (+977)' },
        { value: '+31', label: 'Netherlands (+31)' },
        { value: '+599', label: 'Netherlands Antilles (+599)' },
        { value: '+64', label: 'New Zealand (+64)' },
        { value: '+505', label: 'Nicaragua (+505)' },
        { value: '+227', label: 'Niger (+227)' },
        { value: '+234', label: 'Nigeria (+234)' },
        { value: '+850', label: 'North Korea (+850)' },
        { value: '+47', label: 'Norway (+47)' },
        { value: '+968', label: 'Oman (+968)' },
        { value: '+92', label: 'Pakistan (+92)' },
        { value: '+680', label: 'Palau (+680)' },
        { value: '+507', label: 'Panama (+507)' },
        { value: '+675', label: 'Papua New Guinea (+675)' },
        { value: '+595', label: 'Paraguay (+595)' },
        { value: '+51', label: 'Peru (+51)' },
        { value: '+63', label: 'Philippines (+63)' },
        { value: '+48', label: 'Poland (+48)' },
        { value: '+351', label: 'Portugal (+351)' },
        { value: '+974', label: 'Qatar (+974)' },
        { value: '+82', label: 'Republic of Korea (+82)' },
        { value: '+373', label: 'Republic of Moldova (+373)' },
        { value: '+40', label: 'Romania (+40)' },
        { value: '+7', label: 'Russia (+7)' },
        { value: '+250', label: 'Rwanda (+250)' },
        { value: '+590', label: 'Saint Martin (+590)' },
        { value: '+508', label: 'Saint Pierre and Miquelon (+508)' },
        { value: '+685', label: 'Samoa (+685)' },
        { value: '+378', label: 'San Marino (+378)' },
        { value: '+239', label: 'Sao Tome and Principe (+239)' },
        { value: '+966', label: 'Saudi Arabia (+966)' },
        { value: '+221', label: 'Senegal (+221)' },
        { value: '+381', label: 'Serbia (+381)' },
        { value: '+248', label: 'Seychelles (+248)' },
        { value: '+232', label: 'Sierra Leone (+232)' },
        { value: '+65', label: 'Singapore (+65)' },
        { value: '+1', label: 'Sint Maarten (+1)' },
        { value: '+421', label: 'Slovakia (+421)' },
        { value: '+386', label: 'Slovenia (+386)' },
        { value: '+677', label: 'Solomon Islands (+677)' },
        { value: '+252', label: 'Somalia (+252)' },
        { value: '+27', label: 'South Africa (+27)' },
        { value: '+211', label: 'South Sudan (+211)' },
        { value: '+34', label: 'Spain (+34)' },
        { value: '+94', label: 'Sri Lanka (+94)' },
        { value: '+249', label: 'Sudan (+249)' },
        { value: '+597', label: 'Suriname (+597)' },
        { value: '+268', label: 'Swaziland (+268)' },
        { value: '+46', label: 'Sweden (+46)' },
        { value: '+41', label: 'Switzerland (+41)' },
        { value: '+963', label: 'Syrian Arab Republic (+963)' },
        { value: '+886', label: 'Taiwan (+886)' },
        { value: '+992', label: 'Tajikistan (+992)' },
        { value: '+255', label: 'Tanzania (+255)' },
        { value: '+66', label: 'Thailand (+66)' },
        { value: '+228', label: 'Togo (+228)' },
        { value: '+690', label: 'Tokelau (+690)' },
        { value: '+676', label: 'Tonga (+676)' },
        { value: '+216', label: 'Tunisia (+216)' },
        { value: '+90', label: 'Turkey (+90)' },
        { value: '+993', label: 'Turkmenistan (+993)' },
        { value: '+688', label: 'Tuvalu (+688)' },
        { value: '+256', label: 'Uganda (+256)' },
        { value: '+380', label: 'Ukraine (+380)' },
        { value: '+971', label: 'United Arab Emirates (+971)' },
        { value: '+44', label: 'United Kingdom (+44)' },
        { value: '+1', label: 'United States (+1)' },
        { value: '+598', label: 'Uruguay (+598)' },
        { value: '+998', label: 'Uzbekistan (+998)' },
        { value: '+678', label: 'Vanuatu (+678)' },
        { value: '+379', label: 'Vatican City State (+379)' },
        { value: '+58', label: 'Venezuela (+58)' },
        { value: '+84', label: 'Vietnam (+84)' },
        { value: '+967', label: 'Yemen (+967)' },
        { value: '+260', label: 'Zambia (+260)' },
        { value: '+263', label: 'Zimbabwe (+263)' },
    ];

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

    const [searchText, setSearchText] = useState('');
    const [filteredCountries, setFilteredCountries] = useState(countries);

    const handleSelectChange = (e) => {
        setSearchText(e.target.value);
        const filtered = countries.filter((country) =>
            country.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredCountries(filtered);
        setFormData({
            ...formData, // Spread the existing values
            country: e.target.value, // Update only the phone value
        });
    };
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isRegister, setRegister] = useState(false);

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
    const filteredCountryCodes = countryCodes.filter((country) =>
        country.label.toLowerCase().includes(searchText.toLowerCase())
    );


    const [selectedCountry, setSelectedCountry] = useState('');


    // Find the country object with the matching code
    const selectedCountries = countryCodes.filter((country) =>

        country.value.toLowerCase().includes(selectedCountryCode.toLowerCase())

    )

    useEffect(() => {
        const countryName = selectedCountries[0].label?.match(/^(.*?)\s+\(\+\d+\)$/);

        if (countryName && countryName.length >= 2) {
            const extractedCountryName = countryName[1];
            setSelectedCountry(extractedCountryName)
            console.log(extractedCountryName); // This will print "Honduras"
        } else {
            console.log("Country name not found in the input string");
        }
    })


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
            .test('valid-phone', 'Invalid phone number', (value) => {
                if (!value) return false; // Phone is required and cannot be empty

                // Check if the value consists of a plus sign followed by numbers
                if (!/^\+\d+$/.test(value)) {
                    return false;
                }
                if (value.length < 8 || value.length > 14) {
                    return false;
                }

                return true; // Phone number is valid (contains a plus sign followed by numbers)
            })
            .required('Phone is required'),
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
            .test('valid-phone', 'Invalid phone number', (value) => {
                if (!value) return false; // Phone is required and cannot be empty

                // Check if the value consists of a plus sign followed by numbers
                if (!/^\+\d+$/.test(value)) {
                    return false;
                }
                if (value.length < 8 || value.length > 14) {
                    return false;
                }

                return true; // Phone number is valid (contains a plus sign followed by numbers)
            })
            .required('Phone is required'),
        password1: Yup.string()
            .required('Password is required')
            .min(6, 'Password should be at least 6 characters'),
        password2: Yup.string()
            .required('Password confirmation is required')
            .oneOf([Yup.ref('password1'), null], 'Passwords must match'),

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
                firstName: formData.fname,
                email: formData.email,
                lastName: formData.lname,
                shop: formData.shop,
                country: selectedCountry,
                phone: fullNumber,
                register: formData.register,
                address: formData.address
            };
            await setDoc(docRef, values, { merge: true });

            await signInWithEmailAndPassword(auth, formData.email, formData.password2);





            notification.open({
                type: "success",
                message: "Successfully Registered!",
                placement: "top",
            });


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

                <div className='my-4 gap-12 xl:flex xl:justify-between'>
                    <div className="w-full mb-4 block">
                        <label htmlFor="country-code" className="text-[16px] font-[500] text-[#000000]">Enter Phone Code:</label>
                        <select
                            className="block xl:w-full w-72 mt-1 -mb-4 xl:mb-0 rounded-md py-2.5 px-3 bg-[#B4C7ED0D] border-[#2668E826] border-2"
                            id="country-code"
                            onChange={handleCountryCodeChange}
                            value={selectedCountryCode}
                        >
                            <option value="">Select a country code</option>
                            {filteredCountryCodes.map((country, index) => (
                                <option key={index} value={country.value}>
                                    {country.label}
                                </option>
                            ))}
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


                {/* =================== */}

                <div className='xl:mt-3 xl:flex xl:justify-between'>
                    {/* <div >
                        <label className="block w-full mb-6">
                            <span className="text-[16px] font-[500] text-[black]">Country*</span>

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


                            {errors.country && <div className="  px-1 justify-start text-[red] flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.country}</div>}
                        </label>
                    </div> */}

                    {/* =============================== */}
                    <div className=' w-full'>
                        <label className=" w-full mb-6">
                            <span className="text-[16px] font-[500] text-[black]">Register as*</span>

                            <select
                                value={formData.register}
                                onChange={handleChange}

                                name="register"
                                placeholder='Select Category'
                                className="
            block
           w-full
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
                {formData.register === 'Company' &&
                    <> <h1 className="text-2xl font-semibold">Shop Information</h1>
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