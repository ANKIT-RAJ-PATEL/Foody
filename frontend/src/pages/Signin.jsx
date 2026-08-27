
import React from 'react'
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClockLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import {setUserData } from '../redux/userSlice.js';




function Signin() {
  const primaryColor = '#ff4d2d';
  const bgColor = '#fff9f6';
  const borderColor = '#ddd';

  const [showPassword, setShowPassword] = useState(false);  
  const navigate = useNavigate();
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const dispatch=useDispatch()
  

  const handleSignin=async () => {
    setLoading(true);
    try {
      const result=await axios.post(`${serverUrl}/api/auth/signin`,{
        email,password
      },{withCredentials:true});
       dispatch(setUserData(result.data))
    
      setError("")
      setLoading(false);
    
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  }

  const handleGoogleSignin=async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { data } = await axios.post(
        `${serverUrl}/api/auth/googleauth`,
        {
          fullname: result.user.displayName, email: result.user.email, mobile: result.user.phoneNumber, role: "user"
        },
        { withCredentials: true }
      );
       dispatch(setUserData(data))
    
      setError("")
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message);
    }
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4' style={{ backgroundColor: bgColor }}>
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]`} style={{ border: `1px solid ${borderColor}` }}>
        <h1 className={`text-3xl font-bold mb-2 flex justify-center`} style={{ color: primaryColor }}
        >Foody</h1>
        

        {/* Email */}
        <div className='mb-4'>
          <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
          <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 '
            placeholder='Enter Your Email' onChange={(e)=>setEmail(e.target.value)} required
            value={email} />
        </div>

        {/* Password */}
        <div className='mb-4'>
          <label htmlFor="password" className='block text-gray-700 font-medium mb-1'>Password</label>
          <div className='relative'>
            <input type={`${showPassword ? 'text' : 'password'}`} className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 '
              placeholder='Enter Your Password'onChange={(e)=>setPassword(e.target.value)} required
            value={password}/>
            <button className='absolute right-3 top-[11px] text-gray-600 cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
          </div>
        </div>
         <div className='text-right mb-4 text-[#ff4d2d] hover:underline cursor-pointer'onClick={()=>navigate("/forgotpassword")}>
          Forgot Password
         </div>
        <button className='w-full bg-[#ff4d2d] text-white font-semibold py-2 rounded-lg duration-200 cursor-pointer hover:bg-[#e64323]'
        onClick={handleSignin} disabled={loading}>
          {loading ? <ClockLoader size={25} color="#fff" /> : "Sign In"}
        </button>
        <p className='text-red-500 text-center my-[10px]'>{error}</p>
        <h2 className='text-gray-400 font-semibold mt-2 flex justify-center'>OR</h2>
        <button className='w-full mt-3 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-300 hover:bg-gray-100 cursor-pointer'
        onClick={handleGoogleSignin}>
          <FcGoogle size={25} />
          <span>sign in with google</span>
        </button>
        <p className='text-center mt-4'>Don't have an account ?
          <span className='text-[#ff4d2d] hover:underline cursor-pointer' onClick={() => navigate("/signup")}>
             Sign Up</span></p>
      </div>
    </div>
  )
}

export default Signin