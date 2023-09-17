import Image from 'next/image'
import React from 'react'

const About = () => {
  return (
    <div>
      {/* left  */}
      <div className='flex  md:flex-row  flex-col justify-center'>
        <div className='basis-[50%] flex flex-col'>
          <h1 className='text-[24px] font-[600] pb-4'>
            Our Mission
          </h1>
          <p className='text-[16px] font-[400] text-[#777]'>
            Welcome to Clubfoot.online, your trusted online platform dedicated to making clubfoot care accessible, affordable, and supportive for individuals and families facing this condition. Our mission is to provide a vibrant community, reliable resources, and affordable solutions for the clubfoot journey.
          </p>
          <h1 className='text-[24px] font-[600] py-4'>
            Who We Are
          </h1>
          <p className='text-[16px] font-[400] text-[#777]'>
            We are a passionate team of individuals with a deep understanding of clubfoot's challenges. Our goal is clear and unwavering: we strive to be the trusted online hub for individuals and families impacted by clubfoot, providing accessible, affordable, and supportive solutions. At Clubfoot.online, we blend expertise with empathy.         </p>
         
        </div>


        {/* right  */}
        <div className='basis-[50%] flex flex-col'>
          <Image src={'/images/aboutus.png'} width={1080} height={1080} alt='' className='md:mt-0 mt-5 w-[605px] h-[370px] object-cover rounded-[15px] transform scale-x-[-1]' />

        </div>
      </div>
      <div>
      <h1 className='text-[24px] font-[600] py-4'>
            What Drives Us
          </h1>
        <ul className="list-disc pl-4">
          <li className="mb-4">
            <h3 className="text-black font-semibold  mb-2">Community:
              <span className="text-[#777] font-normal text-base pl-1">Clubfoot.online is more than a marketplace; it's a thriving community. We believe that offering support and building connections are essential in the clubfoot journey. Our platform fosters a sense of belonging and unity.</span></h3>
          </li>
          <li className="mb-4 ">
            <h3 className="text-black font-semibold  mb-2">Affordability:
              <span className="text-[#777] font-normal text-base pl-1">We recognize the financial strain clubfoot care can bring. That's why Clubfoot.online offers a platform where individuals can list and purchase gently-used Ankle Foot Orthosis (AFO) systems at budget-friendly prices. Quality care should be accessible to all.</span></h3>
          </li>
          <li className="mb-4">
            <h3 className="text-black font-semibold  mb-2">Security:
              <span className="text-[#777] font-normal text-base pl-1">Trust is paramount when it comes to healthcare equipment. We prioritize the security of all transactions. Through our partnership with PayPal, a trusted payment solution, we ensure secure exchanges. In the rare event of a dispute, can be resolved through PayPal's dispute resolution services.</span></h3>
          </li>
          <li className="mb-4">
            <h3 className="text-black font-semibold  mb-2">Sustainability:
              <span className="text-[#777] font-normal text-base pl-1">Beyond affordability, we're committed to sustainability. By extending the life of AFO systems, we reduce waste and promote eco-friendly healthcare practices. Together, we're making a positive impact on the environment.</span></h3>
          </li>
          <li className="mb-4">
            <h3 className="text-black font-semibold  mb-2">Hope:
              <span className="text-[#777] font-normal text-base pl-1">Our ultimate aim is to inspire hope. Clubfoot.online is where individuals facing clubfoot can find resources, community, and affordable solutions to navigate their unique journey with optimism and resilience.</span></h3>
          </li>
        </ul>
        <h1 className='text-[24px] font-[600] pb-4'>
          Join Us
        </h1>
        <p className='text-[16px] font-[400] text-[#777]'>
          We invite you to become a part of our growing community at Clubfoot.online. Whether you seek connection, buying or selling AFO systems, or simply wish to learn and share, you play an integral role in our mission. Together, we're transforming clubfoot care into an accessible, affordable, and hopeful experience.          </p>
        <p className='text-[16px] font-[400] text-[#777] py-4'>
          Thank you for choosing Clubfoot.online as your trusted partner on the clubfoot journey.</p>
      </div>
    </div>
  )
}

export default About