import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AiFillStar } from "react-icons/ai";
import Link from "next/link";
import ProductApi from "@/lib/product";
import CartApi from "@/lib/cart";
import { useQuery, useMutation, QueryClient, useQueryClient } from "@tanstack/react-query";
import Wrapper from "@/components/shared/Wrapper";
import Layout from "@/components/shared/layout/Layout";
import DetailsThumb from "@/components/productdetails/DetailsThumb";
import Points from "@/components/productdetails/Points";
import ProductDetails from "@/components/productdetails/ProductDetails";
import Like from "@/components/productdetails/Like";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { ThreeDots } from 'react-loader-spinner'
import { notification } from "antd";



const ProductPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  let userId
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    userId = user.uid
    console.log("USER ID ", userId);


  } catch (error) {
    console.log("USER ID ERROR", error);
  }

  const { id } = router.query;



  const addMutation = useMutation(
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
            message: "Added in cart successfully!",
            placement: "top",
          });
          router.push("/shopping");

        } else {
          notification.open({
            type: "success",
            message: "Added in cart successfully!",
            placement: "top",
          });
          router.push("/shopping");

        }

      },
    }
  );


  const [products, setProducts] = useState([
    {
      _id: "1",
      title: "Clubfoot Shoes Mitchell Ponseti® AFO standard (grey)",
      src: [
        "/images/shoebig.png",
        "/images/shoebig2.png",
        "/images/shoebig.png",
        "/images/shoebig2.png",
      ],
      reviews: "4.5 (10 Reviews)",
      cutprice: "$159.00",
      price: "$120.00 ",
      description:
        "Standard ankle foot orthotic for use with the Ponseti method Standard ankle foot orthotic for use with the Ponseti method of clubfoot correction. Our patented system features a hard sole, a soft...s",
      points: [
        "Patented, high-quality footwear system based on the Ponseti Method",
        "Straps & soft synthetic leather body",
        "increased heel visibility",
        "Easy locking and releasing of footwear, which attaches to the Ponseti Abduction Bar",
        "Dorsiflexion built into Ponseti Abduction Bar",
      ],
      count: 1,
    },
  ]);

  const [index, setIndex] = useState(0);
  const myRef = useRef(null);

  const handleTab = (index) => {
    setIndex(index);
    const images = myRef.current.children;

    for (let i = 0; i < images.length; i++) {
      if (i === index) {
        images[i].classList.add("active");
      } else {
        images[i].classList.remove("active");
      }
    }
  };

  useEffect(() => {
    const images = myRef.current?.children; // Use optional chaining to check if myRef.current is defined

    if (images) {
      for (let i = 0; i < images.length; i++) {
        if (i === index) {
          images[i].classList.add("active");
        } else {
          images[i].classList.remove("active");
        }
      }
    }
  }, [index]);



  const activeImageIndex = index;

  const { data, isLoading, isError } = useQuery(
    ['Products'],
    async () => {

      try {
        const response = await ProductApi.getProductById(id);
        return response;// Assuming your API returns data property
      } catch (error) {
        console.log(error)
      }

    }
  );
  console.log("single product", data)

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
    <div>

      <Wrapper>
        <div className="mt-5 ">
          <Layout>
            <p className="text-[14px] md:text-[18px] ">
              <Link href="/">Home </Link>{" "}
              &gt;
              <Link href="/product-listing">
                <span className=""> Product Listing </span>
              </Link>{" "}
              &gt;
              <span className="font-[600]">Product Detail</span>
            </p>
          </Layout>
          <div className=" flex mt-20 ">
            {products.map((item) => (
              <div className=" flex  md:flex-row flex-col" key={item._id}>
                <div className="flex flex-col mx-auto md:mx-0 basis-[100%] md:basis-[50%]  justify-start items-center">
                  <div className="mb-10 flex ">
                    <div className="bg-[#D14D721A] p-6 md:p-0 md:w-[692px] md:h-[605px] justify-center items-center flex rounded-md ">
                      <Image
                        src={data?.file}
                        alt=""
                        width={1080}
                        height={1080}
                        className="max-w-[250px] max-h-[250px] md:max-w-[450px] md:max-h-[450px]  transition-all duration-300"
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </div>
                  </div>
                  {/* <div>
                    <DetailsThumb images={products[0].src} activeIndex={activeImageIndex} tab={handleTab} myRef={myRef} />
                  </div> */}
                </div>
                <div className="flex flex-col mt-5 md:mt-0 basis-[100%] md:basis-[50%] md:pl-10 ">
                  <div className=" flex flex-col gap-5">
                    <h2 className="text-[20px] md:text-[24px] uppercase font-[600]">{data?.category}</h2>
                    <span className="text-[#1A9CDA] font-[500] text-[16px] flex items-center gap-2">
                      <AiFillStar size={20} className="text-[#FF7C1D]" />
                      ${item.reviews}
                    </span>
                    <div className="flex gap-5 items-center">
                      <p className="text-[#777777] line-through text-[16px] md:text-[18px] font-[500]">{item.cutprice}</p>
                      <p className="text-[#A51F6C] font-[500] text-[20px] md:text-[24px]">${data?.price}</p>
                      <p className="w-[110px] h-[40px] bg-[#A51F6C] text-[18px] font-[500] text-white rounded-full flex justify-center items-center text-center">
                        20% off
                      </p>
                    </div>
                    <p className="text-[14px] md:text-[16px] font-[400] text-[#777777] mb-5 md:w-full">{data?.description}</p>
                  </div>
                  <Points points={item.points} />
                  <p>{item.content}</p>
                  <div className="mt-5">
                    <h3 className="font-[600] text-[24px]">
                      Sizing Chart
                    </h3>
                    <div className="flex  mt-3 justify-between md:w-[350px]">
                      <p className="text-[#777777] text-[14px] md:text-[16px] font-[500]">
                        Brand: <span className="text-black"> {data?.brand}</span>
                      </p>
                      <p className="text-[#777777] text-[14px] md:text-[16px]  font-[500]">
                        Type:
                        <span className="text-black"> {data?.type}
                        </span>
                      </p>
                    </div>
                    <div className="flex  mt-3 justify-between md:w-[350px]">
                      <p className="text-[#777777] text-[14px] md:text-[16px]  font-[500]">
                        Size: <span className="text-black">  {data?.size}</span>
                      </p>
                      <p className="text-[#777777] text-[14px] md:text-[16px]  font-[500]">
                        Color:
                        <span className="text-black">{data?.color}
                        </span>
                      </p>
                    </div>
                    <div className="flex  mt-3 justify-between md:w-[350px]">
                      <p className="text-[#777777] text-[14px] md:text-[16px]  font-[500]">
                        Side: <span className="text-black">  {data?.side}</span>
                      </p>
                      <p className="text-[#777777] text-[14px] md:text-[16px]  font-[500]">
                        Box:
                        <span className="text-black"> {data?.box}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button onClick={() => {
                    data['userId'] = userId
                    data['productId'] = data.id;

                    addMutation.mutate(data)
                  }} className="mt-8 w-full md:w-[466px] h-[46px] bg-primary-pink-color rounded-[5px] text-white">Add to cart</button>

                </div>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <ProductDetails />
          </div>
          <div className="mt-16">
            <h1 className="font-[700]  text-[24px] text-center">
              You May Also Like
            </h1>
            <div className="mt-10">
              <Like />
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default ProductPage;
