import Wrapper from '@/components/shared/Wrapper'
import Layout from '@/components/shared/layout/Layout'
import Dashboard from '@/components/userdashboard/Dashboard'
import Topbar from '@/components/userdashboard/Topbar'
import React from 'react'

const index = () => {
    return (
        <div>
            <Wrapper>
                <div className='mt-5'>
                    <Layout>
                        <p className='text-[14px] md:text-[18px] '> Home {'>'}
                            <span className='font-[600] '>  Profile  </span>
                        </p>
                    </Layout>
                </div>
                <div className='mt-10'>
                    <Topbar/>
                    <Dashboard />

                </div>
            </Wrapper>
        </div>
    )
}

export default index