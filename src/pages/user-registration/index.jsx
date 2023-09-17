import Wrapper from '@/components/shared/Wrapper'
import Layout from '@/components/shared/layout/Layout'
import React from 'react'
import UserReg from "@/components/userregistration/UserReg"

const index = () => {
  return (
    <div className='mt-5'>
    <Wrapper>
        <div>
            <Layout>
             <span className='font-[600] text-[18px]'>User Registration</span>
            </Layout>
            <div className='mt-20'>
              <UserReg/>
            </div>
        </div>
    </Wrapper>
</div>
  )
}

export default index