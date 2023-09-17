import React from 'react'

const Layout = ({children}) => {
    return (
        <div className='bg-[#F2F7FA] h-[167px] rounded-md flex items-center justify-center'>
            <h1 className='text-[16px] md:text-[18px]'>
                {children}
            </h1>
            
        </div>
    )
}

export default Layout