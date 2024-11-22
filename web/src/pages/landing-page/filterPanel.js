import React, { useState, useEffect } from 'react';

export default function FilterPanel({ monitoringData, wprData, applyFilters }) {
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSampleTypes, setSelectedSampleTypes] = useState([]);
  const [selectedStatusPerizinan, setSelectedStatusPerizinan] = useState([]);
     // Mengambil daftar unik provinsi
  const provinces = monitoringData?.length
  ? [
      ...new Set(
        monitoringData
          .flatMap(item => {
            const items = Array.isArray(item?.properties?.items)
              ? item.properties.items
              : [item?.properties?.items];
            return items.map(property => property?.province).filter(Boolean);
          })
      ),
    ]
  : [];

// Mengambil daftar unik jenis sampel
const sampleTypes = monitoringData?.length
  ? [
      ...new Set(
        monitoringData
          .flatMap(item => {
            const items = Array.isArray(item?.properties?.items)
              ? item.properties.items
              : [item?.properties?.items];
            return items.map(property => property?.jenisSampel).filter(Boolean);
          })
      ),
    ]
  : [];
console.log(wprData)
// Mengambil daftar unik status perizinan
const statusPerizinan = wprData?.length
  ? [
      ...new Set(
        wprData
          .flatMap(item => {
            const items = Array.isArray(item?.properties?.items)
              ? item.properties.items
              : [item?.properties];
            return items.map(property => property?.status).filter(Boolean);
          })
      ),
    ]
  : [];
console.log(statusPerizinan)
// Memanggil applyFilters setiap kali filter berubah
useEffect(() => {
  applyFilters({
    selectedProvinces,
    startDate,
    endDate,
    selectedSampleTypes,
    selectedStatusPerizinan,
  });
}, [selectedProvinces, startDate, endDate, selectedSampleTypes, selectedStatusPerizinan]);

const handleCheckboxChange = (setter, value) => {
  setter(prev => (prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]));
};

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      padding: '15px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      maxWidth: '300px',
      zIndex: 1000,
    }}>
      <h3>Filter Data</h3>

      <div>
        <h4>Status Perizinan</h4>
        {statusPerizinan.map(status => (
          <div key={status}>
            <input
              type="checkbox"
              value={status}
              checked={selectedStatusPerizinan.includes(status)}
              onChange={() => handleCheckboxChange(setSelectedStatusPerizinan, status)}
            />
            <label style={{ marginLeft: '8px' }}>{status}</label>
          </div>
        ))}
      </div>

      <div>
        <h4>Lokasi</h4>
        {provinces.map(province => (
          <div key={province}>
            <input
              type="checkbox"
              value={province}
              checked={selectedProvinces.includes(province)}
              onChange={() => handleCheckboxChange(setSelectedProvinces, province)}
            />
            <label style={{ marginLeft: '8px' }}>{province}</label>
          </div>
        ))}
      </div>

      <div>
        <h4>Rentang Tanggal Pengambilan</h4>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Mulai:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginBottom: '10px', padding: '5px' }}
          />
          <label>Akhir:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '5px' }}
          />
        </div>
      </div>

      <div>
        <h4>Jenis Sampel</h4>
        {sampleTypes.map(type => (
          <div key={type}>
            <input
              type="checkbox"
              value={type}
              checked={selectedSampleTypes.includes(type)}
              onChange={() => handleCheckboxChange(setSelectedSampleTypes, type)}
            />
            <label style={{ marginLeft: '8px' }}>{type}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
