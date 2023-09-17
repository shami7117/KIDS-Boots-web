import React from "react";
import Wrapper from "../shared/Wrapper";
import Link from "next/link";

const Footer = () => {
    return (
        <div className="mt-20 mb-5">
            <Wrapper>
                <div className="bg-[#E0EDF5] flex-col justify-center items-center px-10 pt-14 pb-7 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div>
                            <h1 className="text-[24px] font-[500] pb-2">About Us</h1>
                            <p className="text-[16px] font-[400] ">
                                We try to provide  accessible, affordable, and supportive solutions for the clubfoot journey.
                                we aim to be the trusted online hub for individuals and families impacted by clubfoot.
                                Clubfoot.online is more than a marketplace; it's a thriving community.

                            </p>
                        </div>
                        <div className="md:w-[200px] md:mx-auto">
                            <h2 className="text-[18px] font-[500] pb-4">For Customers</h2>
                            <ul className="flex flex-col space-y-4 text-[16px] font-[400]">
                                <Link href={'/'}>

                                    <li>Product for review</li>
                                </Link>
                                <Link href={'/contact-us'}>
                                    <li>Contact Us</li>
                                </Link>
                                <Link href={'/'}>

                                    <li>Terms of Use</li>
                                </Link>

                                <Link href={'/'}>

                                    <li>Customer Services</li>
                                </Link>
                            </ul>
                        </div>
                        <div>
                            <h1 className="text-[18px] font-[500] pb-4 ">
                                Sing up for Weekly Newsletter
                            </h1>
                            <p className="text-[16px] font-[400]">
                                Stay connected to a world of support and affordable clubfoot care solutions.
                            </p>
                            <div className="flex mt-5">
                                <input
                                    type="text"
                                    placeholder="Email Address"
                                    className="md:w-[368px] w-[150px]  border border-primary-pink-color pl-5 h-[50px] bg-transparent "
                                />
                                <button
                                    type="button"
                                    className="bg-primary-pink-color text-white px-2 md:px-4 py-2  "
                                >
                                    Subscribe
                                </button>
                            </div>{" "}
                        </div>
                    </div>
                    <div className="pt-7 text-center">
                        <p className="text-[16px] font-[500]">
                            Design and developed by <Link className="text-primary-pink-color" href={'https://zysoftec.com/'}>ZySoftec</Link>
                        </p>
                    </div>
                </div>
            </Wrapper>
        </div>
    );
};

export default Footer;
