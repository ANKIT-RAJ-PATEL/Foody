import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function OrderDelivered() {
    const navigate = useNavigate();
    return (
        <div className='min-h-screen bg-[#fff9f6] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden'>
            <FaCircleCheck className='text-green-500 text-6xl mb-2' />
            <h1 className='text-3xl font-bold'>Order Delivered Successfully!</h1>
            
           
            <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-6 py-3 rounded-lg text-lg font-medium transition cursor-pointer mt-5'
                onClick={() => navigate("/")}>
                Back to Home</button>
        </div>
    )
}

export default OrderDelivered