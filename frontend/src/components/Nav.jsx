/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import axios from 'axios';
import { serverUrl } from '../App';
// import { setSearchItems, setUserData } from '../redux/userSlice';
import { setSearchItems, setUserData, setCurrentCity } from '../redux/userSlice';
import { FiPlus } from "react-icons/fi";
import { TbReceiptRupee } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';



function Nav() {
  const navigate = useNavigate();
  const { userData, currentCity, cartItems, myOrders } = useSelector(state => state.user)
  const { myShopData } = useSelector(state => state.owner)
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [cityInput, setCityInput] = useState(currentCity || "");
  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`,
        { withCredentials: true })
      dispatch(setUserData(null))
    } catch (error) {
      console.log("logout error", error);
    }
  }

  const handleSearchItems = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/searchitem?query=${query}&city=${currentCity}`,
        { withCredentials: true })
       dispatch(setSearchItems(result.data))
    } catch (error) {
      console.log("search item error:", error);
    }
  }

  useEffect(() => {
    if (query) {
      handleSearchItems();
    }else{
      dispatch(setSearchItems(null))
    }

  }, [query])

  useEffect(() => {
    setCityInput(currentCity || "");
  }, [currentCity])

  return (
    <div className='w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible'>

      {showSearch && userData.role == "user" &&
        <div className='w-[90%] h-[70px] bg-white shadow-xl rounded-lg flex items-center gap-[20px] fixed top-[80px] left-[5%] md:hidden'>

          <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
            <FaLocationDot size={20} className='text-[#ff4d2d]' />
            {/* <div className='w-[80%] truncate text-gray-600'>{currentCity}</div> */}
            <input
              type="text"
              className='w-[80%] truncate text-gray-600 outline-none bg-transparent'
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onBlur={() => { if(cityInput.trim()) dispatch(setCurrentCity(cityInput.trim())) }}
              onKeyDown={(e) => { if(e.key === "Enter" && cityInput.trim()) dispatch(setCurrentCity(cityInput.trim())) }}
              placeholder='Enter city'
            />
          </div>
          <div className='w-[70%] flex items-center gap-[10px]'>
            <FaSearch size={20} className='text-[#ff4d2d]' />
            <input
              type="text"
              placeholder='search delicious food...'
              className='px-[10px] text-gray-700 outline-0 w-full'
              onChange={(e) => setQuery(e.target.value)} value={query} />
          </div>
        </div>}


      <h1 className='text-3xl font-bold mb-2 text-[#ff4d2d]'>Foody</h1>
      {userData.role == "user" &&
        <div className='md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] hidden md:flex'>
          <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400'>
            <FaLocationDot size={20} className='text-[#ff4d2d]' />
            {/* <div className='w-[80%] truncate text-gray-600'>{currentCity}</div> */}
            <input
              type="text"
              className='w-[80%] truncate text-gray-600 outline-none bg-transparent'
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onBlur={() => { if(cityInput.trim()) dispatch(setCurrentCity(cityInput.trim())) }}
              onKeyDown={(e) => { if(e.key === "Enter" && cityInput.trim()) dispatch(setCurrentCity(cityInput.trim())) }}
              placeholder='Enter city'
            />
          </div>

          <div className='w-[80%] flex items-center gap-[10px]'>
            <FaSearch size={20} className='text-[#ff4d2d]' />
            <input type="text" placeholder='search dilicious food...'
              className='px-[10px] text-gray-700 outline-0 w-full'
              onChange={(e) => setQuery(e.target.value)} value={query} />
          </div>
        </div>
      }


      <div className='flex items-center gap-4'>
        {userData.role == "user" &&
          (showSearch ? <IoCloseSharp size={15} className='text-[#ff4d2d] md:hidden' onClick={() => setShowSearch(false)} /> :
            <FaSearch size={20} className='text-[#ff4d2d] md:hidden' onClick={() => setShowSearch(true)} />)}

        {userData.role == "owner" ?
          <>
            {myShopData &&
              <>
                <button className='hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'
                  onClick={() => navigate("/addfood")}>
                  <FiPlus size={20} />
                  Add Item
                </button>
                <button className='md:hidden flex items-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]'>
                  <FiPlus size={20} />
                </button>
              </>}

            <div className='text-[#ff4d2d] cursor-pointer hidden md:flex items-center gap-2 relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 font-medium' onClick={() => navigate("/myorders")}>
              <TbReceiptRupee size={20} />
              <span>My Orders</span>
              {/* <span className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]'>0</span> */}
              {myOrders?.length > 0 && <span className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]'>{myOrders.length}</span>}
            </div>
            <div className='text-[#ff4d2d] cursor-pointer md:hidden flex items-center gap-2 relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 font-medium' onClick={() => navigate("/myorders")}>
              <TbReceiptRupee size={20} />
              {/* <span className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]'>0</span> */}
              {myOrders?.length > 0 && <span className='absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px]'>{myOrders.length}</span>}
            </div>
          </> : (
            <>
              {userData.role == "user" &&
                <div className='relative cursor-pointer hover:bg-gray-200' onClick={() => navigate("/cart")}>
                  <MdOutlineShoppingCart size={20} className='text-[#ff4d2d] ' />
                  <span className='absolute right-[-9px] top-[-12px] text-[#ff4d2d]'>{cartItems.length}</span>
                </div>}



              <button className='hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium cursor-pointer hover:bg-gray-200'
                onClick={() => navigate("/myorders")}>
                My Orders
              </button>
            </>
          )}



        <div className='w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer hover:bg-red-300'
          onClick={() => setShowInfo(prev => !prev)}>
          {userData?.fullname.slice(0, 1).toUpperCase()}
        </div>
        {showInfo &&
          <div className={`fixed top-[80px] right-[10px] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]
          ${userData.role == "deliveryboy" ? "md:right-[20%] lg:right-[35%]" : "md:right-[10%] lg:right-[25%]"}`}>
            <div className='text-[17px] font-semibold'>{userData.fullname}</div>
            <div className='md:hidden text-[#ff4d2d] font-semibold cursor-pointer'
              onClick={() => navigate("/myorders")}>My Orders</div>
            <div className='text-[#ff4d2d] font-semibold cursor-pointer'
              onClick={handleLogout}
            >Logout</div>
          </div>
        }
      </div>
    </div>
  )
}

export default Nav