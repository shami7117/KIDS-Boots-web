import { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const Tab = ({ label, content }) => {
    const points = [
        {
            point: [
                'Patented, high-quality footwear system based on the Ponseti Method',
                'Straps & soft synthetic leather body',
                'ncreased heel visibility',
                'Easy locking and releasing of footwear, which attaches to the Ponseti Abduction Bar',
                'Dorsiflexion built into Ponseti Abduction Bar',
            ]
        },

    ]
    return (<div className='md:w-full md:h-[460px] p-5 p-4 border border-gray-300 rounded-md mt-4'>
        <p className='text-[16px] md:text-[18px] font-[400] text-[#777777]'>{content}</p>
        <p className='text-[24px] font-[500] mt-5'>
            Features & Specs
        </p>
        <div>
            {points.map((item, index) => (
                <div key={index}>
                    {item.point.map((point, idx) => (
                        <div key={idx} className='flex gap-5 p-2 text-[#777777]'>
                            <img src='/images/check.png' alt='' className='w-[25px] h-[25px]' />
                            <p className='max-w-[425px]'>{point}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>

    </div>)
};

const ReviewCard = ({ review }) => {
    const filledStars = Array.from({ length: review.stars }, (_, index) => index + 1);
    const unfilledStars = Array.from({ length: 5 - review.stars }, (_, index) => index + review.stars + 1);

    return (
        <div className='flex flex-col p-4 border border-[#DADADA] rounded-md mb-4 w-50'>
            <div className='flex items-center justify-between gap-2 mb-2'>
                <div className="flex">
                <img src={review.userImage} alt='' className='w-12 h-12 rounded-full' />
                <div className="flex-col ml-2">
                <span className='text-sm font-semibold'>{review.userName}</span>
                <p className='text-sm text-gray-600'>{review.date}</p>
                </div>
                </div>
               
               
                <div className='flex items-center gap-2 text-yellow-400 mb-2'>
            {filledStars.map((_, index) => (
                    <AiFillStar key={index} />
                ))}
                {unfilledStars.map((_, index) => (
                    <AiOutlineStar key={index} />
                ))}
            </div>
                
            </div>
           
           
            <p className='text-sm'>{review.reviewText}</p>
        </div>
    );
};

export default function ProductDetails() {
    const tabs = [
        { label: 'Product Description', content: 'Standard ankle foot orthosis for use with the Ponseti Method of clubfoot correction. Our patented system features a soft lining for comfort and compliance, and soft synthetic leather straps. The location of the heel can easily be seen through two holes in the back of the AFO and the footwear attaches to the Ponseti® Abduction Bar (sold separately), in accordance with the standard Ponseti bracing protocol. Available in the colors pink, gray, and blue.', },
        { label: 'Reviews', content: 'Standard ankle foot orthosis for use with the Ponseti Method of clubfoot correction. Our patented system features a soft lining for comfort and compliance, and soft synthetic leather straps. The location of the heel can easily be seen through two holes in the back of the AFO and the footwear attaches to the Ponseti® Abduction Bar (sold separately), in accordance with the standard Ponseti bracing protocol. Available in the colors pink, gray, and blue.' },

    ];

    const [activeTab, setActiveTab] = useState(0);
    const reviews = [
        {
            userImage: '/review1.svg',
            userName: 'James Williams',
            stars: 4,
            date: 'August 15, 2023',
            reviewText: 'Great product! It fits perfectly and is very comfortable.',
        },
        {
            userImage: '/review2.svg',
            userName: 'James Williams',
            stars: 5,
            date: 'August 12, 2023',
            reviewText: 'I love these shoes! They are amazing and look fantastic.',
        },
        {
            userImage: '/review2.svg',
            userName: 'James Williams',
            stars: 5,
            date: 'August 12, 2023',
            reviewText: 'I love these shoes! They are amazing and look fantastic.',
        },
        {
            userImage: '/review1.svg',
            userName: 'James Williams',
            stars: 5,
            date: 'August 12, 2023',
            reviewText: 'I love these shoes! They are amazing and look fantastic.',
        },
    
    
    ];

    return (
        <div>
            <div className='flex gap-[20px] md:gap-[40px]'>
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '10px 0px',
                            cursor: 'pointer',
                            borderBottom: activeTab === index ? '' : '',
                            backgroundColor: activeTab === index ? '' : '',
                            color: activeTab === index ? '#A51F6C' : ''
                        }}
                        className=' text-[16px] md:text-[24px] font-[500]'
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            {activeTab === 0 ? (
                <Tab label={tabs[activeTab].label} content={tabs[activeTab].content} />
            ) : (
                <div className='p-4 border border-gray-300 rounded-md mb-4 w-full grid gap-4 md:grid-cols-2 mt-4'>
                    {reviews.map((review, index) => (
                        <ReviewCard key={index} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
}
