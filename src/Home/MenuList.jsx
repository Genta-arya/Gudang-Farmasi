import React from "react";
import { FaBoxOpen, FaClipboardList, FaPrint, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const MenuList = () => {
  const menu = [
    {
      path: "/barang",
      name: "Daftar Barang",
      icon: <FaBoxOpen />,
    },
    {
      path: "/amprahan",
      name: "Daftar Amprahan",
      icon: <FaClipboardList />,
    },
    {
      path: "/stok",
      name: "Cetak Stokopname",
      icon: <FaPrint />,
    },
    {
      path: "/obatkeluar",
      name: "Laporan Obat Keluar",
      icon: <FaSignOutAlt />,
    },
  ];

  return (
    <div className="mt-12 flex items-center justify-center mx-auto h-screen">
      <div className="container bg-gradient-to-r from-red-600 via-white to-red-600 h-auto text-white p-8 rounded-lg shadow-lg w-[90%] md:w-[70%] lg:w-[60%]">
        <ul className="grid grid-cols-2 gap-8 md:grid-cols-2">
          {menu.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className={`flex flex-col items-center justify-center p-6 bg-red-700 rounded-lg 
                hover:bg-red-600 transition-all transform duration-300 ease-in-out 
                hover:scale-105 shadow-lg hover:shadow-2xl`}
            >
              <span className="md:text-4xl lg:text-4xl text-xl mb-4 p-3 bg-white rounded-full text-red-700">
                {item.icon}
              </span>
              <span className="md:text-xl lg:text-xl text-sm hover:text-gray-400 font-semibold">
                {item.name}
              </span>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuList;
