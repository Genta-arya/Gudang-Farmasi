import React from "react";
import { FaBoxOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

const MenuList = () => {
  const menu = [
    {
      path: "/stok",
      name: "Stok Gudang",
      icon: <FaBoxOpen />,
    },
    {
      path: "/amprahan",
      name: "Amprahan",
      icon: <FaBoxOpen />,
    },
  ];

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-[90%] ">
        <ul className="space-y-4">
          {menu.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className="flex items-center space-x-3 p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <a href={item.path} className="text-lg hover:text-gray-400">
                {item.name}
              </a>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuList;
