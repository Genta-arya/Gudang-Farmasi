import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { BarLoader } from 'react-spinners'; // Import BarLoader dari react-spinners

const TestConnection = ({ url, onConnectionStatusChange }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading
  const location = useLocation(); // Mendapatkan lokasi route saat ini

  useEffect(() => {
    const testConnection = async () => {
      try {
        setIsLoading(true); // Set loading true sebelum melakukan fetch
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Server tidak dapat dijangkau');
        }
        setIsConnected(true); // Set connected true jika berhasil
        onConnectionStatusChange(true); // Mengirim status koneksi ke App.js
      } catch (error) {
        setIsConnected(false); // Set connected false jika gagal
        onConnectionStatusChange(false); // Mengirim status gagal ke App.js
      } finally {
        setIsLoading(false); // Set loading false setelah fetch selesai
      }
    };

    testConnection(); // Tes koneksi setiap kali route berubah
  }, [location, url, onConnectionStatusChange]); // Panggil ulang setiap kali location atau url berubah

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <BarLoader color="#3498db" width={300} height={5} loading={isLoading} />
        <p className="mt-4 text-lg text-gray-700">Memeriksa koneksi...</p>
      </div>
    );
  }

  return null; // Jika koneksi berhasil, tidak menampilkan apa-apa
};

export default TestConnection;
