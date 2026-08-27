import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { IoArrowBackSharp } from "react-icons/io5";
import { FaShoppingBag } from "react-icons/fa";
import { BsInboxFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { useEffect } from 'react';
import { setMyOrders, updateRealtimeOrderStatus } from '../redux/userSlice';

function MyOrders() {
  const { userData, myOrders, socket } = useSelector(state => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket || !userData?._id) return;

    const handleNewOrder = (data) => {
      const orderOwnerId = typeof data.shopOrders?.owner === 'object' 
        ? data.shopOrders.owner._id 
        : data.shopOrders?.owner;
      
      if (orderOwnerId == userData._id) {  
        // Use functional update to avoid stale closure
        dispatch(setMyOrders((prevOrders) => [data, ...(prevOrders || [])]));
        
        // Show notification
        if (typeof Audio !== 'undefined') {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(e => console.log('Audio play failed:', e));
        }
      } else {
        console.log("⚠️ Order is not for my shop, ignoring");
      }
    };

    const handleUpdateStatus = ({ orderId, shopId, status, userId }) => {
      
      if (userId == userData._id) {
        console.log("✅ Status update is for me");
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }));
      } else {
        console.log("⚠️ Status update is not for me");
      }
    };


    socket.on("newOrder", handleNewOrder);
    socket.on("updateStatus", handleUpdateStatus);

    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off("newOrder", handleNewOrder);
      socket.off("updateStatus", handleUpdateStatus);
    };
  }, [socket, userData?._id, dispatch])

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex justify-center px-4 py-6'>
      <div className='w-full max-w-[900px]'>
        {/* Header Section */}
        <div className='bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-orange-100 p-6 mb-6 animate-slideInLeft'>
          <div className='flex items-center gap-4'>
            <button 
              className='bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white p-3 rounded-full shadow-lg hover:shadow-[#ff4d2d]/50 hover:scale-110 transition-all duration-300'
              onClick={() => navigate("/")}>
              <IoArrowBackSharp size={22} />
            </button>
            <div className='flex items-center gap-3 flex-1'>
              <FaShoppingBag className='text-[#ff4d2d] text-3xl' />
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>My Orders</h1>
                <p className='text-sm text-gray-600'>{myOrders?.length || 0} {myOrders?.length === 1 ? 'order' : 'orders'} in total</p>
              </div>
            </div>
          </div>
        </div>

        {myOrders?.length === 0 ? 
          <div className='bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-orange-100 p-12 text-center animate-fadeIn'>
            <BsInboxFill className='text-gray-300 text-8xl mx-auto mb-6' />
            <h2 className='text-2xl font-bold text-gray-800 mb-3'>No Orders Yet</h2>
            <p className='text-gray-500 text-lg mb-6'>Looks like you haven't placed any orders</p>
            <button 
              onClick={() => navigate('/')}
              className='bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white px-8 py-3 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-[#ff4d2d]/50 hover:scale-105 transition-all duration-300'>
              Start Ordering
            </button>
          </div>
        :
          <div className='space-y-5'>
            {myOrders?.map((order, index) => (
              <div key={index} className='animate-fadeIn' style={{ animationDelay: `${index * 0.1}s` }}>
                {userData.role == "user" ?
                  <UserOrderCard data={order} />
                  :
                  <OwnerOrderCard data={order} />
                }
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}

export default MyOrders