import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { FaCalendarAlt, FaStore } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { BsStarFill, BsStar } from "react-icons/bs";


function UserOrderCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [seletctedRating, setSelectedRating] = useState({});

  const formateDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-Us', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const handleRating = async (itemId, rating) => {
  try {
    const result = await axios.post(
      `${serverUrl}/api/item/rating`,
      { itemId, rating },
      { withCredentials: true }
    );

    dispatch({ type: "update_item_rating", payload: result.data });

    setSelectedRating(prev => ({
      ...prev,
      [itemId]: rating
    }));
  } catch (error) {
    console.log("rating error", error);
  }
};


  return (
    <div className='bg-white/80 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-100 overflow-hidden group hover:scale-[1.02]'>
      {/* Header */}
      <div className='bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 p-5 border-b border-orange-200'>
        <div className='flex justify-between items-start'>
          <div>
            <p className='font-bold text-gray-900 text-lg flex items-center gap-2'>
              <span className='bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white px-3 py-1 rounded-full text-sm'>#{data._id.slice(-6)}</span>
            </p>
            <p className='text-sm text-gray-600 mt-2 flex items-center gap-2'>
              <FaCalendarAlt className='text-[#ff4d2d]' />
              {formateDate(data.createdAt)}
            </p>
          </div>
          <div className='text-right'>
            <p className='text-sm font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full'>{data.paymentMethod?.toUpperCase()}</p>
            <p className='font-semibold text-[#ff4d2d] mt-2 capitalize'>{data.shopOrders?.[0].status}</p>
          </div>
        </div>
      </div>

      {/* Order Content */}
      <div className='p-5 space-y-4'>
        {data.shopOrders?.map((shopOrder, index) => (
          <div className='border-2 border-orange-100 rounded-2xl p-4 bg-gradient-to-br from-white to-orange-50/30 space-y-4 shadow-md' key={index}>
            <div className='flex items-center gap-2 font-bold text-gray-900 text-lg'>
              <FaStore className='text-[#ff4d2d]' />
              {shopOrder?.shop?.name}
            </div>
            <div className='flex space-x-4 overflow-x-auto pb-2 scrollbar-hide'>
              {shopOrder.shopOrderItems.map((item, index) => (
                <div key={index} className='flex-shrink-0 w-44 border-2 border-orange-200 rounded-xl p-3 bg-white shadow-md hover:shadow-lg transition-shadow'>
                  <img src={item.item.image} alt={item.item.name}
                    className='w-full h-28 object-cover rounded-lg' />
                  <p className='text-sm font-bold mt-2 text-gray-900 truncate'>{item.name}</p>
                  <p className='text-xs text-gray-600 flex items-center mt-1'>
                    Qty: {item.quantity} × <MdOutlineCurrencyRupee className='text-xs' />{item.price}
                  </p>

                  {shopOrder.status == "delivered" &&
                    <div className='flex gap-1 mt-2'>
                      {[1,2,3,4,5].map((star,idx)=>(
                        <button key={idx} className={`text-xl cursor-pointer transition-colors ${seletctedRating[item.item._id]>=star?
                          "text-yellow-400":"text-gray-300"} hover:scale-125`}
                          onClick={()=>handleRating(item.item._id,star)}>
                          {seletctedRating[item.item._id]>=star ? <BsStarFill /> : <BsStar />}
                        </button>
                      ))}
                    </div>}

                </div>
              ))}
            </div>
            <div className='flex justify-between items-center border-t border-orange-200 pt-3'>
              <p className='font-bold text-gray-900 flex items-center'>
                Subtotal: <MdOutlineCurrencyRupee className='text-lg' />{shopOrder.subtotal}
              </p>
              <span className='text-sm font-semibold capitalize px-3 py-1 rounded-full bg-orange-100 text-[#ff4d2d]'>{shopOrder.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className='flex justify-between items-center bg-gradient-to-r from-gray-50 to-orange-50 p-5 border-t-2 border-orange-200'>
        <p className='font-bold text-xl text-gray-900 flex items-center'>
          Total: <MdOutlineCurrencyRupee className='text-xl' />{data.totalAmount}
        </p>
        <button className='bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] hover:shadow-xl hover:shadow-[#ff4d2d]/50 text-white px-6 py-3 rounded-full text-sm font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center gap-2'
          onClick={() => navigate(`/trackorder/${data._id}`)}>
          <MdLocationOn className='text-lg' />
          Track Order
        </button>
      </div>
    </div>
  )
}

export default UserOrderCard