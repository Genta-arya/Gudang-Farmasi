import React from 'react';

const TTD = ({ data }) => {
  return (
    <div className=" bg-white  border-gray-200 mt-8  text-xs">
      <div className="flex justify-between">
        <div className="flex flex-col items-center w-1/2  border-gray-300 pr-4">
          <div className="flex-grow"></div>
          <p className="font-bold text-xs text-gray-800 mt-4 uppercase">Petugas Gudang Farmasi</p>
          <div className="mt-12  border-gray-300 w-full"></div>
          <div className="mt-[45px] text-white print:text-white">{""}</div>
          <div className=''>_______________________________</div>
        </div>
        <div className="flex flex-col items-center w-1/2 pl-4">
          <div className="flex-grow"></div>
          <p className="font-bold text-gray-800 mt-4 text-xs uppercase">Petugas {data.dari}</p>
          <div className="mt-12  border-gray-300 w-full"></div>
          <p className="mt-8 font-bold">{data.nama}</p>
          <p className='font-bold'>NIP. {data.nip}</p>
        </div>
      </div>
    </div>
  );
};

export default TTD;
