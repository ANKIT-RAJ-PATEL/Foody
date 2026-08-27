import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyShopData } from '../redux/ownerSlice.js'

function useGetMyShop() {
    const{userData}=useSelector(state=>state.user)
    const dispatch = useDispatch();
    useEffect(() => {
        // const fetchShop = async () => {
        //     try {
        //         const result = await axios.get(`${serverUrl}/api/shop/getmyshop`,
        //             { withCredentials: true });
        //              dispatch(setMyShopData(result.data))
        //     } catch (error) {
        //         console.log("error in fetching current user", error);
        //     }
        // }
        // fetchShop();

        if(!userData) return;
        const fetchShop = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/shop/getmyshop`,
                    { withCredentials: true });
                     dispatch(setMyShopData(result.data))
            } catch (error) {
                console.log("error in fetching current user", error);
            }
        }
        fetchShop();
    }, [userData])
}

export default useGetMyShop
