"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"

// Fix Leaflet icon issues
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Default position (center of India)
const defaultPosition = { lat: 20.5937, lng: 78.9629 }

interface MapClickHandlerProps {
  onPositionChange: (position: { lat: number; lng: number }) => void
}

function MapClickHandler({ onPositionChange }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

interface AddressMapProps {
  selectedPosition: { lat: number; lng: number } | null
  onPositionChange: (position: { lat: number; lng: number }) => void
}

export default function AddressMap({ selectedPosition, onPositionChange }: AddressMapProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number }>(selectedPosition || defaultPosition)

  useEffect(() => {
    if (selectedPosition) {
      setPosition(selectedPosition)
    }
  }, [selectedPosition])

  useEffect(() => {
    // Try to get user's current location
    if (navigator.geolocation && !selectedPosition) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setPosition(newPosition)
          onPositionChange(newPosition)
        },
        (error) => {
          console.error("Error getting location:", error)
          // Use default position if geolocation fails
          onPositionChange(defaultPosition)
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      )
    }
  }, [onPositionChange, selectedPosition])

  return (
    <MapContainer center={[position.lat, position.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onPositionChange={onPositionChange} />
      {selectedPosition && <Marker position={[selectedPosition.lat, selectedPosition.lng]} icon={icon} />}
    </MapContainer>
  )
}

