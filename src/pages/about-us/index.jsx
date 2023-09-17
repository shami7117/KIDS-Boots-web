import About from '@/components/about/About'
import Wrapper from '@/components/shared/Wrapper'
import Layout from '@/components/shared/layout/Layout'
import Link from 'next/link'
import React from 'react'

const index = () => {
  return (
    <div>
    <Wrapper>
      <div className='mt-5'>
        <Layout>
        <p className="text-[14px] md:text-[18px] ">
            {" "}
            <Link href={"/"}>Home</Link> {">"}
            <span className="font-[600] "> About Us </span>
          </p>
        </Layout>
      </div>
      <div className='mt-10'>
        <About />
      </div>
    </Wrapper>
  </div>
  )
}

export default index