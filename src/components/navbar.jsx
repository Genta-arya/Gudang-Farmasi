import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Menggunakan icon dari React Icons
import icon from "../assets/icon_rsud.png";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState("");

  const handleBackClick = () => {
    navigate("/"); // Mengarahkan ke halaman utama
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const optionsDate = { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric", 
        timeZone: 'Asia/Jakarta' 
      };
      const optionsTime = {
        hour: "2-digit", 
        minute: "2-digit", 
        timeZone: 'Asia/Jakarta'
      };
      const time = now.toLocaleTimeString("id-ID", optionsTime);
      const date = now.toLocaleDateString("id-ID", optionsDate);

      setCurrentDateTime(`${date} | ${time} WIB`);
    };

    // Memperbarui waktu setiap menit
    const intervalId = setInterval(updateDateTime, 60000);
    updateDateTime(); // Panggil langsung pada saat pertama kali render

    return () => clearInterval(intervalId); // Bersihkan interval ketika komponen di-unmount
  }, []);

  return (
    <nav className="bg-gradient-to-r from-red-600 via-white  to-red-600 text-white py-6">
      <div className="container mx-auto flex justify-between items-center text-sm">
        {location.pathname === "/" ? (
          <div className="flex items-center gap-2">
            <img src={icon} alt="Logo" className="w-12" />
            <div className="text-xl font-bold">Gudang Farmasi</div>
          </div>
        ) : (
          <button onClick={handleBackClick} className="flex items-center">
            <FaArrowLeft className="mr-4" /> {/* Icon arrow left */}
            <span className="font-bold text-lg">Kembali</span>
          </button>
        )}

        {/* Jam, Tanggal, dan Nama Hari */}
        <div className="flex items-center text-sm font-medium">
          <span>{currentDateTime}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
