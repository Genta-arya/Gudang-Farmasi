import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // Menggunakan icon dari React Icons

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/"); // Mengarahkan ke halaman utama
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {location.pathname === "/" ? (
          <div className="text-xl font-bold">Gudang Farmasi</div>
        ) : (
          <button onClick={handleBackClick} className="flex items-center">
            <FaArrowLeft className="mr-4" /> {/* Icon arrow left */}
            <span>Kembali</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
