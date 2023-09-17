import Faq from '@/components/faqs/Faq'
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
            <span className="font-[600] "> FAQ's </span>
          </p>
        </Layout>
      </div>
      <div className='mt-10'>
        <Faq />
      </div>
    </Wrapper>
  </div>
  )
}

export default index