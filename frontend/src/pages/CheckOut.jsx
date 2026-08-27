/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import { TileLayer } from 'react-leaflet';
import { Marker } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation, setMapAddress } from '../redux/mapSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileAlt } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { serverUrl } from "../App"
import { ClipLoader } from "react-spinners"
import { addMyOrder } from '../redux/userSlice';



function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap();
    map.setView([location.lat, location.lon], 16, { animate: true });
  }
  return null;
}


function CheckOut() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { location, address } = useSelector(state => state.map)
  const { cartItems, totalAmount, userData } = useSelector(state => state.user)
  const [addressInput, setAddressInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const apikey = import.meta.env.VITE_GEO_APIKEY
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const amountWithDeliveryFee = totalAmount + deliveryFee;

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lon: lng }))
    getAdddressByLatLng(lat, lng)
  }

  const getAdddressByLatLng = async (lat, lng) => {
    try {

      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apikey}`);
      dispatch(setMapAddress(result?.data?.results[0].formatted))

    } catch (error) {

      console.log("error in get address by lat lng", error);
    }
  }

  const getCurrentLocation = () => {
    setLoading(true);
    const latitude = userData.location.coordinates[1];
    const longitude = userData.location.coordinates[0];
    dispatch(setLocation({ lat: latitude, lon: longitude }));
    getAdddressByLatLng(latitude, longitude);
    setLoading(false);
  }

  const getLatLngByAddress = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apikey}`);
      const { lat, lon } = result.data.features[0].properties
      dispatch(setLocation({ lat, lon }))
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error in get lat lng by address", error);
    }
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/order/placeorder`, {
        paymentMethod,
        deliveryAddress: {
          text: addressInput,
          latitude: location.lat,
          longitude: location.lon,
        },
        totalAmount : amountWithDeliveryFee,
        cartItems,

      }, { withCredentials: true });

      if (paymentMethod == "cod") {
        dispatch(addMyOrder(result.data))
        navigate("/orderplaced")
      } else {
        const orderId = result.data.orderId;
        const razorOrder = result.data.razorOrder;
        openRazorpayWindow(orderId, razorOrder)
      }
      setLoading(false);
    
    } catch (error) {
      setLoading(false);
      console.log("error in place order in chekout", error);
    }
  }

  const openRazorpayWindow = (orderId, razorOrder) => {

    if (!window.Razorpay) {
      alert("Payment gateway not available. Please refresh and try again.");
      setLoading(false);
      return;
    }
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      name: "Foody Food Delivery",
      description: "Test Transaction",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(`${serverUrl}/api/order/verifypayment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              orderId,
            }, { withCredentials: true })
          dispatch(addMyOrder(result.data))
          navigate("/orderplaced")
        } catch (error) {
          console.log("error in verify payment handler", error);
        }
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.open();
  }

  useEffect(() => {
    setAddressInput(address)
  }, [address])

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4 sm:p-6'>
      <button 
        className='absolute top-6 left-6 z-[999] bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white p-3 rounded-full shadow-2xl hover:shadow-[#ff4d2d]/50 hover:scale-110 transition-all duration-300'
        onClick={() => navigate("/cart")}>
        <IoArrowBackSharp size={22} />
      </button>
      <div className='w-full max-w-[1000px] bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-orange-100 space-y-8 animate-fadeIn'>
        <div className='flex items-center gap-3 border-b border-gray-200 pb-4'>
          <div className='w-1.5 h-12 bg-gradient-to-b from-[#ff4d2d] to-[#ff8c6d] rounded-full'></div>
          <h1 className='font-bold text-3xl sm:text-4xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>Checkout</h1>
        </div>

        <section className='bg-gradient-to-r from-white via-orange-50/30 to-white rounded-2xl p-6 shadow-lg border border-orange-100'>
          <h2 className='text-xl font-bold mb-4 flex items-center gap-3 text-gray-800'>
            <div className='bg-gradient-to-br from-[#ff4d2d] to-[#ff6b4d] p-2.5 rounded-xl shadow-lg'>
              <FaLocationDot size={22} className='text-white' />
            </div>
            Delivery Location
          </h2>
          <div className='flex flex-col sm:flex-row gap-3 mb-4'>
            <input
              type="text"
              className="flex-1 border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#ff4d2d] focus:ring-2 focus:ring-[#ff4d2d]/20 transition-all bg-white shadow-sm"
              placeholder='Enter Your Delivery Address'
              value={addressInput}
              onChange={(e) => { setAddressInput(e.target.value) }}
            />
            <button className='bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] hover:shadow-xl hover:shadow-[#ff4d2d]/40 text-white px-5 py-3 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95'
              onClick={getLatLngByAddress} >
              {loading ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                <IoSearch size={20} />
              )}
            </button>
            <button className='bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-xl hover:shadow-blue-500/40 text-white px-5 py-3 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95'
              onClick={getCurrentLocation}>
              {loading ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                <TbCurrentLocation size={20} />
              )}
            </button>
          </div>
          <div className='rounded-2xl border-2 border-orange-200 overflow-hidden shadow-xl'>
            <div className='h-72 sm:h-80 w-full flex items-center justify-center'>
              <MapContainer className={'w-full h-full'}
                center={[location?.lat, location?.lon]}
                zoom={13}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker position={[location?.lat, location?.lon]}
                  draggable eventHandlers={{ dragend: onDragEnd }} />

              </MapContainer>
            </div>
          </div>
        </section>

        <section className='bg-gradient-to-r from-white via-blue-50/30 to-white rounded-2xl p-6 shadow-lg border border-blue-100'>
          <h2 className='text-xl font-bold mb-4 flex items-center gap-3 text-gray-800'>
            <div className='bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg'>
              <FaCreditCard size={22} className='text-white' />
            </div>
            Payment Method
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className={`relative flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all cursor-pointer group ${paymentMethod === "cod" ? "border-green-500 bg-gradient-to-br from-green-50 to-white shadow-xl shadow-green-500/20 scale-105" : "border-gray-200 hover:border-green-300 hover:shadow-lg bg-white"}`} onClick={() => setPaymentMethod("cod")}>
              {paymentMethod === "cod" && (
                <div className='absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg'>
                  <BsCheckCircleFill className='text-white text-xl' />
                </div>
              )}
              <span className='inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg group-hover:scale-110 transition-transform'>
                <MdDeliveryDining className='text-white text-2xl' />
              </span>
              <div>
                <p className='font-bold text-gray-900 text-lg'>Cash On Delivery</p>
                <p className='text-sm text-gray-600'>Pay when your food arrives</p>
              </div>
            </div>

            <div className={`relative flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all group ${paymentMethod === "online" ? "border-purple-500 bg-gradient-to-br from-purple-50 to-white shadow-xl shadow-purple-500/20 scale-105" : "border-gray-200 hover:border-purple-300 hover:shadow-lg bg-white cursor-pointer"}`} onClick={() => setPaymentMethod("online")}>
              {paymentMethod === "online" && (
                <div className='absolute -top-2 -right-2 bg-purple-500 rounded-full p-1 shadow-lg'>
                  <BsCheckCircleFill className='text-white text-xl' />
                </div>
              )}
              <span className='inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg group-hover:scale-110 transition-transform'>
                <FaMobileAlt className='text-white text-xl' />
              </span>
              <div>
                <p className='font-bold text-gray-900 text-lg'>Online Payment</p>
                <p className='text-sm text-gray-600'>UPI / Card / Net Banking</p>
              </div>
            </div>
          </div>
        </section>

        <section className='bg-gradient-to-br from-orange-50 via-white to-pink-50 rounded-2xl p-6 shadow-lg border-2 border-orange-200'>
          <h2 className='text-xl font-bold mb-4 flex items-center gap-3 text-gray-800'>
            <div className='bg-gradient-to-br from-[#ff4d2d] to-[#ff8c6d] p-2.5 rounded-xl shadow-lg'>
              <MdOutlineCurrencyRupee size={24} className='text-white' />
            </div>
            Order Summary
          </h2>
          <div className='rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-100 p-5 space-y-3 shadow-md'>
            <div className='space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-hide'>
              {cartItems?.map((item, index) => (
                <div key={index} className='flex justify-between text-sm text-gray-700 bg-gray-50 p-2 rounded-lg'>
                  <span className='font-medium'>{item.name} <span className='text-gray-500'>× {item.quantity}</span></span>
                  <span className="font-bold text-gray-900 flex items-center">
                    <MdOutlineCurrencyRupee className='text-sm' />{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <hr className='border-gray-300 my-3' />
            <div className='flex justify-between font-semibold text-gray-800 text-base'>
              <span>Subtotal</span>
              <span className='flex items-center'>
                <MdOutlineCurrencyRupee className='text-base' />{totalAmount}
              </span>
            </div>
            <div className='flex justify-between font-semibold text-gray-800 text-base'>
              <span>Delivery Fee</span>
              <span className={`${deliveryFee == 0 ? 'text-green-600' : ''} flex items-center`}>
                {deliveryFee == 0 ? "FREE" : <><MdOutlineCurrencyRupee className='text-base' />{deliveryFee}</>}
              </span>
            </div>
            <div className='bg-gradient-to-r from-orange-100 to-pink-100 rounded-xl p-4 mt-3'>
              <div className='flex justify-between text-xl font-bold text-gray-900'>
                <span>Grand Total</span>
                <span className='text-2xl bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] bg-clip-text text-transparent flex items-center'>
                  <MdOutlineCurrencyRupee className='text-2xl text-[#ff4d2d]' />{amountWithDeliveryFee}
                </span>
              </div>
            </div>
          </div>
        </section>
        
        <button className='w-full bg-gradient-to-r from-[#ff4d2d] via-[#ff6b4d] to-[#ff4d2d] bg-[length:200%_100%] hover:shadow-2xl hover:shadow-[#ff4d2d]/50 text-white py-4 rounded-2xl text-xl font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 animate-gradient flex items-center justify-center gap-3'
          onClick={handlePlaceOrder}>
          {loading ? (
            <>
              <ClipLoader size={24} color="#fff" />
            </>
          ) : (
            <>
              {paymentMethod === "cod" ? (
                <>
                  <MdDeliveryDining className='text-2xl' />
                  <span>Place Order</span>
                </>
              ) : (
                <>
                  <FaCreditCard className='text-xl' />
                  <span>Proceed to Pay</span>
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CheckOut