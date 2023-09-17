import Wrapper from '@/components/shared/Wrapper'
import Layout from '@/components/shared/layout/Layout'
import Shopping from '@/components/shopping/Shopping'
import React from 'react'
const index = () => {
  return (
    <div>
      <Wrapper>
        <div className='mt-5'>
          <Layout>
            <p className= 'text-[14px] md:text-[18px] '>
            <span className='font-[600] '>Shopping </span> {'>'}  Cart Checkout {'>'} Order Complete
            </p>
          </Layout>
        </div>
        <div className='mt-10'>
          <Shopping />
        </div>
      </Wrapper>
    </div>
  )
}

export default index