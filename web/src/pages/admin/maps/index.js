import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getFetcher } from '../../../services/api';
// import mapboxgl from 'mapbox-gl';

// mapboxgl.accessToken = 'pk.eyJ1Ijoic2liMy1rbGhrIiwiYSI6ImNtMms1ZWVrZjAxb3MybHEyajE5cG5zb28ifQ.aCs5cuGJhZqytwo7zlVl5w';

const MapComponent = () => {
  const [viewport, setViewport] = useState({
    latitude: -1.3911261987874894,  // Center of Indonesia
    longitude: 113.4216565328876, // Longitude around Indonesia's central region
    zoom: 4,  // Zoom level to focus on Indonesia
  });

  // State for holding map points
  const [mapPoints, setMapPoints] = useState([
    { id: 1, latitude: -6.1751, longitude: 106.8650, title: 'Jakarta', description: 'Capital of Indonesia' },
    { id: 2, latitude: -8.4095, longitude: 115.1889, title: 'Bali', description: 'Tourist paradise in Indonesia' },
    { id: 3, latitude: -7.2504, longitude: 112.7688, title: 'Surabaya', description: 'Second-largest city in Indonesia' },
    // Add more points as needed
  ]);

  const [selectedPoint, setSelectedPoint] = useState(null);

  // Handle changes in the map viewport (e.g., zoom or pan)
  const handleViewportChange = (newViewport) => {
    console.log(newViewport);
    setViewport(newViewport);
  };

  // Fetch dynamic points (if needed)
  useEffect(() => {
    // Simulate API call for fetching points from a backend or external API
    const fetchPoints = async () => {
      const response = await getFetcher('/api/maps/gudang-penyimpanan-b3');
      const data = await response;
      setMapPoints(data.responseData);
    };
    fetchPoints();
  }, []);

  return (
    <div className="w-full h-[600px] z-10">
      <ReactMapGL
        {...viewport}
        // width="100%"
        // height="100%"
        mapboxAccessToken='pk.eyJ1Ijoic2liMy1rbGhrIiwiYSI6ImNtMms1ZWVrZjAxb3MybHEyajE5cG5zb28ifQ.aCs5cuGJhZqytwo7zlVl5w'
        mapStyle="mapbox://styles/sib3-klhk/cm3i4eidd00dn01s9809ze69i" // Ensure only one valid map style URL
        onMove={handleViewportChange} // Listen for move events to update the viewport
        dragPan={true} // Enable drag panning
        scrollZoom={true} // Enable scroll zoom
        doubleClickZoom={true} // Enable double-click zoom
        touchZoom={true} // Enable touch zoom for mobile
      >
        {/* Render markers for each map point */}
        {mapPoints.map((point,index) => (
          <Marker key={index} latitude={point.latitude} longitude={point.longitude}>
            <div
              onClick={() => setSelectedPoint(point)} // Show popup on marker click
              style={{ cursor: 'pointer', fontSize: '24px' }}
            >
              📍 {/* Marker icon */}
            </div>
          </Marker>
        ))}

        {/* Display Popup when a point is selected */}
        {selectedPoint && (
          <Popup
            latitude={selectedPoint.latitude}
            longitude={selectedPoint.longitude}
            onClose={() => setSelectedPoint(null)} // Close popup
            closeButton={true}
            closeOnClick={false}
          >
            <div>
              <h3>{selectedPoint.company_name}</h3>
              <p>{selectedPoint.address}</p>
              <p><strong>Coordinates:</strong> {selectedPoint.latitude}, {selectedPoint.longitude}</p>
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
};

export default MapComponent;