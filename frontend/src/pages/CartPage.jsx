import React from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { BsCartX } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';

function CartPage() {
    const navigate = useNavigate();
    const { cartItems, totalAmount } = useSelector(state => state.user)
    return (
        <div className='min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex justify-center p-4 sm:p-6'>
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
                            <FaShoppingCart className='text-[#ff4d2d] text-3xl' />
                            <div>
                                <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>Your Cart</h1>
                                <p className='text-sm text-gray-600'>{cartItems?.length || 0} items in your basket</p>
                            </div>
                        </div>
                    </div>
                </div>

                {cartItems?.length == 0 ? (
                    <div className='bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-orange-100 p-12 text-center animate-fadeIn'>
                        <BsCartX className='text-gray-300 text-8xl mx-auto mb-6' />
                        <h2 className='text-2xl font-bold text-gray-800 mb-3'>Your Cart is Empty</h2>
                        <p className='text-gray-500 text-lg mb-6'>Looks like you haven't added anything to your cart yet</p>
                        <button 
                            onClick={() => navigate('/')}
                            className='bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white px-8 py-3 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-[#ff4d2d]/50 hover:scale-105 transition-all duration-300'>
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className='space-y-4 mb-6'>
                            {cartItems?.map((item, index) => (
                                <div key={index} className='animate-fadeIn' style={{ animationDelay: `${index * 0.1}s` }}>
                                    <CartItemCard data={item} />
                                </div>
                            ))}
                        </div>

                        {/* Price Summary */}
                        <div className='bg-gradient-to-r from-white via-orange-50 to-white rounded-3xl shadow-2xl border-2 border-orange-200 p-6 mb-6 animate-fadeIn'>
                            <div className='space-y-3'>
                                <div className='flex items-center justify-between pb-3 border-b border-gray-200'>
                                    <span className='text-gray-600 text-lg'>Subtotal</span>
                                    <span className='text-xl font-semibold text-gray-800 flex items-center'>
                                        <MdOutlineCurrencyRupee className='text-xl' />{totalAmount}
                                    </span>
                                </div>
                                <div className='flex items-center justify-between pb-3 border-b border-gray-200'>
                                    <span className='text-gray-600 text-lg'>Delivery Fee</span>
                                    <span className='text-lg font-medium text-green-600'>FREE</span>
                                </div>
                                <div className='flex items-center justify-between pt-2'>
                                    <h1 className='text-2xl font-bold text-gray-900'>Total Amount</h1>
                                    <span className='text-3xl font-bold bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] bg-clip-text text-transparent flex items-center'>
                                        <MdOutlineCurrencyRupee className='text-3xl text-[#ff4d2d]' />{totalAmount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <div className='flex justify-center animate-fadeIn'>
                            <button 
                                onClick={()=>navigate("/checkout")}
                                className='w-full sm:w-auto bg-gradient-to-r from-[#ff4d2d] via-[#ff6b4d] to-[#ff4d2d] bg-[length:200%_100%] text-white px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:shadow-[#ff4d2d]/60 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer animate-gradient'>
                                <FaShoppingCart className='text-2xl' />
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CartPage