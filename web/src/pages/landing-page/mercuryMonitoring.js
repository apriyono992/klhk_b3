import React, { useState, useEffect } from 'react';
import Map, { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CircularProgress from '@mui/material/CircularProgress';
import RootLanding from "../../components/layouts/RootLanding";
import { getFetcher } from '../../services/api';
import mapboxgl from 'mapbox-gl';
import FilterPanel from './filterPanel';

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
};

const groupByCoordinates = (data) => {
  const grouped = data.reduce((acc, item) => {
    const [longitude, latitude] = item.geometry.coordinates;
    if (longitude === undefined || latitude === undefined) return acc;

    const key = `${longitude},${latitude}`;
    if (!acc[key]) {
      acc[key] = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [longitude, latitude] },
        properties: { items: [item.properties] },
      };
    } else {
      acc[key].properties.items.push(item.properties);
    }
    return acc;
  }, {});
  return Object.values(grouped);
};

const MercuryMonitoringLandingPage = () => {
  const [viewState, setViewState] = useState({
    longitude: 106.8456,
    latitude: -6.2088,
    zoom: 5,
  });
  const [mapInstance, setMapInstance] = useState(null);
  const [monitoringData, setMonitoringData] = useState([]);
  const [wprData, setWprData] = useState([]); // State baru untuk Polygon WPR
  const [filteredWprData, setFilteredWprData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [popupCoordinates, setPopupCoordinates] = useState(null);
  const [popup, setPopup] = useState(null); // Untuk menyimpan instance popup Mapbox
  const [popupWprCoordinates, setWprPopupCoordinates] = useState(null);
  const [popupWprContent, setWprPopupContent] = useState(null);
  const [popupWpr, setPopupWpr] = useState(null); // Untuk menyimpan instance popup Mapbox
  const [filteredData, setFilteredData] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFetcher('/api/mercury-monitoring/search-mercury-monitoring-geo-json');
        const dataWpr = await getFetcher('/api/wpr/search-geojson');

        const groupedData = groupByCoordinates(data.features);
        setMonitoringData(groupedData);
        setFilteredData(groupedData);


        setWprData(dataWpr.features);
        setFilteredWprData(dataWpr.features);

      setLoading(false);
      } catch (error) {
        console.error('Failed to fetch mercury monitoring data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!mapInstance || (!Array.isArray(monitoringData) && !Array.isArray(filteredData))) return;
  
    // Gunakan data hasil filter jika ada, jika tidak gunakan `monitoringData`
    const dataToDisplay = filteredData;
    const geoJsonData = {
      type: 'FeatureCollection',
      features: dataToDisplay,
    };
  
    // Cek apakah sumber data sudah ada
    if (mapInstance.getSource('mercury-monitoring')) {
      mapInstance.getSource('mercury-monitoring').setData(geoJsonData);
    } else {
      mapInstance.addSource('mercury-monitoring', {
        type: 'geojson',
        data: geoJsonData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });
  
      mapInstance.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'mercury-monitoring',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#51bbd6',
          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
        },
      });
  
      mapInstance.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'mercury-monitoring',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 12,
        },
      });
  
      mapInstance.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'mercury-monitoring',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#f28cb1',
          'circle-radius': 8,
        },
      });
  
      // Tambahkan event klik pada titik yang tidak ter-cluster
      mapInstance.on('click', 'unclustered-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const propertiesList = JSON.parse(e.features[0].properties.items);
  
        // Set state untuk properties dan koordinat popup
        setSelectedProperties(propertiesList);
        setPopupCoordinates(coordinates);
        setSelectedIndex(0);
  
        // Hapus popup lama jika ada
        if (popup) {
          popup.remove();
        }
  
        // Buat konten popup
        const content = document.createElement('div');
        content.style.padding = '10px';
        content.style.maxWidth = '350px';
        content.style.maxHeight = '400px';
        content.style.overflowY = 'auto';
        content.style.fontFamily = 'Arial, sans-serif';
  
        // HTML untuk tabs
        const tabsHtml = propertiesList
          .map(
            (item, index) => `
            <button
              style="
                padding: 5px 10px;
                margin-right: 5px;
                cursor: pointer;
                border: none;
                background: ${index === 0 ? '#007bff' : '#f0f0f0'};
                color: ${index === 0 ? '#fff' : '#000'};
                border-radius: 5px;
                font-size: 12px;
              "
              class="tab-button"
              data-index="${index}"
            >
              ${new Date(item.tahunPengambilan).toLocaleDateString('id-ID')}
            </button>
          `
          )
          .join('');
  
        // HTML untuk konten detail
        const detailsHtml = propertiesList
          .map(
            (item, index) => `
            <div
              class="tab-content"
              id="tab-${index}"
              style="display: ${index === 0 ? 'block' : 'none'};"
            >
              <h1 style="margin-bottom: 10px;">${item.jenisSampel || 'Data Sampel'}</h3>
              <table style="width: 100%; text-align: left; font-size: 14px;">
                <tr><td style="font-weight: bold;">Baku Mutu:</td><td>${item.bakuMutuLingkunganId || '-'}</td></tr>
                <tr><td style="font-weight: bold;">Hasil Kadar:</td><td>${item.hasilKadar || '-'} ${item.satuan || '-'}</td></tr>
                <tr><td style="font-weight: bold;">Tingkat Kadar:</td><td>${item.tingkatKadar || '-'}</td></tr>
                <tr>
                  <td style="font-weight: bold;">Konsentrasi:</td>
                  <td style="color: ${item.konsentrasi === 'Aman' ? '#28a745' : '#dc3545'};">
                    ${item.konsentrasi || 'Tidak Diketahui'}
                  </td>
                </tr>
                <tr><td style="font-weight: bold;">Kelurahan:</td><td>${item.village || '-'}</td></tr>
                <tr><td style="font-weight: bold;">Kecamatan:</td><td>${item.district || '-'}</td></tr>
                <tr><td style="font-weight: bold;">Kabupaten/Kota:</td><td>${item.regency || '-'}</td></tr>
                <tr><td style="font-weight: bold;">Provinsi:</td><td>${item.province || '-'}</td></tr>
                <tr><td style="font-weight: bold;">Keterangan:</td><td>${item.keterangan || '-'}</td></tr>
              </table>
            </div>
          `
          )
          .join('');
  
        content.innerHTML = `
          <div style="display: flex; flex-wrap: nowrap; overflow-x: auto; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #ccc;">
            ${tabsHtml}
          </div>
          <div>${detailsHtml}</div>
        `;
  
        // Tambahkan event listener untuk tabs
        const tabButtons = content.querySelectorAll('.tab-button');
        const tabContents = content.querySelectorAll('.tab-content');
  
        tabButtons.forEach((button) => {
          button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
  
            tabButtons.forEach((btn) => {
              btn.style.background = '#f0f0f0';
              btn.style.color = '#000';
            });
            tabContents.forEach((content) => (content.style.display = 'none'));
  
            button.style.background = '#007bff';
            button.style.color = '#fff';
            content.querySelector(`#tab-${index}`).style.display = 'block';
          });
        });
  
        // Buat popup baru
        const newPopup = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setDOMContent(content)
          .addTo(mapInstance);
  
        setPopup(newPopup);
      });
    }
  }, [mapInstance, monitoringData, filteredData, selectedIndex]);

  useEffect(() => {
    if (!mapInstance || !Array.isArray(filteredWprData)) return;
  
    // Buat GeoJSON data
    const wprGeoJsonData = {
      type: 'FeatureCollection',
      features: filteredWprData,
    };
  
    // Cek apakah source sudah ada, jika belum tambahkan source dan layer
    if (!mapInstance.getSource('wpr-data')) {
      mapInstance.addSource('wpr-data', {
        type: 'geojson',
        data: wprGeoJsonData,
      });
  
      // Tambahkan layer polygon
      mapInstance.addLayer(
        {
          id: 'wpr-polygon-layer',
          type: 'fill',
          source: 'wpr-data',
          paint: {
            'fill-color': '#FFD700',
            'fill-opacity': 0.5,
          },
        },
        'unclustered-point' // Pastikan layer ini ditambahkan sebelum layer pinpoint
      );
  
      // Tambahkan layer outline polygon
      mapInstance.addLayer(
        {
          id: 'wpr-outline-layer',
          type: 'line',
          source: 'wpr-data',
          paint: {
            'line-color': '#FFD700',
            'line-width': 2,
          },
        },
        'unclustered-point'
      );
  
      // Event listener untuk klik pada Polygon
      mapInstance.on('click', 'wpr-polygon-layer', (e) => {
        const coordinates = e.lngLat;
        const properties = e.features[0].properties;
  
        // Buat konten popup
        const content = `
          <div style="font-family: Arial, sans-serif; padding: 10px; max-width: 300px;">
            <h3>Detail WPR</h3>
            <p><strong>ID:</strong> ${properties.id}</p>
            <p><strong>Sumber Data:</strong> ${properties.sumberData || '-'}</p>
            <p><strong>Status:</strong> ${properties.status || '-'}</p>
            <p><strong>Luas Wilayah:</strong> ${properties.luasWilayah || '-'} m²</p>
            <p><strong>Provinsi:</strong> ${properties.province || '-'}</p>
            <p><strong>Kabupaten/Kota:</strong> ${properties.regency || '-'}</p>
            <p><strong>Kecamatan:</strong> ${properties.district || '-'}</p>
            <p><strong>Desa:</strong> ${properties.village || '-'}</p>
          </div>
        `;
  
        // Hapus popup lama jika ada
        if (popupWpr) {
          popupWpr.remove();
        }
  
        // Buat popup baru
        const newPopup = new mapboxgl.Popup()
          .setLngLat([coordinates.lng, coordinates.lat])
          .setHTML(content)
          .addTo(mapInstance);
  
        setPopupWpr(newPopup);
      });
  
      // Ubah kursor saat mouse berada di atas Polygon
      mapInstance.on('mouseenter', 'wpr-polygon-layer', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });
  
      mapInstance.on('mouseleave', 'wpr-polygon-layer', () => {
        mapInstance.getCanvas().style.cursor = '';
      });
    } else {
      // Jika source sudah ada, perbarui datanya
      mapInstance.getSource('wpr-data').setData(wprGeoJsonData);
    }
  }, [mapInstance, filteredWprData, popupWpr]);
  
  
  

  const applyFilters = (filters) => {
    const { selectedProvinces, startDate, endDate, selectedSampleTypes } = filters;
  
    const filtered = monitoringData.filter(item => {
      // Pastikan `properties.items` selalu dalam bentuk array
      const items = Array.isArray(item.properties.items)
        ? item.properties.items
        : [item.properties.items];
  
      // Lakukan filter berdasarkan kriteria yang diberikan
      const isItemMatching = items.some(property => {
        const dateTaken = new Date(property.tahunPengambilan);
  
        // Cek rentang tanggal
        const isWithinDateRange =
          (!startDate || dateTaken >= new Date(startDate)) &&
          (!endDate || dateTaken <= new Date(endDate));
  
        return (
          (selectedProvinces.length === 0 || selectedProvinces.includes(property.province)) &&
          isWithinDateRange &&
          (selectedSampleTypes.length === 0 || selectedSampleTypes.includes(property.jenisSampel))
        );
      });
  
      return isItemMatching;
    });
  
    setFilteredData(filtered);
  };
  
  

  return (
    <RootLanding>
      <div className="w-full h-screen">
        <div className="relative h-60 bg-cover bg-center" style={{ backgroundImage: "url('/assets/images/header-bg.jpg')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold">Mercury Monitoring</h1>
          </div>
        </div>

        <div className="w-full h-[calc(100vh-240px)]">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 z-10">
              <CircularProgress color="primary" />
            </div>
          )}
          <Map
            initialViewState={viewState}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken="pk.eyJ1Ijoic2liMy1rbGhrIiwiYSI6ImNtMms1ZWVrZjAxb3MybHEyajE5cG5zb28ifQ.aCs5cuGJhZqytwo7zlVl5w"
            onLoad={(event) => setMapInstance(event.target)}
          >
       <NavigationControl position="top-left" />

        {/* Panel Filter Attach di Peta */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '280px',
                minHeight: '800px', // Ukuran maksimal panel
                maxHeight: '100px', // Ukuran maksimal panel
                overflowY: 'auto',  // Mengaktifkan scroll jika konten melebihi batas
                zIndex: 2, // Pastikan panel berada di atas peta
              }}
            >
              <FilterPanel monitoringData={monitoringData} wprData={wprData} applyFilters={applyFilters} />
          </div>
          </Map>
        </div>
      </div>
    </RootLanding>
  );
};

export default MercuryMonitoringLandingPage;
