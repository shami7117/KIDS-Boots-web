import React, { Component } from 'react'

export class Points extends Component {
    render() {
        const {points} = this.props;
        return (
            <div className="points">
                {
                points.map((point, index) =>(
                    <div key={index} className='flex  gap-5 p-2 text-[#777777] md:text-base text-[14px]'>
                       <img src='/images/check.png' alt='' className='w-[25px] h-[25px]'  />
                        <p>{point}</p>

                    </div>
                ))
                }
            </div>
        )
    }
}

export default Points