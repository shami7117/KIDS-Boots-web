import React from 'react'
import { Libre_Franklin } from 'next/font/google'
import Wrapper from '@/components/shared/Wrapper'
import { RiArrowLeftRightLine } from 'react-icons/ri'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import Image from 'next/image'
import FilterSidebar from './FilterSlider'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import ListingModal from './ListingModal'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductApi from "@/lib/product";
import FavoriteApi from "@/lib/favorite";
import { getAuth } from "firebase/auth";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import CartApi from '@/lib/cart'
import 'react-notifications/lib/notifications.css';
import { ThreeDots } from 'react-loader-spinner'
import { useRouter } from 'next/router'
import { notification } from 'antd'

import { useSearch } from '../navbar/searchContext.js';




const ProductListing = () => {
  const router = useRouter();
  const { state } = useSearch();
  const { searchText, searchResults } = state;
  console.log("searchText", searchText, "searchResult", searchResults)




  // const handleSearch = async () => {

  //   const snapshot = collection(db, "Products");
  //   const searchTextLower = searchText.toLowerCase(); // Convert searchText to lowercase

  //   const querySnapshot = await getDocs(
  //     query(snapshot,
  //       where('product', '>=', searchTextLower), // Compare lowercase product names
  //       where('product', '<=', searchTextLower + '\uf8ff') // Compare lowercase product names
  //     )
  //   );

  //   const results = [];
  //   querySnapshot.forEach((doc) => {
  //     results.push(doc.data());
  //   });

  //   setSearchResults(results);


  // }

  const [Filter, setFilter] = useState({});
  const [heart, setHeart] = useState(false);


  const queryClient = useQueryClient();


  const addMutation = useMutation(
    ["FavoriteAdded"],
    async (data) => {
      console.log("MUTATION", data)
      return await FavoriteApi.addFavorite(data);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {

        queryClient.invalidateQueries(["FavoriteAdded"]);
      },
    }
  );

  const deleteMutation = useMutation(
    ["FavoriteAdded"],
    async (id) => {
      console.log("delte MUTATION", id)
      await FavoriteApi.deleteFavorite(id);
    },
    {
      onError: (data) => { },
      onSuccess: () => {
        queryClient.invalidateQueries(["FavoriteAdded"]);



      },
    }
  );



  let userId
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    userId = user.uid
    console.log("USER ID ", userId);


  } catch (error) {
    console.log("USER ID ERROR", error);
  }
  const updateMutation = useMutation(
    ["Products",],
    async (id) => {
      console.log("MUTATION", id)
      return await ProductApi.updateHeart(id);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {

        queryClient.invalidateQueries(["Products"]);
        // if (data?.code === 1) {
        //   NotificationManager.success("Added in Favorite successfully!");
        //   // router.push("/shopping");

        // } else {
        //   NotificationManager.info("Product is already available in Favorite");
        //   // router.push("/shopping");

        // }

      },
    }
  );

  const [data, setData] = useState([
    {
      img: '/images/shoe1.png',
      title: 'Mitchell Ponseti® AFO standard with Ponseti®',
      drop: '$100.00',
      price: '$120.00',
      color: 'D9D9D9',
      isHeartFilled: false,
    },
    {
      img: '/images/shoe2.png',
      title: 'Mitchell Ponseti® AFO standard with Ponseti®',
      drop: '$100.00',
      price: '$120.00',
      color: 'A51F6C',
      isHeartFilled: false,
    },
    {
      img: '/images/shoe3.png',
      title: 'Mitchell Ponseti® AFO standard with Ponseti®',
      drop: '$100.00',
      price: '$120.00',
      color: 'A0CEF8',
      isHeartFilled: false,
    },
    {
      img: '/images/shoe4.png',
      title: 'Mitchell Ponseti® AFO standard with Ponseti®',
      drop: '$100.00',
      price: '$120.00',
      color: 'D9D9D9',
      isHeartFilled: false,
    },
    {
      img: '/images/shoe1.png',
      title: 'Mitchell Ponseti® AFO standard with Ponseti®',
      drop: '$100.00',
      price: '$120.00',
      color: 'D9D9D9',
      isHeartFilled: false,
    },
    {
      img: '/images/shoe2.png',
      title: 'Mitchell Ponseti® AFO standard with Ponseti®',
      drop: '$100.00',
      price: '$120.00',
      color: 'A51F6C',
      isHeartFilled: false,
    },
    {
      img: '/images/shoe3.png',
      title: 'Mitchell Ponseti® AFO standard with Ponseti®',
      drop: '$100.00',
      price: '$120.00',
      color: 'A0CEF8',
      isHeartFilled: false,
    },
    {
      img: '/images/shoe4.png',
      title: 'Mitchell Ponseti® AFO standard with Ponseti®',
      drop: '$100.00',
      price: '$120.00',
      color: 'D9D9D9',
      isHeartFilled: false,
    },
    {
      img: '/images/shoe1.png',
      title: 'Mitchell Ponseti® AFO standard with Ponseti®',
      drop: '$100.00',
      price: '$120.00',
      color: 'D9D9D9',
      isHeartFilled: false,
    },
    {
      img: '/images/shoe2.png',
      title: 'Mitchell Ponseti® AFO standard with Ponseti®',
      drop: '$100.00',
      price: '$120.00',
      color: 'A51F6C',
      isHeartFilled: false,
    },
    {
      img: '/images/shoe3.png',
      title: 'Mitchell Ponseti® AFO standard with Ponseti®',
      drop: '$100.00',
      price: '$120.00',
      color: 'A0CEF8',
      isHeartFilled: false,
    },
    {
      img: '/images/shoe4.png',
      title: 'Mitchell Ponseti® AFO standard with Ponseti®',
      drop: '$100.00',
      price: '$120.00',
      color: 'D9D9D9',
      isHeartFilled: false,
    },
  ])

  const addCartMutation = useMutation(
    ["CartAdded"],
    async (data) => {
      console.log("MUTATION", data)
      return await CartApi.addCart(data);
    },
    {
      onError: (data) => { },
      onSuccess: (data) => {

        queryClient.invalidateQueries(["CartAdded"]);
        if (data?.code === 1) {
          notification.open({
            type: "success",
            message: "Added in Cart!",
            placement: "top",
          });
        } else {
          notification.open({
            type: "info",
            message: "Product is already available in cart",
            placement: "top",
          });

        }

      },
    }
  );

  // const itemsPerPage = 4;
  // const totalPosts = data.length;
  // const totalPages = Math.ceil(totalPosts / itemsPerPage);

  // const handlePrevious = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage((prevPage) => prevPage - 1);
  //   }
  // };

  // const handleNext = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage((prevPage) => prevPage + 1);
  //     window.scrollTo(0, 0);
  //   }
  // };

  // const handlePageChange = (page) => {
  //   if (page >= 1 && page <= totalPages) {
  //     setCurrentPage(page);
  //     window.scrollTo(0, 0);
  //   }
  // };

  // const posts = data.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );
  // const getPageNumbers = () => {
  //   const pages = [];
  //   const maxVisiblePages = data.length;

  //   let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  //   let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  //   if (totalPages - endPage < maxVisiblePages - 1) {
  //     startPage = Math.max(1, endPage - maxVisiblePages + 1);
  //   }

  //   for (let i = startPage; i <= endPage; i++) {
  //     pages.push(i);
  //   }

  //   return pages;
  // };


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const updateValue = (newValue) => {

    setFilter(newValue);
    // console.log("NEW VALUE", newValue)
  };
  console.log("NEW VALUE", Filter)



  // Access the query parameter named "afo"
  const afoQueryParam = router?.query?.category;
  const country = router?.query?.country;
  console.log("CATEGORY", afoQueryParam)


  if (afoQueryParam !== undefined && Filter?.category !== null) {

    Filter.category = afoQueryParam;
  }

  if (country !== undefined && country !== null) {
    Filter.country = country
  }

  const { data: BootsData, isLoading: BootsLoading, isError } = useQuery(
    ['Products', Filter, currentPage],
    async () => {

      const response = await ProductApi.getCategoryWiseProducts(Filter, currentPage);
      return response;// Assuming your API returns data property

    }
  );
  console.log("PRODUCTS", BootsData)
  console.log("FILTER", Filter)


  // if (isLoading) {
  //   return <h1>Loading...</h1>
  // }
  if (isError) {
    return <h1>Error</h1>
  }


  return (
    <div>
      <NotificationContainer />

      <div className='flex flex-col md:flex-row justify-center  gap-20'>
        {/* left  */}
        <div className='flex flex-col justify-start items-start md:basis-[20%] '>
          <div className='flex flex-col justify-center items-center my-3'>
            <p className='text-[16px] font-[500]'>Didn't find what you're looking for? </p>
            <button className='flex justify-center items-center mt-3 py-3 px-6 bg-primary-pink-color rounded-md text-white ' onClick={handleModalOpen} >Get Updates</button>

          </div>
          <FilterSidebar updateValue={updateValue} />
        </div>


        {/* right  */}



        <div className='flex flex-col justify-start items-center md:basis-[80%]'>


          {


            BootsData?.length === 0 ? (
              <h1 className='flex justify-center items-center text-center text-[20px]'>Not Found any Product</h1>
            ) :
              BootsLoading ? <div className="flex h-[100vh] justify-center items-center"> <ThreeDots
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
                : (<div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
                  {
                    searchResults.length > 0 && searchText !== '' ? searchResults?.map((card) => {
                      return <div key={card.id} className='group flex flex-col justify-center items-center'>
                        <div className='bg-[#d9d9d9b5] cursor-pointer pt-5 w-[276px] rounded-md justify-center items-center'>
                          <Link href={`/product-details/${card.id}`}>
                            <Image src={card?.file} alt='' width={200} height={200} className='m-auto w-[200px] h-[200px]' />
                          </Link>
                          <div className='flex gap-[1px] mt-10 items-opacity-0 group-hover:opacity-100 transition-all duration-300'>
                            <div className='bg-[#2A2F4F] h-[45px] w-[51px] flex items-center justify-center bottom-0'>
                              <RiArrowLeftRightLine size={20} className='text-white' />
                            </div>

                            <button onClick={() => {
                              card['userId'] = userId;
                              card['productId'] = card.id;
                              addCartMutation.mutate(card)

                            }} className='bg-[#A51F6C] text-white h-[45px] w-[175px] flex items-center justify-center bottom-0'>
                              Add to Cart
                            </button>

                            <div className='bg-[#2A2F4F] h-[45px] w-[51px] flex items-center justify-center bottom-0'>
                              {card.isHeartFilled ? (
                                <AiFillHeart
                                  size={20}
                                  className='text-[red] cursor-pointer'
                                  onClick={() => {
                                    setHeart(false)
                                    console
                                    updateMutation.mutate(card.id)
                                    deleteMutation.mutate(card.id)

                                  }}
                                />
                              ) : (
                                <AiOutlineHeart
                                  size={20}
                                  className='text-white cursor-pointer'
                                  onClick={() => {
                                    setHeart(true)
                                    updateMutation.mutate(card.id)

                                    data['userId'] = userId
                                    addMutation.mutate(card)

                                  }
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className='flex w-[276px] justify-center items-center text-center font-[600] text-[16px]'>
                          <p className='mt-2 uppercase'>{card.product} ( {card.category})</p>
                        </div>
                        <div className='flex gap-3 my-1 items-center'>
                          <span className='text-[#707070] text-xs line-through'>${card.price}</span>
                          <span className='text-primary-pink-color text-[18px] font-[500]'>
                            ${card.price}
                          </span>
                        </div>
                        <div>
                          <p className='text-[#777777] font-[500] text-[16px]'>Available Colors</p>
                        </div>
                        <div className='flex justify-center items-center mt-2'>
                          <p
                            className='w-[21px] h-[21px] border border-solid border-[2px] rounded-full'
                            style={{ backgroundColor: `${card.color}` }}
                          ></p>
                        </div>
                      </div>
                    }) :
                      searchResults.length === 0 && searchText !== '' ?
                        <h1>No result found</h1> : BootsData?.map((card) => {

                          return <div key={card.id} className='group flex flex-col justify-center items-center'>
                            <div className='bg-[#d9d9d9b5] cursor-pointer pt-5 w-[276px] rounded-md justify-center items-center'>
                              <Link href={`/product-details/${card.id}`}>
                                <Image src={card?.file} alt='' width={200} height={200} className='m-auto w-[200px] h-[200px]' />
                              </Link>
                              <div className='flex gap-[1px] mt-10 items-opacity-0 group-hover:opacity-100 transition-all duration-300'>
                                <div className='bg-[#2A2F4F] h-[45px] w-[51px] flex items-center justify-center bottom-0'>
                                  <RiArrowLeftRightLine size={20} className='text-white' />
                                </div>

                                <button onClick={() => {
                                  card['userId'] = userId;
                                  card['productId'] = card.id;
                                  addCartMutation.mutate(card)

                                }} className='bg-[#A51F6C] text-white h-[45px] w-[175px] flex items-center justify-center bottom-0'>
                                  Add to Cart
                                </button>

                                <div className='bg-[#2A2F4F] h-[45px] w-[51px] flex items-center justify-center bottom-0'>
                                  {card.isHeartFilled ? (
                                    <AiFillHeart
                                      size={20}
                                      className='text-[red] cursor-pointer'
                                      onClick={() => {
                                        setHeart(false)
                                        console
                                        updateMutation.mutate(card.id)
                                        deleteMutation.mutate(card.id)

                                      }}
                                    />
                                  ) : (
                                    <AiOutlineHeart
                                      size={20}
                                      className='text-white cursor-pointer'
                                      onClick={() => {
                                        setHeart(true)
                                        updateMutation.mutate(card.id)

                                        data['userId'] = userId
                                        addMutation.mutate(card)

                                      }
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className='flex w-[276px] justify-center items-center text-center font-[600] text-[16px]'>
                              <p className='mt-2 uppercase'>{card.product} ( {card.category})</p>
                            </div>
                            <div className='flex gap-3 my-1 items-center'>
                              <span className='text-[#707070] text-xs line-through'>${card.price}</span>
                              <span className='text-primary-pink-color text-[18px] font-[500]'>
                                ${card.price}
                              </span>
                            </div>
                            <div>
                              <p className='text-[#777777] font-[500] text-[16px]'>Available Colors</p>
                            </div>
                            <div className='flex justify-center items-center mt-2'>
                              <p
                                className='w-[21px] h-[21px] border border-solid border-[2px] rounded-full'
                                style={{ backgroundColor: `${card.color}` }}
                              ></p>
                            </div>
                          </div>
                        })
                  }
                </div>)

          }


          <ListingModal isOpen={isModalOpen} onClose={handleModalClose} />
          {/* Pagination */}

          <div className="flex mx-auto justify-center items-center mt-[3rem] space-x-2 mb-[4rem]">

            <button
              onClick={handlePrevPage}
              className={`px-3 py-3 rounded 
           bg-[#a51f6c] 
               hover:bg-white border border-[#D9D9D9]
                  
                }
                `}
            >
              <MdKeyboardArrowLeft size={20} className={`text-[#D9D9D9]
              
                }`} />
            </button>



            <button
              onClick={handleNextPage}
              className={`px-3 py-3 rounded 
           bg-[#a51f6c] 
               hover:bg-white border border-[#D9D9D9]
                  
                }
                `}
            >
              <MdKeyboardArrowRight size={20} className={`text-[#D9D9D9]
              
                }`} />
            </button>

          </div>


        </div>

      </div>


    </div >
  )
}

export default ProductListing