import React from 'react'
import { FaPhoneAlt, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { MdEmail, MdOutlineCurrencyRupee, MdDeliveryDining } from "react-icons/md";
import { BsCreditCard2Back } from "react-icons/bs";
import axios from 'axios';
import { serverUrl } from "../App"
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';
import { useState } from 'react';

function OwnerOrderCard({ data }) {

  const [availableBoys, setAvailableBoys] = useState([]);
  const dispatch = useDispatch();
  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/updatestatus/${orderId}/${shopId}`, { status },
        { withCredentials: true })
      dispatch(updateOrderStatus({ orderId, shopId, status }))
      setAvailableBoys(result.data.availableBoys)


    } catch (error) {
      console.log("error updating status", error);
    }
  }
  return (
    <div className='bg-white/80 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-100 overflow-hidden group hover:scale-[1.02]'>
      {/* Customer Info Header */}
      <div className='bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-5 border-b border-blue-200'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full'>
            <FaUser className='text-white text-xl' />
          </div>
          <h2 className='text-xl font-bold text-gray-900'>{data.user.fullname}</h2>
        </div>
        <div className='space-y-2 bg-white/60 rounded-xl p-3'>
          <p className='flex items-center gap-2 text-sm text-gray-700'>
            <MdEmail className='text-blue-600' size={18} />
            <span className='font-medium'>{data.user.email}</span>
          </p>
          <p className='flex items-center gap-2 text-sm text-gray-700'>
            <FaPhoneAlt className='text-green-600' size={16} />
            <span className='font-medium'>{data.user.mobile}</span>
          </p>
          <p className='flex items-center gap-2 text-sm text-gray-700'>
            <BsCreditCard2Back className='text-purple-600' size={18} />
            <span className='font-medium'>Payment: <span className='text-[#ff4d2d] font-bold'>{data.paymentMethod === "online" ? "Online" : "COD"}</span></span>
          </p>
        </div>
      </div>

      {/* Order Content */}
      <div className='p-5 space-y-4'>
        <div className='flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-xl p-3'>
          <FaMapMarkerAlt className='text-[#ff4d2d] text-lg mt-1 flex-shrink-0' />
          <p className='text-sm text-gray-700 font-medium'>{data?.deliveryAddress?.text}</p>
        </div>

        <div className='flex space-x-4 overflow-x-auto pb-2 scrollbar-hide'>
          {data.shopOrders.shopOrderItems.map((item, index) => (
            <div key={index} className='flex-shrink-0 w-44 border-2 border-purple-200 rounded-xl p-3 bg-white shadow-md hover:shadow-lg transition-shadow'>
              <img src={item.item.image} alt={item.item.name}
                className='w-full h-28 object-cover rounded-lg' />
              <p className='text-sm font-bold mt-2 text-gray-900 truncate'>{item.name}</p>
              <p className='text-xs text-gray-600 flex items-center mt-1'>
                Qty: {item.quantity} × <MdOutlineCurrencyRupee className='text-xs' />{item.price}
              </p>
            </div>
          ))}
        </div>

        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t-2 border-blue-200 pt-4'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-gray-700'>Status:</span>
            <span className='font-bold capitalize px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 text-[#ff4d2d] border-2 border-orange-200'>
              {data.shopOrders.status}
            </span>
          </div>

          <select className='rounded-xl border-2 px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]/50 border-[#ff4d2d] text-[#ff4d2d] cursor-pointer bg-white hover:bg-orange-50 transition-colors shadow-md'
            onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)}>

            <option value="change">Update Status</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="out of delivery">Out Of Delivery</option>
          </select>
        </div>

        {data?.shopOrders?.status === "out of delivery" &&
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-2 border-green-200 rounded-xl text-sm shadow-md">
            <div className='flex items-center gap-2 font-bold text-gray-900 mb-3'>
              <MdDeliveryDining className='text-green-600 text-2xl' />
              {data.shopOrders.assignedDeliveryBoy ? <span>Assigned Delivery Partner</span>
                : <span>Available Delivery Partners</span>}
            </div>

            {availableBoys.length > 0 ? (
              <div className='space-y-2'>
                {availableBoys.map((b, index) => (
                  <div key={index} className='bg-white rounded-lg p-3 text-gray-900 font-medium border border-green-200 flex items-center gap-2'>
                    <FaUser className='text-green-600' />
                    {b?.fullname} - <FaPhoneAlt className='text-blue-600' size={12} /> {b?.mobile}
                  </div>
                ))}
              </div>
            ) : data.shopOrders.assignedDeliveryBoy ? 
              <div className='bg-white rounded-lg p-3 border border-green-200 flex items-center gap-2'>
                <FaUser className='text-green-600' />
                <span className='font-bold text-gray-900'>{data.shopOrders.assignedDeliveryBoy.fullname}</span> - 
                <FaPhoneAlt className='text-blue-600' size={12} />
                <span className='font-medium'>{data.shopOrders.assignedDeliveryBoy.mobile}</span>
              </div>
            : <div className="text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3 font-medium">⏳ Waiting for delivery partner to accept</div>
            }
          </div>
        }
      </div>

      {/* Footer */}
      <div className='bg-gradient-to-r from-gray-50 to-blue-50 p-5 border-t-2 border-blue-200'>
        <div className='flex justify-between items-center'>
          <span className='text-gray-600 font-medium'>Total Amount:</span>
          <span className='text-2xl font-bold text-[#ff4d2d] flex items-center'>
            <MdOutlineCurrencyRupee className='text-2xl' />{data.shopOrders.subtotal}
          </span>
        </div>
      </div>
    </div>
  )
}

export default OwnerOrderCard