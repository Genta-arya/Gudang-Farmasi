import React, { useEffect, useState } from "react";
import icon from "../assets/icon_rsud.png";
import MenuList from "./MenuList";


const LayoutHome = () => {
  const [currentDateTime, setCurrentDateTime] = useState("");
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
    <>
      <div className="bg-gradient-to-r from-red-600 via-gray-200 to-red-600">
        <div className="container mx-auto flex justify-between items-center text-sm">
        
            <div className="flex items-center gap-2 mt-8 text-white">
              <img src={icon} alt="Logo" className="w-12" />
              <div className="text-xl font-bold">Gudang Farmasi</div>
            </div>
     
          <div className="flex text-white items-center text-sm font-medium">
            <span>{currentDateTime}</span>
          </div>
        </div>
        {/* <IPLocal /> */}

        <MenuList />
      </div>
    </>
  );
};

export default LayoutHome;
