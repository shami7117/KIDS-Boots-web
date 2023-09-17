import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
const Form = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Perform authentication logic here
    // Assuming authentication is successful
     // Call the onLogin prop to update the login status
    const router = useRouter();
    router.push('/product-upload');
  };

  return (
    <div>
      <form>
        <div className="flex flex-col justify-center items-center ">
          <div className="bg-white md:w-[480px] flex flex-col shadow-xl text-center py-5 px-10">
            <p className="text-[24px] font-[700] pb-5 text-[#A51F6C]">
              Welcome!
            </p>
            <p className="text-[20px] font-[500] pb-7">
              Hey! Enter your details to get sign into your account
            </p>

            <label
              htmlFor="email"
              className="text-left mb-3 text-[16px] font-[500] text-[#000000]"
            >
              {" "}
              Email Address*
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="JohnDoe78@gmail.com"
              className="md:w-[400px] h-[50px]  px-5 mb-5 border bg-[#B4C7ED0D] border-[#2668E826] rounded-md"
            />
            <label
              htmlFor="email"
              className="text-left mb-3 text-[16px] font-[500] text-[#000000] "
            >
              {" "}
              Password*
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="md:w-[400px] h-[50px] px-5 bg-[#B4C7ED0D] border border-[#2668E826] rounded-md"
            />
            <div className="flex items-center justify-between my-4">
              <label htmlFor="remember" className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-2 border border-gray-300 rounded-md  focus:ring focus:to-black"
                />
                Remember me
              </label>
              <a href="#" className="text-primary-pink-color hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-pink-color text-white py-2 rounded-md hover:bg-primary-pink-color/90"
              onClick={handleLogin}
            >
              Log In
            </button>
            <p className="text-center mt-16 mb-5">
              Don't have an account?{" "}
              <Link
                href="#"
                className="text-primary-pink-color hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
