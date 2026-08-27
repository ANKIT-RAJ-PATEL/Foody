import React, { useState } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClockLoader } from "react-spinners"



function AddItem() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [price, setPrice] = useState(0);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [foodType, setFoodType] = useState("Veg");
    const categories = ["Snacks",
        "Main Course",
        "Desserts",
        "Pizzas",
        "Burgers",
        "Sandwiches",
        "Drinks",
        "South Indians",
        "North Indians",
        "Chinese",
        "Fast Food",
        "Others"]
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }
    const hadleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("category", category);
            formData.append("foodType", foodType);
            formData.append("price", price);

            if (backendImage) {
                formData.append("image", backendImage);
            }
            const result = await axios.post(`${serverUrl}/api/item/additem`, formData,
                { withCredentials: true });
            dispatch(setMyShopData(result.data))
            setLoading(false);
            navigate("/");
            
        } catch (error) {
            setLoading(false);
            console.log("error in creating/editing item", error);
        }
    }


    const navigate = useNavigate();
    return (
        <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen'>
            <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer'
                onClick={() => navigate("/")}>
                <IoArrowBackSharp size={20} className='text-[#ff4d2d]' />
            </div>

            <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border-orange-100 '>
                <div className='flex flex-col items-center mb-6'>
                    <div className='bg-orange-100 p-4 rounded-full mb-4'>
                        <FaUtensils className='text-[#ff4d2d] w-16 h-16' />
                    </div>
                    <div className='text-3xl font-extrabold text-gray-900 '>
                        Add Food Item
                    </div>
                </div>
                <form className='space-y-5' onSubmit={hadleSubmit}>
                    <div >
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                        <input type="text" placeholder='Enter Food Name'
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>
                    <div >
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
                        <input type="file" accept='image/*'
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                            onChange={handleImage} />
                        {frontendImage &&
                            <div className='mt-4'>
                                <img src={frontendImage} className='w-full h-48 object-cover rounded-lg border' />
                            </div>}
                    </div>
                    <div >
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                        <input type="number" placeholder='0'
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        />
                    </div>

                    <div >
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Select Category</label>
                        <select
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}>
                            <option value="">Select Category</option>
                            {categories.map((cate, index) => (
                                <option value={cate} key={index}>{cate}</option>
                            ))}
                        </select>
                    </div>

                    <div >
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Select Food-Type</label>
                        <select
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                            onChange={(e) => setFoodType(e.target.value)}
                            value={foodType}>
                            <option value="Veg">Veg</option>
                            <option value="NonVeg">NonVeg</option>
                        </select>
                    </div>



                    <button className='w-full bg-[#ff4d2d] cursor-pointer text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200'>
                        {loading ? <ClockLoader size={25} color="#fff" /> : "Save"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddItem