import React from 'react'
import { Libre_Franklin } from 'next/font/google'
import Wrapper from '@/components/shared/Wrapper'
import Image from 'next/image'
import { RiArrowLeftRightLine } from 'react-icons/ri'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductApi from "@/lib/product";
import { ThreeDots } from 'react-loader-spinner'
import CartApi from '@/lib/cart'
import FavoriteApi from '@/lib/favorite';
import { notification } from 'antd'
import { getAuth } from "firebase/auth";


const Feature = () => {
  const [heart, setHeart] = useState(false);

  let userId
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    userId = user.uid
    console.log("USER ID ", userId);


  } catch (error) {
    console.log("USER ID ERROR", error);
  }
  const queryClient = useQueryClient();
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

  const getFeatured = async () => {

    const response = await ProductApi.getFeaturedProducts();
    return response;// Assuming your API returns data property

  };


  const queryKey2 = ['Products', 'featured'];
  const { data, isLoading, isError } = useQuery(
    [queryKey2],
    getFeatured
  );
  console.log("Featured", data)

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
    return <h1>Error</h1>
  }

  return (
    <div className={`  mt-20`}>
      <Wrapper>
        <div className='bg-[#D14D721A] rounded-md px-10 justify-center flex items-center flex-col py-10 '>
          <h1 className='text-[40px] font-[700] '>
            Feature Collection
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:mt-20 mt-32">
            {data.map((card, index) => (
              <div key={index} className='flex flex-col group justify-center items-center hover:-translate-y-3 ease-in duration-300 '>
                <div

                  className={`bg-white pt-5 h-[265px] cursor-pointer  w-[276px] rounded-md justify-center items-center ${index === 0 || index === 2 ? 'elevated' : 'lowered '
                    }`}
                >
                  {/* Card content */}
                  <Link href={`/product-details/${card.id}`}>
                    <Image src={card.file} alt='' width={1080} height={1080} className='m-auto max-w-[200px] max-h-[200px]' style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </Link>
                  <div className='flex gap-[1px] mt-10 itemsssssss opacity-0 group-hover:opacity-100 transition-all duration-300 '>
                    <button className='bg-[#2A2F4F] h-[45px] w-[51px] flex items-center justify-center bottom-0'>
                      <RiArrowLeftRightLine size={20} className='text-white' />
                    </button>
                    <div onClick={() => {
                      card['userId'] = userId;
                      card['productId'] = card.id;
                      addCartMutation.mutate(card)

                    }}>
                      <button className='bg-[#A51F6C] text-white h-[45px] w-[175px] flex items-center justify-center bottom-0 cursor-pointer'>
                        Add to Cart
                      </button>
                    </div>
                    <button className='bg-[#2A2F4F] h-[45px] w-[51px] flex items-center justify-center bottom-0'>
                      {heart ? (
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
                    </button>
                  </div>
                </div>
                <div className='flex justify-center items-center text-center font-[600] text-[16px]'>
                  <p className={`${index === 0 || index === 2 ? 'mt-9' : 'mt-9 '
                    }`}>{card.category}</p>
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
                  <p className={`w-[21px] h-[21px] border border-solid border-[2px] rounded-full`}
                    style={{ backgroundColor: `${card.color}` }}  >
                  </p>

                </div>
              </div>
            ))}
          </div>

        </div>
      </Wrapper>

    </div>
  )
}

export default Feature