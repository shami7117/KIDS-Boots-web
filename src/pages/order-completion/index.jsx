import Order from '@/components/ordercompletion/Order'
import Wrapper from '@/components/shared/Wrapper'
import Layout from '@/components/shared/layout/Layout'
import React from 'react'

const index = () => {
  return (
    <div>
      <Wrapper>
        <div className='mt-5'>
          <Layout>
            <p className='text-[12px] md:text-[18px]'>
              Shopping  {'>'}  Cart Checkout {'>'}   <span className='font-[600] '> Order Complete</span>
            </p>
          </Layout>
        </div>
        <div className='mt-16'>
          <Order/>
        </div>
      </Wrapper>
    </div>
  )
}

export default index