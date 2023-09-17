import Cartcheckout from '@/components/cartcheckout/Cartcheckout'
import Wrapper from '@/components/shared/Wrapper'
import Layout from '@/components/shared/layout/Layout'

import React from 'react'

const index = () => {
  return (
    <div>
      <Wrapper>
        <div className='mt-5'>
          <Layout>
            <p className='md:text-[18px] text-center'>
            Shopping  {'>'}  <span className='font-[600] '> Cart Checkout  </span>  {'>'} Order Complete
            </p>
          </Layout>
        </div>
        <div className='mt-10'>
          <Cartcheckout/>
        </div>
      </Wrapper>
    </div>
  )
}

export default index