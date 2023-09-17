import Wrapper from '@/components/shared/Wrapper'
import Layout from '@/components/shared/layout/Layout'
import Whatwe from '@/components/whatwe/Whatwe'
import React from 'react'

const index = () => {
  return (
    <div>
    <Wrapper>
      <div className='mt-5'>
        <Layout>
          <p className='text-[18px] text-center'>
             <span className='font-[600] text-center'>Clubfoot.online - Your Source For Affordable Ponseti Method Solutions </span>
          </p>
        </Layout>
      </div>
      <div className='mt-10'>
        <Whatwe />
      </div>
    </Wrapper>
  </div>
  )
}

export default index