import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import { FaUtensils, FaPencilAlt, FaStore, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import { MdRestaurantMenu, MdLocationCity } from "react-icons/md";
import { BsStarFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import OwnerItemCard from './OwnerItemCard';

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate();
  

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex flex-col items-center'>
      <Nav />
      {!myShopData &&
        <div className='flex justify-center items-center p-4 sm:p-6 mt-12 animate-fadeIn'>
          <div className='w-full max-w-lg bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 border-2 border-orange-200 hover:shadow-[#ff4d2d]/20 transition-all duration-300 hover:scale-105'>
            <div className='flex flex-col items-center text-center'>
              <div className='bg-gradient-to-br from-[#ff4d2d] to-[#ff6b4d] p-6 rounded-full mb-6 shadow-xl'>
                <FaUtensils className='text-white w-16 h-16' />
              </div>
              <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3'>Add Your Restaurant</h2>
              <p className='text-gray-600 mb-6 text-base sm:text-lg leading-relaxed'>
                Join our food delivery platform and reach thousands of hungry customers every day.
              </p>
              <button className='bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white px-8 py-3 rounded-full font-bold shadow-xl hover:shadow-2xl hover:shadow-[#ff4d2d]/50 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 text-lg'
                onClick={() => navigate("/createditshop")}>
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      }
      {myShopData &&
        <div className='w-full flex flex-col items-center gap-6 px-4 sm:px-6 pb-10'>
          {/* Welcome Header */}
          <div className='bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-orange-100 p-6 mt-8 w-full max-w-4xl animate-slideInLeft'>
            <div className='flex items-center gap-4'>
              <div className='bg-gradient-to-br from-[#ff4d2d] to-[#ff6b4d] p-4 rounded-2xl shadow-lg'>
                <FaStore className='text-white text-3xl' />
              </div>
              <div>
                <h1 className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                  Welcome to {myShopData.name}
                </h1>
                <p className='text-gray-600 mt-1'>Manage your restaurant & menu</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl'>
            <div className='bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-5 border-2 border-blue-300 shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-fadeIn'>
              <div className='flex items-center gap-3 mb-2'>
                <MdRestaurantMenu className='text-blue-600 text-2xl' />
                <span className='text-blue-800 font-semibold'>Total Items</span>
              </div>
              <p className='text-3xl font-bold text-blue-900'>{myShopData?.items?.length || 0}</p>
            </div>
            <div className='bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-5 border-2 border-purple-300 shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-fadeIn' style={{ animationDelay: '0.1s' }}>
              <div className='flex items-center gap-3 mb-2'>
                <MdLocationCity className='text-purple-600 text-2xl' />
                <span className='text-purple-800 font-semibold'>Location</span>
              </div>
              <p className='text-lg font-bold text-purple-900'>{myShopData?.city}</p>
            </div>
            <div className='bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-5 border-2 border-yellow-300 shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-fadeIn' style={{ animationDelay: '0.2s' }}>
              <div className='flex items-center gap-3 mb-2'>
                <BsStarFill className='text-yellow-600 text-2xl' />
                <span className='text-yellow-800 font-semibold'>Rating</span>
              </div>
              <p className='text-3xl font-bold text-yellow-900'>4.5</p>
            </div>
          </div>

          {/* Shop Card */}
          <div className='bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden border-2 border-orange-200 hover:shadow-[#ff4d2d]/20 transition-all duration-300 w-full max-w-4xl relative group animate-fadeIn'>
            <button className='absolute top-6 right-6 z-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-full shadow-xl cursor-pointer hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300'
              onClick={()=>navigate("/createditshop")}>
              <FaPencilAlt size={18} />
            </button>
            <div className='relative'>
              <img src={myShopData.image} alt={myShopData.name} className='w-full h-56 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500' />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
            </div>
            <div className='p-6 sm:p-8'>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3'>
                <FaStore className='text-[#ff4d2d]' />
                {myShopData.name}
              </h1>
              <div className='space-y-2'>
                <p className='text-gray-700 flex items-center gap-2 text-lg'>
                  <MdLocationCity className='text-[#ff4d2d]' />
                  <span className='font-semibold'>{myShopData.city}, {myShopData.state}</span>
                </p>
                <p className='text-gray-600 flex items-center gap-2'>
                  <FaMapMarkerAlt className='text-[#ff4d2d]' />
                  <span>{myShopData.address}</span>
                </p>
              </div>
            </div>
          </div>
          {myShopData?.items?.length == 0 && 
          <div className='flex justify-center items-center p-4 sm:p-6 w-full max-w-4xl animate-fadeIn'>
            <div className='w-full bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 border-2 border-orange-200 hover:shadow-[#ff4d2d]/20 transition-all duration-300'>
              <div className='flex flex-col items-center text-center'>
                <div className='bg-gradient-to-br from-orange-400 to-red-500 p-6 rounded-full mb-6 shadow-xl'>
                  <MdRestaurantMenu className='text-white w-16 h-16' />
                </div>
                <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3'>Add Your First Food Item</h2>
                <p className='text-gray-600 mb-6 text-base sm:text-lg leading-relaxed max-w-md'>
                  Start building your menu and attract hungry customers with delicious dishes.
                </p>
                <button className='bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white px-8 py-3 rounded-full font-bold shadow-xl hover:shadow-2xl hover:shadow-[#ff4d2d]/50 transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 text-lg flex items-center gap-3'
                  onClick={() => navigate("/addfood")}>
                  <FaPlus />
                  Add Food Item
                </button>
              </div>
            </div>
          </div>}

          {myShopData?.items?.length > 0 && 
          <div className='flex flex-col items-center gap-4 w-full max-w-4xl'>
            <div className='w-full flex items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-orange-100'>
              <div className='flex items-center gap-3'>
                <MdRestaurantMenu className='text-[#ff4d2d] text-3xl' />
                <h2 className='text-2xl font-bold text-gray-900'>Your Menu Items</h2>
              </div>
              <button 
                onClick={() => navigate("/addfood")}
                className='bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 flex items-center gap-2'>
                <FaPlus />
                Add New
              </button>
            </div>
            {myShopData.items.map((item,index)=>(
              <div key={index} className='w-full animate-fadeIn' style={{ animationDelay: `${index * 0.05}s` }}>
                <OwnerItemCard data={item}/>
              </div>
            ))}
          </div>
          }
        </div>
      }

    </div>
  )
}

export default OwnerDashboard