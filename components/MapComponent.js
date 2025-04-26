"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Next.js
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41], // Icon size
  iconAnchor: [12, 41], // Anchor point
  popupAnchor: [1, -34],
});

const MapComponent = () => {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    });
  }, []);

  return (
    <MapContainer
      center={[51.505, -0.09]} // Default coordinates (London)
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      {/* OpenStreetMap TileLayer */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marker */}
      <Marker position={[51.505, -0.09]} icon={customIcon}>
        <Popup> A sample marker </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
