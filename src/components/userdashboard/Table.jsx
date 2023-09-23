"use client";

import {
    Button,
    Input,
    Pagination,
    Checkbox,
    Space,
    Modal,
    message,
    Dropdown,
    Menu,
    Form,
    Select, notification
} from "antd";
import Image from "next/image";
import Head from "next/head";
import { ThreeDots } from 'react-loader-spinner'

import { SearchOutlined, DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import EditModal from "./promoEdit";
const { Option } = Select;
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PromoCodeApi from "@/lib/promo";
import firebase from '../../../Firebase/firebase'; // Import your Firebase configuration.
import {
    collection,
    addDoc, doc, getDoc, setDoc, where, query, getDocs
} from "firebase/firestore";
import { auth, db } from "../../../Firebase/firebase.js";
import BuyerModal from "./promoModal";

const Index = () => {
    const ITEMS_PER_PAGE = 5;



    let userId

    try {
        const user = auth.currentUser;
        userId = user.uid
    } catch (error) {
        console.log(error)
    }


    const queryClient = useQueryClient();

    const deleteMutation = useMutation(
        ["Promo"],
        async (id) => {
            console.log("MUTATION", id)
            await PromoCodeApi.deletePromo(id);
        },
        {
            onError: (data) => { },
            onSuccess: () => {
                notification.open({
                    type: "success",
                    message: "PromoCode deleted successfully!",
                    placement: "top",
                });
                queryClient.invalidateQueries(["Promo"]);
                setShowDeleteConfirmationModal(false)
                setEditModalVisible(false)
            },
        }
    );

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);




    const { data, isLoading, isError } = useQuery(
        ['Promo'],
        async () => {

            const response = await PromoCodeApi.getPromoById(userId);
            return response;// Assuming your API returns data property

        }

    );
    const { data: AllDATA, isLoading: AllLoading, isError: ALLERROR } = useQuery(
        ['PromoCode'],
        async () => {

            const response = await PromoCodeApi.getAllPromoCodes();
            return response;// Assuming your API returns data property

        }

    );


    const PromoCodes = [
        {
            id: 1,
            image: "/images/PromoCode1.svg",
            name: "James Wiliams",
            registered: "Aug 06,2023",
            country: "USA",
            group: "Default",
            spent: 14676.00,
        },
        {
            id: 2,
            image: "/images/PromoCode2.svg",
            name: "John Doe",
            registered: "Aug 06,2023",
            country: "USA",
            group: "Default",
            spent: 14676.00,
        },
        {
            id: 3,
            image: "/images/PromoCode3.svg",
            name: "Steve Smith",
            registered: "Aug 06,2023",
            country: "USA",
            group: "Default",
            spent: 14676.00,
        },
        {
            id: 4,
            image: "/images/PromoCode4.svg",
            name: "James Anderson",
            registered: "Aug 06,2023",
            country: "USA",
            group: "Default",
            spent: 14676.00,
        },
        {
            id: 5,
            image: "/images/PromoCode1.svg",
            name: "Steve Smith",
            registered: "Aug 06,2023",
            country: "USA",
            group: "Default",
            spent: 14676.00,
        },
        {
            id: 6,
            image: "/images/PromoCode2.svg",
            name: "John Doe",
            registered: "Aug 06,2023",
            country: "USA",
            group: "Default",
            spent: 14676.00,
        },
        {
            id: 7,
            image: "/images/PromoCode3.svg",
            name: "James Anderson",
            registered: "Aug 06,2023",
            country: "USA",
            group: "Default",
            spent: 14676.00,
        },
        {
            id: 8,
            image: "/images/PromoCode4.svg",
            name: "James Anderson",
            registered: "Aug 06,2023",
            country: "USA",
            group: "Default",
            spent: 14676.00,
        },
        {
            id: 9,
            image: "/images/PromoCode1.svg",
            name: "James Anderson",
            registered: "Aug 06,2023",
            country: "USA",
            group: "Default",
            spent: 14676.00,
        },
    ];

    const [selectedPromoCodeId, setSelectedPromoCodeId] = useState(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [activeButton, setActiveButton] = useState("All");
    const [filteredPromoCodes, setFilteredPromoCodes] = useState(PromoCodes);
    const [sortByDate, setSortByDate] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
        useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm] = Form.useForm();
    const [selectedPromoCode, setSelectedPromoCode] = useState(null);
    const [selectAll, setSelectAll] = useState(false);

    const handleDeleteConfirmation = () => {
        setShowDeleteConfirmationModal(true);
    };

    const handleDeleteConfirmed = () => {
        const updatedPromoCodes = PromoCodes.filter(
            (PromoCode) => !selectedPromoCodeIds.includes(PromoCode.id),
        );
        setFilteredPromoCodes(updatedPromoCodes);
        setSelectedPromoCodeIds([]);
        setShowDeleteConfirmationModal(false);

        message.success("Selected PromoCode deleted successfully.");
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPromoCodeIds, setSelectedPromoCodeIds] = useState([]);

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCheckboxChange = (productId) => {
        setFilteredPromoCodes((prevProducts) => {
            const updatedProducts = prevProducts.map((product) =>
                product.id === productId
                    ? { ...product, selected: !product.selected }
                    : product,
            );

            const updatedSelectedIds = updatedProducts
                .filter((product) => product.selected)
                .map((product) => product.id);

            setSelectedPromoCodeIds(updatedSelectedIds);

            return updatedProducts;
        });
    };

    const handleActionsToggle = (PromoCodeId) => {
        setSelectedPromoCodeId(null);

        setSelectedPromoCodeId(PromoCodeId);
        const PromoCode = data?.find((b) => b.id === PromoCodeId);
        setSelectedPromoCode(PromoCode);
    };

    const handleEditSubmit = ({
        image: fileListImage,
        group,
        spent,
        ...values
    }) => {
        const numericSpent = parseFloat(spent);

        if (isNaN(numericSpent)) {
            message.error("Invalid spent value");
            return;
        }

        const updatedPromoCodes = filteredPromoCodes.map((PromoCode) =>
            PromoCode.id === selectedPromoCode.id
                ? {
                    ...PromoCode,
                    ...values,
                    image: fileListImage,
                    group,
                    spent: numericSpent,
                }
                : PromoCode
        );

        setFilteredPromoCodes(updatedPromoCodes);
        setEditModalVisible(false);

        message.success("PromoCode updated successfully.");
    };

    const handleEditModalOpen = (PromoCode) => {
        setSelectedPromoCode(PromoCode);
        // setShowActions(false);
        // const registeredDate = moment(PromoCode.registered, 'MMM DD,YYYY');

        editForm.setFieldsValue({
            firstName: PromoCode.firstName,
            lastName: PromoCode.lastName,
            region: PromoCode.region,
            city: PromoCode.city,
            email: PromoCode.email,
            phone: PromoCode.phone,
            address: PromoCode.address,
            postCode: PromoCode.postCode,
        });

        setEditModalVisible(true);
    };


    const handleDeleteEach = (promoID) => {
        setSelectedPromoCodeId(promoID);

        handleDeleteConfirmation();
    };
    console.log("ID", selectedPromoCodeId)

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const handlePromoCodeModal = () => {
        setShowCustomerModal(true)
        console.log(showCustomerModal)
    }


    const handleHeaderCheckboxChange = () => {
        const newSelectAll = !selectedPromoCodeIds.length || selectedPromoCodeIds.length !== filteredPromoCodes.length;
        const updatedPromoCodes = filteredPromoCodes.map((PromoCode) => ({
            ...PromoCode,
            selected: newSelectAll,
        }));
        setFilteredPromoCodes(updatedPromoCodes);
        setSelectedPromoCodeIds(newSelectAll ? PromoCodes.map((PromoCode) => PromoCode.id) : []);
    };
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
        // Handle the error, e.g., display an error message
        return <div>Error fetching data</div>;
    }



    return (
        <div className="w-full h-full bg-[F9F9F9] px-4 ">
            <Head>
                <title>PromoCodes</title>
            </Head>
            <div className="h-full w-full my-4 py-3  bg-[#FFFFFF] rounded-md">
                <div className="w-full  px-3  py-1 border-b border-[#DFDFDF]">
                    <div className="flex justify-end items-center w-full px-3 pb-4 flex-wrap-reverse">
                        {/* <div className="relative flex items-center w-full sm:w-auto">
                            <Image
                                src="/images/search.svg"
                                className="text-gray-500 absolute top-[13px] left-4 z-10"
                                width={15}
                                height={15}
                            />
                            <Input
                                placeholder="Search promos..."
                                className={` fontFamily pl-10 py-2 text-[#777777]`}
                                style={{ borderRadius: "5px" }}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <div className="flex items-center w-full sm:w-auto">
                                <Button
                                    type="primary"
                                    className="create-order-button ml-2 w-full sm:w-auto  sm:mb-0"
                                    onClick={handleSearch}
                                    style={{
                                        backgroundColor: "#A51F6C",
                                        color: "#FFFFFF",
                                        borderRadius: "8px",
                                        height: "40px",
                                    }}
                                >
                                    Search
                                </Button>
                            </div>
                        </div> */}
                        <div className="flex items-center w-full sm:w-auto">
                            <Button
                                type="primary"
                                className="create-order-button w-full sm:w-auto mb-4 sm:mb-0"
                                onClick={handlePromoCodeModal}
                                style={{
                                    backgroundColor: "#A51F6C",
                                    color: "#FFFFFF",
                                    borderRadius: "8px",
                                    height: "45px",
                                }}>
                                Add PromoCode
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    {/* Table */}
                    <div className="w-full h-full  px-5 py-4 ">

                        <table
                            className="w-full hidden lg:table border border-[#DFDFDF] "
                            style={{ borderRadius: "30px" }}>
                            <thead className="my-3 fontFamily border-b border-[DFDFDF] uppercase">
                                <tr className="text-[#777777] text-left px-4 py-2">

                                    <th className=" font-[500] text-center text-sm md:text-[14px]">
                                        Promo Code
                                    </th>
                                    <th className=" font-[500] text-center text-sm md:text-[14px]">
                                        Products
                                    </th>
                                    <th className="px-3 font-[500] text-center py-4 mx-2 text-sm md:text-[14px]">
                                        Times
                                    </th>


                                    <th className="font-[500] text-center text-sm md:text-[14px]">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {searchResults.length > 0 ? searchResults?.map((promo) => (
                                    <tr
                                        key={promo?.id}
                                        className={`hover:bg-gray-200 border-b border-[DFDFDF] ${promo.selected ? "bg-[#F4F4F4]" : ""
                                            }`}
                                    >

                                        {/* promo Image */}
                                        <td className="">
                                            <div className="flex justify-center items-center ml-[10%]">

                                                <p className="text-[#110F0F] text-[14px]">
                                                    {promo?.promo}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="font-[400] text-center">
                                            <p className="text-[#110F0F] text-[14px]">
                                                {promo?.products?.map((product) => {
                                                    var parts = product.split(',');
                                                    var firstValue = parts[0];
                                                    return <p>{firstValue},</p>
                                                })}
                                            </p>
                                        </td>

                                        <td className="">
                                            <div className="flex justify-center items-center ml-[10%]">

                                                <p className="text-[#110F0F] text-[14px]">
                                                    {promo?.time}
                                                </p>
                                            </div>
                                        </td>





                                        {/* Actions */}
                                        <td className="flex justify-around items-center">
                                            <Dropdown
                                                overlay={
                                                    <Menu>
                                                        <Menu.Item
                                                            onClick={() => handleEditModalOpen(promo)}
                                                        >
                                                            <EditOutlined /> Edit
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            onClick={() => { handleDeleteEach(promo?.id) }}
                                                            className="delete-option"
                                                        >
                                                            <DeleteOutlined /> Delete
                                                        </Menu.Item>
                                                    </Menu>
                                                }
                                                trigger={["click"]}
                                                placement="bottomRight"
                                            // visible={selectedpromoId === promo.id}
                                            // onVisibleChange={(visible) => {
                                            //   if (!visible) {
                                            //     setSelectedpromoId(null);
                                            //   }
                                            // }}
                                            >
                                                <Button
                                                    icon={<MoreOutlined />}
                                                    className="more-button"
                                                    onClick={() => handleActionsToggle(promo.id)}
                                                />
                                            </Dropdown>
                                        </td>
                                    </tr>
                                )) : data.length > 0 ? data?.map((promo) => (
                                    <tr
                                        key={promo?.id}
                                        className={`hover:bg-gray-200 border-b border-[DFDFDF] ${promo.selected ? "bg-[#F4F4F4]" : ""
                                            }`}
                                    >

                                        {/* promo Image */}
                                        <td className="">
                                            <div className="flex justify-center items-center ml-[10%]">

                                                <p className="text-[#110F0F] text-[14px]">
                                                    {promo?.promo}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="font-[400] text-center">
                                            <p className="text-[#110F0F] text-[14px]">
                                                {promo?.products?.map((product) => {
                                                    var parts = product.split(',');
                                                    var firstValue = parts[0];
                                                    return <p>{firstValue},</p>
                                                })}
                                            </p>
                                        </td>
                                        <td className="">
                                            <div className="flex justify-center items-center ml-[10%]">

                                                <p className="text-[#110F0F] text-[14px]">
                                                    {promo?.time}
                                                </p>
                                            </div>
                                        </td>



                                        {/* Actions */}
                                        <td className="flex justify-around items-center">
                                            <Dropdown
                                                overlay={
                                                    <Menu>
                                                        <Menu.Item
                                                            onClick={() => handleEditModalOpen(promo)}
                                                        >
                                                            <EditOutlined /> Edit
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            onClick={() => { handleDeleteEach(promo?.id) }}
                                                            className="delete-option"
                                                        >
                                                            <DeleteOutlined /> Delete
                                                        </Menu.Item>
                                                    </Menu>
                                                }
                                                trigger={["click"]}
                                                placement="bottomRight"
                                            // visible={selectedpromoId === promo.id}
                                            // onVisibleChange={(visible) => {
                                            //   if (!visible) {
                                            //     setSelectedpromoId(null);
                                            //   }
                                            // }}
                                            >
                                                <Button
                                                    icon={<MoreOutlined />}
                                                    className="more-button"
                                                    onClick={() => handleActionsToggle(promo.id)}
                                                />
                                            </Dropdown>
                                        </td>

                                    </tr>
                                )) : <h1>No Promo Available</h1>}
                            </tbody>
                        </table>
                        <div className="lg:hidden flex flex-col space-y-4">
                            {data.length > 0 ? data.slice(startIndex, endIndex).map((PromoCode) => (
                                <div
                                    key={PromoCode.id}
                                    className="bg-white rounded-md border border-grey-500 shadow-md my-5 py-3 px-4 flex flex-col">
                                    <div className="flex justify-between items-center border-b border-[#A51F6C] pb-3 w-full">
                                        <div className="flex items-center">
                                            {/* <div className="w-20 h-20 rounded-md overflow-hidden  flex items-center justify-center">
                        <Image
                          src={PromoCode.image}
                          width={80}
                          height={80}
                          alt="Product"
                        />
                      </div> */}
                                            <div className="ml-4">
                                                <h3 className="font-semibold text-base">PromoCode Id: {PromoCode.id}</h3>
                                                <h3 className="font-semibold text-base">Promo Code: {PromoCode.promo}</h3>
                                            </div>
                                        </div>
                                        <Dropdown
                                            overlay={
                                                <Menu>
                                                    <Menu.Item onClick={() => handleEditModalOpen(PromoCode)}>
                                                        <EditOutlined /> Edit
                                                    </Menu.Item>
                                                    <Menu.Item onClick={() => { handleDeleteEach(PromoCode.id) }} className="delete-option">
                                                        <DeleteOutlined /> Delete
                                                    </Menu.Item>
                                                </Menu>
                                            }
                                            trigger={["click"]}
                                            placement="bottomRight"
                                            visible={selectedPromoCodeId === PromoCode.id}
                                            onVisibleChange={(visible) => {
                                                if (!visible) {
                                                    // setSelectedPromoCodeId(null);
                                                }
                                            }}>
                                            <Button icon={<MoreOutlined />} className="more-button rounded-full border border-[#A51F6C]" onClick={() => handleActionsToggle(PromoCode.id)} />
                                        </Dropdown>
                                    </div>

                                    <div className="flex items-center justify-between border-b border-[#A51F6C] pb-3 mt-3 w-full px-[6%] sm:px-auto">
                                        {/* <div className="mr-[30%]">
                                            <h3 className="font-semibold text-base">Status:</h3>
                                            <p className="text-base">{PromoCode.status}</p>
                                        </div> */}
                                        <div>
                                            <h3 className="font-semibold text-base">Times:</h3>
                                            <p className="text-base">{PromoCode.time}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pb-3 mt-3 w-full px-[6%] sm:px-auto">
                                        <div>
                                            <p className="font-semibold text-lg">Products</p>
                                            <p className="font-[600] text-blue-600 text-lg">{PromoCode.products[0]}</p>
                                        </div>


                                    </div>

                                </div>
                            )) : <h1>No Promo available</h1>}
                            <Pagination
                                current={currentPage}
                                pageSize={ITEMS_PER_PAGE}
                                total={filteredPromoCodes.length}
                                onChange={onPageChange}
                                className="my-4 flex justify-center"
                            />
                        </div>

                    </div>
                </div>

                <BuyerModal
                    visible={showCustomerModal}
                    onCancel={() => setShowCustomerModal(false)}
                    onSubmit={() => {
                        setShowCustomerModal(false)
                        message.success("PromoCode Added!")
                    }
                    }
                />

                <EditModal
                    visible={editModalVisible}
                    onCancel={() => setEditModalVisible(false)}
                    onOk={({ image: fileListImage, status, ...values }) =>
                        handleEditSubmit({ image: fileListImage, status, ...values })
                    }
                    editForm={editForm}
                    selectedPromoCode={selectedPromoCode}
                />




                <Modal
                    title="Confirm Deletion"
                    visible={showDeleteConfirmationModal}
                    onCancel={() => setShowDeleteConfirmationModal(false)}
                    onOk={() => { console.log("DELETE", selectedPromoCodeId); deleteMutation.mutate(selectedPromoCodeId) }} okText="Yes"
                    cancelText="No"
                    okButtonProps={{
                        style: { backgroundColor: "#D83535", color: "#FFFFFF" },
                    }}>
                    <p>Are you sure you want to delete the selected PromoCode?</p>
                </Modal>

            </div>
        </div>

    );
};

export default Index;
