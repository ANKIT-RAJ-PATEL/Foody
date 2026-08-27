import React from 'react'
import scooter from "../assets/scooter.png"
import home from "../assets/home.png"
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { MapContainer, Polyline, Popup } from 'react-leaflet';
import { TileLayer } from 'react-leaflet';
import { Marker } from 'react-leaflet';

const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [35, 35],
  iconAnchor: [17, 35],
})
const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [35, 35],
  iconAnchor: [17, 35],
})

function DeliveryBoyTracking({ data }) {

  const deliveryBoyLat = data.deliveryBoyLocation?.lat
  const deliveryBoyLon = data.deliveryBoyLocation?.lon
  const custsomerLat = data.customerLocation?.lat
  const custsomerLon = data.customerLocation?.lon

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [custsomerLat, custsomerLon]
  ]

  const center = [deliveryBoyLat, deliveryBoyLon]

  return (
    <div className='w-full h-[450px] relative'>
      <div className='absolute top-4 left-4 z-[999] bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-3 border border-purple-200'>
        <p className='text-xs font-bold text-gray-700 mb-1'>Live Tracking</p>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
          <span className='text-xs text-gray-600'>Updating in real-time</span>
        </div>
      </div>
      <MapContainer className={'w-full h-full'}
        center={center}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyIcon}>
        <Popup>
          <div className='text-center font-bold text-purple-700'>
            <p>🛵 Delivery Partner</p>
            <p className='text-xs text-gray-600'>On the way</p>
          </div>
        </Popup>
        </Marker>
        <Marker position={[custsomerLat, custsomerLon]} icon={customerIcon}>
        <Popup>
          <div className='text-center font-bold text-green-700'>
            <p>🏠 Your Location</p>
            <p className='text-xs text-gray-600'>Delivery destination</p>
          </div>
        </Popup>
        </Marker>

        <Polyline positions={path} color='#8b5cf6' weight={4} dashArray="10, 10" opacity={0.8}>

        </Polyline>

      </MapContainer>
    </div>
  )
}

export default DeliveryBoyTracking