import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setItemsInMyCity } from '../redux/userSlice.js'
import { useSelector } from 'react-redux'

function useGetItemByCity() {
    const {currentCity} = useSelector(state=>state.user)
    const { userData } = useSelector(state=>state.user)
    const dispatch = useDispatch();
    useEffect(() => {
        // const fetchItems = async () => {
        //     try {
        //         const result = await axios.get(`${serverUrl}/api/item/getbycity/${currentCity}`,
        //             { withCredentials: true });
        //              dispatch(setItemsInMyCity(result.data))
        //     } catch (error) {
        //         console.log("error in fetching item by city", error);
        //     }
        // }
        // fetchItems();

        if(!userData) return;
        const fetchItems = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/item/getbycity/${currentCity}`,
                    { withCredentials: true });
                     dispatch(setItemsInMyCity(result.data))
            } catch (error) {
                console.log("error in fetching item by city", error);
            }
        }
        fetchItems();
    }, [currentCity, userData])
}

export default useGetItemByCity
