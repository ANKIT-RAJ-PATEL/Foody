import React, { useState } from 'react'
import { PiLeafFill } from "react-icons/pi";
import { GiChickenOven } from "react-icons/gi";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
function FoodCard({ data }) {

    const renderStars = (rating) => {

        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                (i <= rating) ? (<FaStar key={i} className='text-yellow-500 text-lg' />) :
                    (<FaRegStar key={i} className='text-yellow-500 text-lg' />)
            )
        }
        return stars;
    }
    const [quantity, setQuantity] = useState(0);

    const hadleIncrease = () => {
        const newQty = quantity + 1;
        setQuantity(newQty);
    }
    const hadledecrease = () => {
        if (quantity > 0) {
            const newQty = quantity - 1;
            setQuantity(newQty);
        }
    }

    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.user);
    return (
        <div className='w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col '>
            <div className='relative w-full h-[170px] flex justify-center items-center bg-white'>
                <div className='absolute top-3 left-3 bg-white p-1 rounded-full shadow-md'>
                    {data.foodType == "Veg" ? <PiLeafFill size={20} style={{ color: 'green' }} /> :
                        <GiChickenOven size={20} style={{ color: 'red' }} />}
                </div>

                <img src={data.image} alt={data.name}
                    className='w-full h-full object-cover transition-transform duration-300 hover:scale-105' />
            </div>

            <div className='flex flex-1 flex-col p-4 '>
                <h1 className='font-semibold text-gray-900 text-base truncate'>{data.name}</h1>

                <div className='flex items-center gap-1 mt-1'>
                    {renderStars(data?.rating?.average || 0)}
                    <span>
                        {data.rating?.count || 0}
                    </span>
                </div>
            </div>
            <div className='flex items-center justify-between mt-auto p-3'>
                <span className="font-bold text-gray-900 text-lg flex items-center">
                    <MdOutlineCurrencyRupee className="text-lg" />
                    {data.price}
                </span>

                <div className='flex items-center border rounded-full overflow-hidden shadow-sm'>
                    <button className='px-2 py-1 hover:bg-gray-100 transition cursor-pointer'
                        onClick={hadledecrease}>
                        <FaMinus size={12} />
                    </button>
                    <span>{quantity}</span>
                    <button className='px-2 py-1 hover:bg-gray-100 transition cursor-pointer'
                        onClick={hadleIncrease}>
                        <FaPlus size={12} />
                    </button>
                    <button className={`${cartItems.some(i => i.id == data._id) ? "bg-gray-800" : "bg-[#ff4d2d]"}
                     text-white px-3 py-2 transition-colors cursor-pointer`}
                        onClick={() => {
                            quantity>0 &&
                            dispatch(addToCart({
                            id: data._id,
                            name: data.name,
                            price: data.price,
                            image: data.image,
                            shop: data.shop,
                            quantity,
                            foodType: data.foodType,
                        }))}}>
                        <FaShoppingCart size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FoodCard