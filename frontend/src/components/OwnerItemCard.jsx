import axios from 'axios';
import React from 'react'
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdOutlineCurrencyRupee } from "react-icons/md";
import { PiLeafFill } from "react-icons/pi";
import { GiChickenOven } from "react-icons/gi";
import { BiCategory } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

function OwnerItemCard({ data}) {
  const navigate = useNavigate();
  const dispatch =useDispatch();

  const handleDeleteItem = async () => {
    try {
       const result = await axios.get(`${serverUrl}/api/item/deleteitem/${data._id}`,
        {withCredentials: true});
        dispatch(setMyShopData(result.data))
        navigate("/");
    } catch (error) {
      console.log("error in deleting item", error);
    }
  }
  return (
    <div className='flex flex-col sm:flex-row bg-white/90 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden border-2 border-orange-200 w-full transition-all duration-300 hover:scale-[1.02] group'>
      
      {/* Image */}
      <div className='w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 relative overflow-hidden'>
        <img 
          src={data.image} 
          alt={data.name || "food image"} 
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' 
        />
        <div className='absolute top-3 left-3 bg-white p-2 rounded-full shadow-lg'>
          {data.foodType === "Veg" ? 
            <PiLeafFill size={20} className='text-green-600' /> :
            <GiChickenOven size={20} className='text-red-600' />
          }
        </div>
      </div>

      {/* Content */}
      <div className='flex flex-col justify-between p-5 flex-1'>
        <div>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-3'>{data.name}</h2>
          <div className='space-y-2'>
            <p className='flex items-center gap-2 text-gray-700'>
              <BiCategory className='text-blue-600 text-lg' />
              <span className='font-semibold'>Category:</span> 
              <span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium'>{data.category}</span>
            </p>
            <p className='flex items-center gap-2 text-gray-700'>
              {data.foodType === "Veg" ? 
                <PiLeafFill className='text-green-600 text-lg' /> :
                <GiChickenOven className='text-red-600 text-lg' />
              }
              <span className='font-semibold'>Food Type:</span> 
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                data.foodType === "Veg" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>{data.foodType}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-gray-100">
          <div className="text-2xl font-bold text-[#ff4d2d] flex items-center">
            <MdOutlineCurrencyRupee className='text-3xl' />{data.price}
          </div>
          <div className='flex items-center gap-2'>
            <button 
              className='p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white cursor-pointer shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 active:scale-95'
              onClick={() => navigate(`/edititem/${data._id}`)}>
              <FaPencilAlt size={16} />
            </button>
            <button 
              className='p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white cursor-pointer shadow-lg hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-110 active:scale-95'
              onClick={handleDeleteItem}>
              <MdDelete size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerItemCard
