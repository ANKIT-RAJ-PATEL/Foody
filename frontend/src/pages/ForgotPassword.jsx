/* eslint-disable no-unused-vars */
import React from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { ClockLoader } from "react-spinners"


function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [comfirmpassword, setComfirmpassword] = useState("");
    const navigate = useNavigate();
    const[loading,setLoading]=useState(false);
    const [error,setError]=useState("");


    const handleSendOtp = async () => {
        setLoading(true);
    
        try {
            const result = await axios.post(`${serverUrl}/api/auth/sendotp`,{email},
                {withCredentials: true}
            )
            setStep(2);
            setError("")
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    }

    const handleVerifyOtp = async () => {
        setLoading(true);
        if(!otp){
            return setError("Please enter otp")
        }
        try {
            const result = await axios.post(`${serverUrl}/api/auth/verifyotp`,{email,otp},
                {withCredentials: true}
            )
            setStep(3);
            setError("")
            setLoading(false);
        } catch (error) {
            setLoading(false);
           setError(error?.response?.data?.message);
        }
    }

    const handleResetpassword = async () => {
        setLoading(true);
        if(!newPassword || !comfirmpassword){
            return setError("Please fill all the fields")
        }
        if(newPassword != comfirmpassword){
            return setError("Password not match")
        }
        try {
            const result = await axios.post(`${serverUrl}/api/auth/resetpassword`,{email,newPassword},
                {withCredentials: true}
            )
           
            navigate("/signin");
            setError("")
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error?.response?.data?.message);
        }
    }

    

    return (
        <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
                <div className='flex items-center gap-3 mb-4  '>
                    <IoMdArrowBack size={30} className='text-[#ff4d2d] cursor-pointer' onClick={() => navigate("/signin")} />
                    <h1 className='text-2xl font-bold text-center mb-1 text-[#ff4d2d]'>Forgot Password</h1>
                </div>
                {step === 1 &&
                    <div>
                        {/* Email */}
                        <div className='mb-6'>
                            <label htmlFor="email" className='block text-gray-700 font-medium mb-1'>Email</label>
                            <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 '
                                placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} required
                                value={email} />
                        </div>
                        <button className='w-full bg-[#ff4d2d] text-white font-semibold py-2 rounded-lg duration-200 cursor-pointer hover:bg-[#e64323]'
                        onClick={handleSendOtp} disabled={loading}>
                            {loading ? <ClockLoader size={25} color="#fff" /> : "Send OTP"}
                            
                        </button>
                        <p className='text-red-500 text-center my-[10px]'>{error}</p>
                    </div>}
                {step === 2 &&
                    <div>
                        {/* OTP */}
                        <div className='mb-6'>
                            <label htmlFor="otp" className='block text-gray-700 font-medium mb-1'>OTP</label>
                            <input type="otp" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 '
                                placeholder='Enter OTP' onChange={(e) => setOtp(e.target.value)} required
                                value={otp} />
                        </div>
                        <button className='w-full bg-[#ff4d2d] text-white font-semibold py-2 rounded-lg duration-200 cursor-pointer hover:bg-[#e64323]'
                        onClick={handleVerifyOtp} >
                            {loading ? <ClockLoader size={25} color="#fff" /> : "Verify"}
                            
                        </button>
                        <p className='text-red-500 text-center my-[10px]'>{error}</p>
                    </div>}

                {step === 3 &&
                    <div>
                        {/* reset password */}
                        <div className='mb-4'>
                            <label htmlFor="newpassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
                            <input type="otp" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 '
                                placeholder='Enter New Password' onChange={(e) => setNewPassword(e.target.value)} required
                                value={newPassword} />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="comfirmpassword" className='block text-gray-700 font-medium mb-1'>Comfirm Password</label>
                            <input type="otp" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 '
                                placeholder='Comfirm Password' onChange={(e) => setComfirmpassword(e.target.value)} required
                                value={comfirmpassword} />
                        </div>
                        <button className='w-full bg-[#ff4d2d] text-white font-semibold py-2 rounded-lg duration-200 cursor-pointer hover:bg-[#e64323]'
                        onClick={handleResetpassword} >
                            {loading ? <ClockLoader size={25} color="#fff" /> : "Reset Password"}
                            
                        </button>
                        <p className='text-red-500 text-center my-[10px]'>{error}</p>
                    </div>}
            </div>
        </div>
    )
}

export default ForgotPassword