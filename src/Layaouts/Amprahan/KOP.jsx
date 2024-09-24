import React from 'react';
import icon from "../../assets/icon.png"; 
import icon_rs from "../../assets/icon_rs.png"; 

const KOP = () => {
  return (
    <div className="mb-8 bg-white w-full">
      <div className="flex items-center mb-4 justify-evenly text-center">
        <img src={icon_rs} alt="Logo" className="w-24 print:w-16" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">RSUD dr. Agoesdjam Ketapang</h1>
          <p className="text-base text-black">Jl. Mayjen D.I. Panjaitan No. 51 Ketapang, Kalimantan Barat</p>
          <p className="text-sm text-black">081227192030</p>
          <p className="text-sm text-black">Email: webmasteragoesdjam@gmail.com</p>
        </div>
        <img src={icon} alt="Logo" className="w-16 print:w-12" />
      </div>
      
 
      <hr className="border-t border-black mb-1" />
      <hr className="border-t-2 border-black mb-4" />
      
    </div>
  );
};

export default KOP;
