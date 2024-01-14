import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "@/assets/icon.png";
import L from "leaflet";

type Coords = {
  latitude: number;
  longitude: number;
};

type MapProps = {
  coords: Coords;
  display_name: string;
};

export function Map({ coords, display_name }: MapProps) {
  const { latitude, longitude } = coords;

  const customIcon = new L.Icon({
    iconUrl: icon,
    iconSize: [25, 35],
    iconAnchor: [5, 30],
  });

  function MapView() {
    const map = useMap();
    map.setView([latitude, longitude], map.getZoom());
    return null;
  }

  return (
    <MapContainer
      className="map"
      center={[latitude, longitude]}
      zoom={10}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> 
        contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker icon={customIcon} position={[latitude, longitude]}>
        <Popup>{display_name}</Popup>
      </Marker>
      <MapView />
    </MapContainer>
  );
}
