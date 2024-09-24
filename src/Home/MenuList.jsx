import React from "react";
import { FaBoxOpen, FaClipboardList, FaPrint } from "react-icons/fa";
import { Link } from "react-router-dom";

const MenuList = () => {
  const menu = [
    {
      path: "/barang",
      name: "Daftar Barang",
      icon: <FaBoxOpen />,
    },
    {
      path: "/stok-keluar-bulanan",
      name: "Stok Keluar Bulanan",
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
  ];

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-[90%]">
        <ul className="grid grid-cols-2 gap-6">
          {menu.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              <span className="text-3xl mb-2">{item.icon}</span>
              <span className="text-lg hover:text-gray-400">{item.name}</span>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuList;
