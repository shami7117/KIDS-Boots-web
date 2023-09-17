import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useEffect } from 'react';


const PaypalModel = ({ isOpen, onClose }) => {
    const modalRef = useRef(null);

    const paypalScript = () => {
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=AYFGcFd7MjvD1zxRn3xBEDUHQoeFld3JcKI6_UtOwNtjzcSwQq1TbbymBaApxyH8vcBFbKcXk6A4Sm2d&currency=USD"
        script.type = "text/javascript";
        script.async = true;
        document.body.appendChild(script);
    }
    const paypal = useRef();

    useEffect(() => {
        paypalScript();
        // window.paypal.Button({
        //     createOrder: (data, action, err) => {
        //         return action.order.create({
        //             intent: "CAPTURE",
        //             purchase_units: [
        //                 {
        //                     description: "Payment of Boots",
        //                     amount: {
        //                         currency_code: "USD",
        //                         value: 489.00
        //                     }
        //                 }
        //             ]
        //         })
        //     },
        //     onApprove: async (data, actions) => {
        //         const order = await actions.order.capture();
        //         console.log(order);
        //     },
        //     onError: (err) => {
        //         console.log(err);
        //     }
        // })
    }, [])

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    return (
        <div
            className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? '' : 'hidden'
                }`}
        >
            <form className="bg-white w-[340px] md:w-[500px] h-full p-4 flex justify-center items-center rounded-md shadow-md">
                {/* Your PayPal transaction content here */}


            </form>
        </div>
    );
};

export default PaypalModel;
