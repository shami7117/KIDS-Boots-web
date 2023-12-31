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
import UserApi from "@/lib/buyer.js";
const ProfilePage = () => {

  let userId
  let user
  try {
    user = auth.currentUser;
    userId = user.uid
  } catch (error) {
    console.log(error)
  }

  const deleteUser = async () => {

    // Delete the user by UID
    const user = auth.currentUser; // Get the currently signed-in user
    if (user) {
      user
        .delete()
        .then(() => {
          // User account has been deleted
          notification.open({
            type: "success",
            message: "Account  deleted successfully",
            placement: "top",
          });
        })
        .catch((error) => {
          // An error occurred
          console.error('Error deleting user account:', error);
        });
    }


  };
  const queryClient = useQueryClient();
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


  const updateSellerMutation = useMutation(
    ["Sellers"],
    async ({ id, seller }) => {
      console.log("MUTATION", seller)
      await SellerApi.updateSeller(id, seller);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {
        notification.open({
          type: "success",
          message: "Profile has been updated successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Sellers"]);
        onCancel();

      },
    }
  );

  const updateBuyerMutation = useMutation(
    ["Buyers"],
    async ({ id, Buyer }) => {
      console.log("MUTATION", Buyer)
      await UserApi.updateUser(id, Buyer);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {
        notification.open({
          type: "success",
          message: "Buyer been updated successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Buyer"]);
        onCancel();

      },
    }
  );

  const [searchText, setSearchText] = useState('');

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
  const filteredCountryCodes = countryCodes.filter((country) =>
    country.label.toLowerCase().includes(searchText.toLowerCase())
  );
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


  const [filteredCountries, setFilteredCountries] = useState(countries);
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


  const deleteSellerMutation = useMutation(
    ["Sellers"],
    async (id) => {
      console.log("MUTATION", id)
      await SellerApi.deleteSeller(id);
    },
    {
      onError: (data) => { },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "Seller deleted successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Sellers"]);
        setShowDeleteConfirmationModal(false)
        setEditModalVisible(false)
      },
    }
  );

  const deleteBuyerMutation = useMutation(
    ["Buyers"],
    async (id) => {
      console.log("MUTATION", id)
      await BuyerApi.deleteUser(id);
    },
    {
      onError: (data) => { },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: "Buyer deleted successfully!",
          placement: "top",
        });
        queryClient.invalidateQueries(["Buyers"]);
        setShowDeleteConfirmationModal(false)
        setEditModalVisible(false)
      },
    }
  );
  const { data, isLoading, isError } = useQuery(
    ['Sellers', userId],
    async () => {

      const response = await SellerApi.getUserByUserId(userId);
      return response;// Assuming your API returns data property

    }
  );
  const { data: BuyerData, isLoading: BuyerLoading, isError: BuyerError } = useQuery(
    ['Buyers', userId],
    async () => {

      const response = await BuyerApi.getUserByUserId(userId);
      return response;// Assuming your API returns data property

    }
  );
  const [isUser, setUser] = useState(false)

  const [formData, setFormData] = useState({
    firstName: isUser ? data?.firstName : BuyerData?.firstName,
    lastName: isUser ? data?.lastName : BuyerData?.lastName,
    email: isUser ? data?.email : BuyerData?.email,
    phone: isUser ? data?.phone : BuyerData?.phone,
    country: isUser ? data?.country : BuyerData?.country,
    register: isUser ? data?.register : BuyerData?.register,
    address: isUser ? data?.address : BuyerData?.address,
  });

  const handleDelete = () => {
    if (data !== null) {
      deleteSellerMutation.mutate(data?.id)
      logOut();
      deleteUser()
    }
    else {
      deleteBuyerMutation.mutate(BuyerData?.id)
      logOut();
      deleteUser()

    }
  }

  console.log("SELLER", data)
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    address: Yup.string().required('Address is required'),

  });

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
          country: selectedCountry,
          phone: formData.phone,
          register: formData?.register,
          address: formData.address
        };

        updateSellerMutation.mutate({ id: userId, seller: values })


      }
      else {
        await validationSchemaBuyer.validate(formData, { abortEarly: false });
        console.log('Form data is valid:', formData);
        setLoading(true);
        const values = {
          firstName: formData.firstName,
          email: formData.email,
          lastName: formData.lastName,
          country: selectedCountry,
          phone: formData.phone,
          address: formData.address
        };
        updateBuyerMutation.mutate({
          id: userId,
          Buyer: values,
          // slug,
        })
      }



      setErrors({});



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

  useEffect(() => {
    if (data !== null) {
      setUser(true)
    }
    else {
      setUser(false)
    }
  })

  if (isLoading) {
    return <div className="flex justify-center items-center"> <ThreeDots
      height="150"
      width="150"
      radius="9"
      color="#A51F6C" ariaLabel="three-dots-loading"
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
      color="#A51F6C" ariaLabel="three-dots-loading"
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

            <h1 className="font-semibold mt-4 text-[18px]">{isUser ? data.firstName : BuyerData?.firstName} {isUser ? data.lastName : BuyerData?.lastName}  </h1>
            <h1 className="font-normal mt-1 text-[#777777]">Businessmen</h1>
            <div className="flex gap-2">
              <Image
                src={"/images/location.svg"}
                width={10}
                height={10}
                alt="dd"
              ></Image>
              <h1 className="font-normal mt-1 text-[#1A9CDA]">{isUser ? data.country : BuyerData?.country}  </h1>
            </div>
            <div className="mt-0 w-full mt-0 flex flex-col gap-y-2 mt-1 ">
              <button onClick={logOut} className="w-full bg-[#1A9CDA] text-white py-2 rounded-[5px] text-[16px] font-[500]">
                Log Out
              </button>
              <button onClick={handleDelete} className="w-full border py-2  bg-[#A51F6C] text-white rounded-[5px] text-[16px] font-[500]">
                Delete Account
              </button>
            </div>
          </div>
          <div className="w-full flex flex-grow flex-1 flex-wrap mt-2 md:mt-4">
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
                <p className="md:text-[14px] text-[12px]  font-[400]">{isUser ? data.email : BuyerData?.email}</p>
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
                <p className="md:text-[14px] text-[12px] font-[400]">{isUser ? data.phone : BuyerData?.phone}</p>
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
                  {isUser ? data.address : BuyerData?.address}               </p>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-full  mt-5 md:mt-0 md:w-full md:flex-row flex flex-col ">
          <div className="w-full   px-6 ">
            <form className=" border-b border-[#DFDFDF] px-6 pb-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    htmlFor="phone"
                    className="text-[16px] font-normal text-[#777777]"
                  >
                    Select Country Code
                  </label>
                  <select
                    className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
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
                  <label htmlFor="full-number" className="text-[16px] font-normal text-[#777777]"
                  >Enter Full Number:</label>
                  <input
                    placeholder='Phone Number'
                    type="text"
                    id="phone"
                    name='phone'
                    className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"

                    value={formData.phone}
                    readOnly={!selectedCountryCode}
                    onChange={handleChange}

                  />
                  {errors.phone && <div className="  px-1 justify-start text-[red] max-w-[100px] w-full flex items-center  whitespace-nowrap rounded-lg  text-[black] mb-1 mt-1  mt-0">{errors.phone}</div>}
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

                {/* <div>
                  <label
                    htmlFor="country"
                    className="text-[16px] font-normal text-[#777777]"
                  >
                    Country
                  </label>
                  <select name='country'
                    id='country'
                    className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"

                    value={searchText !== '' ? searchText : formData.country}
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
                      id="register"
                      name="register"
                      value={formData.register}
                      onChange={handleChange}
                      className="w-full py-2 px-3 border border-[#2668E81A] rounded transition duration-300 bg-[#2668E803] focus:outline-none focus:border-[#2668E855] hover:border-[#2668E855]"
                    >
                      <option value="">Select Category</option>
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
