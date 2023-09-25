import React from 'react'
import { Libre_Franklin } from 'next/font/google'
import Wrapper from '@/components/shared/Wrapper'
import { RiArrowLeftRightLine } from 'react-icons/ri'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
const font = Libre_Franklin({ subsets: ['latin'] })
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductApi from "@/lib/product";
import { ThreeDots } from 'react-loader-spinner'
import CartApi from '@/lib/cart'
import FavoriteApi from '@/lib/favorite';
import { notification } from 'antd'
import { getAuth } from "firebase/auth";

const Popular = () => {

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
  const getPopular = async () => {

    const response = await ProductApi.getPopularProducts();
    return response;// Assuming your API returns data property

  }
  const queryKey1 = ['Products', 'popular'];
  const { data, isLoading, isError } = useQuery(
    [queryKey1],
    getPopular
  );
  console.log("Popular", data)

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
    <div className={`${font.className} my-10`}>
      <Wrapper>
        <div className='flex flex-col justify-center items-center pt-10'>
          <h1 className='text-[40px] font-[700] '>
            Popular Collection
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-10">
            {data.map((card, index) => (
              <div key={index} className=' group flex flex-col justify-center items-center hover:-translate-y-3 ease-in duration-300'>
                <div

                  className={`bg-[#d9d9d9b5] pt-5 cursor-pointer  w-[276px] rounded-md justify-center items-center `}
                >
                  {/* Card content */}
                  <Link href={`/product-details/${card.id}`}>
                    <Image src={card.file} alt='' width={1080} height={1080} className='m-auto w-[200px] h-[200px] object-contain' />
                  </Link>
                  <div className='flex gap-[1px] mt-10 itemsssssss opacity-0 group-hover:opacity-100 transition-all duration-300 '>
                    <div className='bg-[#2A2F4F] h-[45px] w-[51px] flex items-center justify-center bottom-0'>
                      <RiArrowLeftRightLine size={20} className='text-white' />
                    </div>
                    <div onClick={() => {
                      card['userId'] = userId;
                      card['productId'] = card.id;
                      addCartMutation.mutate(card)

                    }}>
                      <button className='bg-[#A51F6C] text-white h-[45px] w-[175px] flex items-center justify-center bottom-0'>
                        Add to Cart
                      </button>
                    </div>
                    <div className='bg-[#2A2F4F] h-[45px] w-[51px] flex items-center justify-center bottom-0'>
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
                    </div>
                  </div>
                </div>
                <div className='flex justify-center items-center text-center font-[600] text-[16px]'>
                  <p className='mt-2'>{card.category}</p>
                </div>
                <div className='flex gap-3 my-1 items-center'>
                  <span className='text-[#707070] text-xs line-through'>${card.drop}</span>
                  <span className='text-primary-pink-color text-[18px] font-[price]'>
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

export default Popular