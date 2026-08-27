/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";
import { FaStore, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaCheckCircle, FaHourglassHalf, FaTruck, FaBoxOpen } from "react-icons/fa";
import { MdOutlineCurrencyRupee, MdDeliveryDining } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { serverUrl } from '../App';
import DeliveryBoyTracking from '../components/DeliveryBoyTracking';
import { useSelector } from 'react-redux';

function TrackOrderPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState(null);
  const {socket} = useSelector(state=>state.user)
  const [liveLocation, setLiveLocation] = useState({});

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <BsClockHistory className='text-yellow-500' />;
      case 'preparing': return <FaBoxOpen className='text-blue-500' />;
      case 'out of delivery': return <FaTruck className='text-purple-500' />;
      case 'delivered': return <FaCheckCircle className='text-green-500' />;
      default: return <FaHourglassHalf className='text-gray-400' />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'preparing': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'out of delivery': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/getorderbyid/${orderId}`, {
        withCredentials: true
      });
      setCurrentOrder(result.data);
    
    } catch (error) {
      console.log("error in fetching order by id", error);
    }
  }

  useEffect(()=>{
      socket?.on('updateDeliveryLocation',({ deliveryBoyId,latitude,longitude})=>{
       setLiveLocation(prev=>({
        ...prev,
        [deliveryBoyId]:{lat:latitude,lon:longitude}
       })) 

      })
  },[socket])

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-6 px-4'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-orange-100 p-6 mb-6 animate-slideInLeft'>
          <div className='flex items-center gap-4'>
            <button 
              className='bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white p-3 rounded-full shadow-lg hover:shadow-[#ff4d2d]/50 hover:scale-110 transition-all duration-300'
              onClick={() => navigate("/")}>
              <IoArrowBackSharp size={22} />
            </button>
            <div className='flex items-center gap-3'>
              <MdDeliveryDining className='text-[#ff4d2d] text-4xl' />
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>Track Order</h1>
                <p className='text-sm text-gray-600'>Order #{orderId?.slice(-8)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Cards */}
        <div className='space-y-6'>
          {currentOrder?.shopOrders?.map((shopOrder, index) => (
            <div className='bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-100 overflow-hidden animate-fadeIn' key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              
              {/* Shop Header */}
              <div className='bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 p-6 border-b-2 border-orange-200'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='bg-gradient-to-br from-[#ff4d2d] to-[#ff6b4d] p-3 rounded-2xl shadow-lg'>
                    <FaStore className='text-white text-2xl' />
                  </div>
                  <h2 className='text-2xl font-bold text-gray-900'>{shopOrder.shop.name}</h2>
                </div>
                
                {/* Status Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border-2 ${getStatusColor(shopOrder.status)}`}>
                  {getStatusIcon(shopOrder.status)}
                  <span className='capitalize'>{shopOrder.status}</span>
                </div>
              </div>

              {/* Order Details */}
              <div className='p-6 space-y-5'>
                {/* Items */}
                <div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200'>
                  <p className='font-bold text-gray-900 mb-2 flex items-center gap-2'>
                    <FaBoxOpen className='text-blue-600' />
                    Order Items:
                  </p>
                  <p className='text-gray-700 font-medium'>{shopOrder.shopOrderItems?.map(i => i.name).join(", ")}</p>
                </div>

                {/* Subtotal */}
                <div className='bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4 border border-orange-200'>
                  <p className='font-bold text-gray-900 flex items-center gap-2 text-lg'>
                    <span>Subtotal:</span>
                    <span className='text-[#ff4d2d] flex items-center'>
                      <MdOutlineCurrencyRupee className='text-xl' />{shopOrder.subtotal}
                    </span>
                  </p>
                </div>

                {/* Delivery Address */}
                <div className='bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-4 border border-green-200'>
                  <p className='font-bold text-gray-900 mb-2 flex items-center gap-2'>
                    <FaMapMarkerAlt className='text-green-600' />
                    Delivery Address:
                  </p>
                  <p className='text-gray-700 font-medium'>{currentOrder.deliveryAddress?.text}</p>
                </div>

                {/* Delivery Status */}
                {shopOrder.status === "pending" || shopOrder.status === "preparing" || shopOrder.status === "out of delivery" ? (
                  <div className='bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200'>
                    {shopOrder.assignedDeliveryBoy ? (
                      <div>
                        <div className='flex items-center gap-2 mb-4'>
                          <div className='bg-gradient-to-br from-purple-500 to-pink-600 p-2.5 rounded-xl'>
                            <MdDeliveryDining className='text-white text-2xl' />
                          </div>
                          <h3 className='font-bold text-gray-900 text-lg'>Delivery Partner</h3>
                        </div>
                        <div className='bg-white/80 rounded-xl p-4 space-y-2'>
                          <p className='flex items-center gap-2 text-gray-800'>
                            <FaUser className='text-purple-600' />
                            <span className='font-bold'>Name:</span>
                            <span className='font-medium'>{shopOrder.assignedDeliveryBoy.fullname}</span>
                          </p>
                          <p className='flex items-center gap-2 text-gray-800'>
                            <FaPhoneAlt className='text-green-600' />
                            <span className='font-bold'>Contact:</span>
                            <span className='font-medium'>{shopOrder.assignedDeliveryBoy.mobile}</span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className='flex items-center gap-3 bg-yellow-50 border border-yellow-300 rounded-xl p-4'>
                        <BsClockHistory className='text-yellow-600 text-2xl flex-shrink-0' />
                        <p className='font-semibold text-yellow-800'>Searching for a delivery partner...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl p-6 border-2 border-green-300 text-center'>
                    <FaCheckCircle className='text-green-600 text-5xl mx-auto mb-3' />
                    <p className='text-green-800 font-bold text-2xl'>Delivered Successfully!</p>
                  </div>
                )}

                {/* Map */}
                {shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered" &&
                  <div className='rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-200'>
                    <DeliveryBoyTracking data={{
                        deliveryBoyLocation:liveLocation[shopOrder.assignedDeliveryBoy._id] ||  
                        {
                          lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                          lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
                        },
                        customerLocation: {
                          lat: currentOrder.deliveryAddress.latitude,
                          lon: currentOrder.deliveryAddress.longitude
                        }
                      }}/>
                  </div>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrackOrderPage;
