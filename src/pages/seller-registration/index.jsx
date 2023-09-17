import SellerReg from '@/components/sellerregitration/SellerReg'
import Wrapper from '@/components/shared/Wrapper'
import Layout from '@/components/shared/layout/Layout'
import React from 'react'

const index = () => {
  return (
    <div className='mt-5'>
    <Wrapper>
        <div>
            <Layout>
             <span className='font-[600] text-[18px]'>Seller Registration</span>
            </Layout>
            <div className='mt-20'>
              <SellerReg/>
            </div>
        </div>
    </Wrapper>
</div>
  )
}

export default index