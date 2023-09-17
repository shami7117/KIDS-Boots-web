import ProductUpload from '@/components/productupload/ProductUpload'
import Wrapper from '@/components/shared/Wrapper'
import Layout from '@/components/shared/layout/Layout'
import React from 'react'

const index = () => {
    return (
        <div>
            <Wrapper>
                <div className='mt-5'>
                    <Layout>
                        <p className='text-[14px] md:text-[18px] '>
                            <span className='font-[600] '>Product Upload </span>
                        </p>
                    </Layout>
                </div>
                <div className='mt-10 max-w-[1080px] mx-auto'>
                    <ProductUpload />
                </div>
            </Wrapper>
        </div>
    )
}

export default index