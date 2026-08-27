import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders } from '../redux/userSlice.js'

function useGetMyOrders() {
    const{userData}=useSelector(state=>state.user)
    const dispatch = useDispatch();
    useEffect(() => {
        // const fetchOrders = async () => {
        //     try {
        //         const result = await axios.get(`${serverUrl}/api/order/myorder`,
        //             { withCredentials: true });
        //              dispatch(setMyOrders(result.data))
        //     } catch (error) {
        //         console.log("error in fetching current user", error);
        //     }
        // }
        // fetchOrders();

        if(!userData) return;
        const fetchOrders = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/order/myorder`,
                    { withCredentials: true });
                     dispatch(setMyOrders(result.data))
            } catch (error) {
                console.log("error in fetching current user", error);
            }
        }
        fetchOrders();
    }, [userData])
}

export default useGetMyOrders
