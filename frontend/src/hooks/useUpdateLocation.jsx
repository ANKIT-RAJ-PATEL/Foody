import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App';



function useUpdateLocation() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        // const updateLocation = async (lat,lon) => {
        //   const result = await axios.post(`${serverUrl}/api/user/updatelocation`,
        //     {lat,lon},{withCredentials:true});
        //   }
        //   navigator.geolocation.watchPosition((position)=>{
        //     updateLocation(position.coords.latitude,position.coords.longitude)
        //   })
        // }, [userData])

        if(!userData) return;
        const updateLocation = async (lat,lon) => {
          const result = await axios.post(`${serverUrl}/api/user/updatelocation`,
            {lat,lon},{withCredentials:true});
          }

          navigator.geolocation.watchPosition((position)=>{
            updateLocation(position.coords.latitude,position.coords.longitude)
          })

        }, [userData])
}

export default useUpdateLocation;
