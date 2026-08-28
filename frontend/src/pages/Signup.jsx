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


function Signup() {
  const primaryColor = '#ff4d2d';
  const bgColor = '#fff9f6';
  const borderColor = '#ddd';

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  const[fullname,setFullName]=useState("");
  const[email,setEmail]=useState("");
  const[mobile,setMobile]=useState("");
  const[password,setPassword]=useState("");
  const [error,setError]=useState("");
  const[loading,setLoading]=useState(false);
  const dispatch=useDispatch();

  const handleSignup=async () => {
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, {
        fullname, email, mobile, password, role
      }, { withCredentials: true });
      console.log("signup successful");
      dispatch(setUserData(result.data))
      setError("");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Signup failed");
      
    }
  }

  const handleGoogleSignup=async () => {
    if(!mobile){
      return setError("Please enter mobile number before signing up with Google")
    }
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth,provider);
      const {data} =await axios.post(`${serverUrl}/api/auth/googleauth`,{
        fullname: result.user.displayName,
        email: result.user.email,
        mobile,
        role,
      },{withCredentials:true});
       dispatch(setUserData(data))
      
      setError("")
      setLoading(false);

    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message || "Google signup failed");
    }
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4' style={{ backgroundColor: bgColor }}>
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]`} style={{ border: `1px solid ${borderColor}` }}>
        <h1 className={`text-3xl font-bold mb-2 flex justify-center`} style={{ color: primaryColor }}
        >Foody</h1>
        

        {/* Full Name */}
        <div className='mb-4'>
          <label htmlFor="fullname" className='block text-gray-700 font-medium mb-1'>Full Name</label>
          <input type="text" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 '
            placeholder='Enter Your Full Name' onChange={(e)=>setFullName(e.target.value)} required
            value={fullname}/>
        </div>
        {/* Email */}
        <div className='mb-4'>
          <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
          <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 '
            placeholder='Enter Your Email' onChange={(e)=>setEmail(e.target.value)} required
            value={email}/>
        </div>
        {/* mobile */}
        <div className='mb-4'>
          <label htmlFor="mobile" className='block text-gray-700 font-medium mb-1'>
            Mobile
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500'
            placeholder='Enter Your Mobile Number'
            inputMode="numeric"
            maxLength={10}
            onChange={(e)=>setMobile(e.target.value)}
            value={mobile}
            required
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
          />
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
        {/* Role */}
        <div className='mb-4'>
          <label htmlFor="role" className='block text-gray-700 font-medium mb-1'>Role</label>
          <div className='flex gap-2'>
            {["user", "owner", "deliveryboy"].map((r) => (
              <button
                key={r}
                className='flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer'
                onClick={() => setRole(r)}
                style={role === r ? { backgroundColor: primaryColor, color: 'white' } : { border: `1px solid $${primaryColor}`, color: primaryColor }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <button className='w-full bg-[#ff4d2d] text-white font-semibold py-2 rounded-lg duration-200 cursor-pointer hover:bg-[#e64323]'
        onClick={handleSignup} disabled={loading}>
          {loading ? <ClockLoader size={25} color="#fff" /> : "Sign Up"}
        </button>

        <p className='text-red-500 text-center my-[10px]'>{error}</p>

        <h2 className='text-gray-400 font-semibold mt-2 flex justify-center'>OR</h2>
        <button className='w-full mt-3 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-300 hover:bg-gray-100 cursor-pointer'
        onClick={handleGoogleSignup}>
          <FcGoogle size={25} />
          <span>sign up with google</span>
        </button>
        <p className='text-center mt-4'>Allready have an account ?
          <span className='text-[#ff4d2d] hover:underline cursor-pointer' onClick={() => navigate("/signin")}>
            Sign in</span></p>
      </div>
    </div>
  )
}

export default Signup