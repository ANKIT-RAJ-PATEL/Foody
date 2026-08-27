import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'

function useGetCurrehtUser() {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/currentuser`,
                    { withCredentials: true });
                     dispatch(setUserData(result.data))
            
        } catch (error) {
            console.log("error in fetching current user", error);
        }
    }
    fetchUser();
    }, [])
}

export default useGetCurrehtUser