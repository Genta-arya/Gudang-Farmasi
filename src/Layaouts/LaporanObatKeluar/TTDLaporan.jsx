import React from 'react';

const TTDLaporan=  ({ data }) => {
  return (
    <div className=" bg-white  border-gray-200 mt-8  text-xs">
      <div className="flex justify-between">
        <div className="flex flex-col items-center w-1/2  border-gray-300 pr-4">
        
          <p className="font-bold text-xs  text-gray-800 mt-4 uppercase">Kepala Instalasi Farmasi</p>
          <p className="font-bold text-xs text-gray-800 uppercase">RSUD dr. Agoesdjam Ketapang</p>
     
         
          <div className='font-bold text-start  underline mt-24'>Herliana, S.Si, Apt</div>
          <p className='font-bold'>NIP. 19800304 200604 2 021</p> 
        </div>
        <div className="flex flex-col items-center w-1/2 pl-4">
        
          <p className="font-bold text-gray-800 mt-4 text-xs uppercase">Pengelola</p>
          <p className="font-bold text-gray-800  text-xs uppercase">Obat Dan BHP</p>

          <p className="mt-24 font-bold text-start  underline">Nurfitria, S.Far., Apt</p>
          <p className='font-bold'>NIP. 19830718 201001 2 010</p> 
        </div>
      </div>
    </div>
  );
};

export default TTDLaporan;
