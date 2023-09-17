import ProductListing from '@/components/productlisting/ProductListing'
import Wrapper from '@/components/shared/Wrapper'
import Layout from '@/components/shared/layout/Layout'
import React from 'react'
import Link from 'next/link'

const index = () => {
  return (
    <div>
      <Wrapper>
        <div className='mt-5'>
          <Layout>
            <p className='text-[18px]'>
              <Link href="/">Home</Link> {'>'} <span className='font-[600] '>Product Listing</span>
            </p>
          </Layout>
        </div>
        <div className='mt-10'>
          <ProductListing />
        </div>
      </Wrapper>
    </div>
  )
}

export default index