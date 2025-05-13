"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
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

interface DeliveryMapProps {
  selectedPosition: { lat: number; lng: number } | null
  readOnly?: boolean
  onPositionChange?: (position: { lat: number; lng: number }) => void
}

export default function DeliveryMap({ selectedPosition, readOnly = false, onPositionChange }: DeliveryMapProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number }>(selectedPosition || defaultPosition)

  useEffect(() => {
    if (selectedPosition) {
      setPosition(selectedPosition)
    }
  }, [selectedPosition])

  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      zoomControl={!readOnly}
      dragging={!readOnly}
      touchZoom={!readOnly}
      doubleClickZoom={!readOnly}
      scrollWheelZoom={!readOnly}
      boxZoom={!readOnly}
      keyboard={!readOnly}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {selectedPosition && (
        <Marker
          position={[selectedPosition.lat, selectedPosition.lng]}
          icon={icon}
          draggable={!readOnly}
          eventHandlers={{
            dragend: (event) => {
              if (onPositionChange) {
                const { lat, lng } = event.target.getLatLng()
                onPositionChange({ lat, lng })
              }
            },
          }}
        />
      )}
    </MapContainer>
  )
}

