import React from 'react';

const Header = ({ data }) => {
   
  return (
    <div className=" bg-white rounded-lg mb-8 text-sm -mt-4">
    
      <div className="flex flex-col gap-1 ">
        <div className="mb-2 md:mb-0 flex gap-12">
          <span className="font-medium text-gray-600">No Permintaan</span>
          <div className="text-gray-800">{data.no_permintaan}</div>
        </div>
        <div className="mb-2 md:mb-0 flex gap-10">
          <span className="font-medium text-gray-600">Asal Permintaan</span>
          <div className="text-gray-800">{data.dari}</div>
        </div>
        <div className='flex gap-[58px]'>
          <span className="font-medium text-gray-600">Petugas Piket</span>
          <div className="text-gray-800">{data.nama}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
