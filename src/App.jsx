import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import StokObat from "./Layaouts/StokObat/StokObat";
import Amprahan from "./Layaouts/Amprahan/Amprahan";
import DetailAmprahan from "./Layaouts/Amprahan/DetailAmprahan";
import LayoutHome from "./Home/LayoutHome";
import Stok from "./DaftarBarang/DaftarBarang";
import LaporanObat from "./Layaouts/LaporanObatKeluar/LaporanObat";
import { BarLoader } from "react-spinners";
import { FaWifi } from "react-icons/fa";

// URL yang akan digunakan untuk pengecekan koneksi
const API_URL = "http://30.30.30.190/api/gudang-server/service/stokopname.php";

const App = () => {
  const [isConnected, setIsConnected] = useState(null); // Status koneksi, set awal null untuk menunggu
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const location = useLocation(); // Hook untuk mendeteksi perubahan route

  // Fungsi untuk cek koneksi dengan timeout
  const checkConnection = async () => {
    const controller = new AbortController(); // Membuat controller untuk abort fetch request
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout setelah 10 detik

    try {
      setIsLoading(true); // Set loading true sebelum fetch
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal, // Menambahkan signal ke request
      });

      if (response.ok) {
        setIsConnected(true); // Jika sukses
      } else {
        setIsConnected(false); // Jika gagal
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch request timeout");
      }
      setIsConnected(false); // Jika error, misal no internet atau timeout
    } finally {
      clearTimeout(timeoutId); // Bersihkan timeout setelah selesai
      setIsLoading(false); // Setelah selesai cek koneksi
    }
  };

  // Cek koneksi setiap kali route berubah
  useEffect(() => {
    checkConnection();
  }, [location]); // Menambahkan location agar pengecekan dilakukan setiap kali route berubah

  // Menampilkan loading jika status koneksi belum terverifikasi
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <BarLoader color="#ef4444" width={300} height={5} loading={isLoading} />
        <p className="mt-4 text-lg text-gray-700">Memeriksa koneksi...</p>
      </div>
    );
  }

  return (
    <div>
      {!isConnected ? ( // Menunggu koneksi selesai
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
          <FaWifi className="text-6xl text-red-600" />
          <h2 className="text-xl text-red-600">Gagal terhubung ke server.</h2>
          <p className="mt-4 text-lg text-red-600">Aplikasi hanya digunakan dijaringan area rumah sakit</p>
        </div>
      ) : (
        <Routes>
          <Route path="/stok" element={<StokObat />} />
          <Route path="/barang" element={<Stok />} />
          <Route path="/" element={<LayoutHome />} />
          <Route path="/detail/:id/:dari" element={<DetailAmprahan />} />
          <Route path="/obatkeluar" element={<LaporanObat />} />
          <Route path="/amprahan" element={<Amprahan />} />
          <Route
            path="*"
            element={
              <>
                <p className="flex justify-center h-screen mx-auto items-center">
                  404 || Halaman tidak ditemukan
                </p>
              </>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
