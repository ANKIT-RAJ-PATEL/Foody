import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setShopsInMyCity } from '../redux/userSlice.js'
import { useSelector } from 'react-redux'

function useGetShopByCity() {
    const { currentCity } = useSelector(state => state.user)
    const { userData } = useSelector(state => state.user)
    const dispatch = useDispatch();
    useEffect(() => {
        // const fetchShops = async () => {
        //     try {
        //         const result = await axios.get(`${serverUrl}/api/shop/getbycity/${currentCity}`,
        //             { withCredentials: true });
        //         dispatch(setShopsInMyCity(result.data))
        //     } catch (error) {
        //         console.log("error in fetching current user", error);
        //     }
        // }
        // fetchShops();

        if(!userData) return;
        const fetchShops = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/shop/getbycity/${currentCity}`,
                    { withCredentials: true });
                dispatch(setShopsInMyCity(result.data))
            } catch (error) {
                console.log("error in fetching current user", error);
            }
        }
        fetchShops();
    }, [currentCity, userData])
}

export default useGetShopByCity
