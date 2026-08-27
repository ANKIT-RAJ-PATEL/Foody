import React from 'react';
import { FaMinus, FaPlus } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { PiLeafFill } from "react-icons/pi";
import { GiChickenOven } from "react-icons/gi";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';

function CartItemCard({ data }) {
    const dispatch = useDispatch();
    const hadleEncrease = (id,currentQty)=>{
        dispatch(updateQuantity({id,quantity:currentQty+1}))
    }
    const hadleDecrease = (id,currentQty)=>{
        if(currentQty>1){
            dispatch(updateQuantity({id,quantity:currentQty-1}))
        }
    }
    return (
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg hover:shadow-2xl border border-orange-100 transition-all duration-300 hover:scale-[1.02] group'>
            <div className='flex items-center gap-5 flex-1'>
                <div className='relative'>
                    <img src={data.image} alt={data.name} className='w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border-2 border-orange-200 shadow-md group-hover:border-[#ff4d2d] transition-colors' />
                    <div className='absolute -top-2 -right-2 bg-white p-1.5 rounded-full shadow-md border border-orange-100'>
                        {data.foodType == "Veg" ? 
                            <PiLeafFill size={16} style={{ color: 'green' }} /> :
                            <GiChickenOven size={16} style={{ color: 'red' }} />
                        }
                    </div>
                </div>
                <div className='flex-1'>
                    <h1 className='font-bold text-gray-900 text-lg mb-1'>{data.name}</h1>
                    <div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
                        <span className='flex items-center bg-orange-50 px-2 py-1 rounded-lg'>
                            <MdOutlineCurrencyRupee className='text-sm' />{data.price}
                        </span>
                        <span className='text-gray-400'>×</span>
                        <span className='bg-blue-50 px-2 py-1 rounded-lg font-medium'>{data.quantity}</span>
                    </div>
                    <p className='font-bold text-xl text-[#ff4d2d] flex items-center'>
                        <MdOutlineCurrencyRupee className='text-xl' />{data.price * data.quantity}
                    </p>
                </div>
            </div>
            <div className='flex items-center gap-3 mt-4 sm:mt-0 justify-end sm:justify-start'>
                <div className='flex items-center bg-gray-50 rounded-full border-2 border-gray-200 overflow-hidden shadow-sm'>
                    <button className='p-3 hover:bg-orange-100 transition-colors cursor-pointer active:scale-95'
                    onClick={()=>hadleDecrease(data.id,data.quantity)}>
                        <FaMinus size={14} className='text-gray-700' />
                    </button>
                    <span className='px-4 font-bold text-lg text-gray-900'>{data.quantity}</span>
                    <button className='p-3 hover:bg-orange-100 transition-colors cursor-pointer active:scale-95'
                    onClick={()=>hadleEncrease(data.id,data.quantity)}>
                        <FaPlus size={14} className='text-gray-700' />
                    </button>
                </div>
                <button className='p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer'
                onClick={()=>dispatch(removeCartItem(data.id))}>
                    <RiDeleteBin6Line size={18}/>
                </button>
            </div>
        </div>
    )
}

export default CartItemCard