import React, { useEffect, useState, useRef } from "react";

import { useReactToPrint } from "react-to-print";
import { getDataStokOpname } from "../../service/GetDataStokOpname";
import LoadingGlobal from "../../components/Loading";

const StokObat = () => {
  const [data, setData] = useState([]);
  const componentRef = useRef();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDataStokOpname();
        // setData(result.data.slice(0, 500));
        setData(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @media print {
        @page {
          size: landscape;
     
         
        
          
          
        }
       body {
         
    
        }
        .page-break { page-break-before: always; }
        .page-break-margin { margin-top: 10mm; }

       
        .bg-red-400 { background-color: #f87171 !important; }
        .bg-yellow-200 { background-color: #fef08a !important; }
        .text-red-700 { color: #b91c1c !important; }
        .bg-gray-100 { background-color: #f3f4f6 !important; }
        .font-bold { font-weight: bold !important; }
      }
    `,
  });

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };
  if (loading) {
    return <LoadingGlobal />;
  }

  return (
    <div className="p-6 w-full mx-auto">
      <div>
        <button
          className="bg-gray-800 w-full mb-4  text-white font-bold py-2 px-4 rounded"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>

      {data.length > 0 ? (
        <div className="overflow-x-auto" ref={componentRef}>
          <div className="mt-4 ">
            <div className="flex justify-center">
              <ul className="list-disc ml-6 text-gray-700">
                <li className="text-red-500">
                  <span className="px-2 py-1 font-bold">Stok Habis</span>
                  Barang dengan Text merah menunjukkan bahwa stok barang habis.
                </li>
                <li className="text-yellow-500 font-bold">
                  <span className="px-2 py-1">Expired</span> Barang dengan Text
                  kuning menunjukkan bahwa barang sudah kedaluwarsa.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-center">
            <table className=" bg-white border border-gray-200 rounded-lg shadow-md mt-8 print:mt-4 ">
              <thead className="font-bold">
                <tr className=" bg-gray-100 border-b font-bold text-xs">
                  <th className="px-6 text-center border border-black text-gray-600 text-xs uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 text-left border border-black text-gray-600 text-xs uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-6 text-left   border border-black text-gray-600 text-xs uppercase tracking-wider">
                    Expire
                  </th>
                  <th className="px-6 text-left   border border-black text-gray-600 text-xs uppercase tracking-wider">
                    PBF
                  </th>
                  <th className="px-6  text-left  border border-black text-gray-600 text-xs  uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6  text-left  border border-black text-gray-600 text-xs  uppercase tracking-wider">
                    Isi Obat
                  </th>
                  <th className="px-6 text-left  border border-black text-gray-600 text-xs  uppercase tracking-wider">
                    Real Stok
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  const isExpired = new Date(item.expire) < new Date();

                  return (
                    <tr
                      key={item.kode_brng}
                      className={`border-b font-semibold ${
                        isExpired
                          ? "bg-yellow-200 print:text-yellow-500 text-black"
                          : "bg-gray-100 p"
                      } ${
                        item.stok === 0 ? "bg-red-400 print:text-red-700" : ""
                      }`}
                    >
                      <td className="px-6 text-center border border-black whitespace-nowrap text-xs">
                        {index + 1}
                      </td>
                      <td className="px-6  w-64  border border-black text-xs">
                        {item.nama_brng}
                      </td>
                      <td className="px-6   border  border-black whitespace-nowrap text-xs">
                        {formatDate(item.expire)}
                      </td>
                      <td className="px-6  w-52 py-2  border  border-black  text-xs">
                        {item.nama_suplier}
                      </td>

                      <td
                        className={`px-6 border border-black whitespace-nowrap text-xs ${
                          item.stok === 0 ? "font-bold" : ""
                        }`}
                        style={{
                          color: item.stok === 0 ? "#b91c1c" : "inherit",
                        }}
                      >
                        {item.stok === 0
                          ? "Stok Habis"
                          : item.stok.toLocaleString()}
                      </td>
                      <td className="px-6  border border-black whitespace-nowrap text-xs"></td>
                      <td className="px-6  border border-black whitespace-nowrap text-xs"></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No data available</p>
      )}
    </div>
  );
};

export default StokObat;
