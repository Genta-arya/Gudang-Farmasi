import React, { useEffect, useState } from "react";
import { getDataStokOpname } from "../../service/GetDataStokOpname";

import Navbar from "../../components/navbar";
import { exportToExcel } from "../../utils/utils";


const Laporan = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      // Dapatkan data dari API
      const response = await getDataStokOpname();

      // Urutkan data berdasarkan nama barang (atau kolom yang sesuai)
      const sortedData = response.data.sort((a, b) => {
        const nameA = a.nama_brng.toLowerCase(); // Ubah ke huruf kecil untuk urutan yang konsisten
        const nameB = b.nama_brng.toLowerCase();
        if (nameA < nameB) {
          return -1; // Jika nameA lebih kecil dari nameB
        }
        if (nameA > nameB) {
          return 1; // Jika nameA lebih besar dari nameB
        }
        return 0; // Jika sama
      });

      // Set data yang sudah diurutkan
      setData(sortedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 text-xs relative">
        <h1 className="text-2xl font-bold mb-4">Laporan Stok Keluar Bulanan</h1>
        <button
          onClick={exportToExcel}
          className="mt-4  bg-green-500 w-full hover:bg-green-600 text-white font-bold py-2 px-4 mb-4 rounded shadow-lg transition-all duration-300"
        >
          Export to Excel
        </button>
        <div className="overflow-x-auto relatitve ">
          <table className="min-w-full  bg-white border border-gray-200 text-xs">
            <thead>
              <tr className="bg-gray-200 text-xs text-gray-600 uppercase  leading-normal border rounded-md border-black ">
                <th className="py-3 px-6 text-center border rounded-md border-black ">
                  Nama Barang
                </th>
                <th className="py-3 px-6 text-center border rounded-md border-black ">
                  Expire
                </th>
                <th className="py-3 px-6 text-center border rounded-md border-black ">
                  Kategori
                </th>
                <th className="py-3 px-6 text-center border rounded-md border-black ">
                  Satuan
                </th>
                <th className="py-3 px-6 text-center border rounded-md border-black ">
                  Harga Dasar
                </th>
                <th className="py-3 px-6 text-center border rounded-md border-black ">
                  Total Harga
                </th>
                <th className="py-3 px-6 text-center border rounded-md border-black ">
                  Stok
                </th>
                <th className="py-3 px-6 text-center border rounded-md border-black ">
                  Nama Suplier
                </th>
                <th className="py-3 px-6 text-center border rounded-md border-black ">
                  Total Pengeluaran
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b text-xs border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 border rounded-md border-black  px-6 text-center">
                    {item.nama_brng}
                  </td>
                  <td className="py-3 border rounded-md border-black  px-6 text-center">
                    {new Date(item.expire).toLocaleDateString()}
                  </td>
                  <td className="py-3 border rounded-md border-black  px-6 text-center">
                    {item.kode_kategori}
                  </td>
                  <td className="py-3 border rounded-md border-black  px-6 text-center">
                    {item.kode_sat}
                  </td>
                  <td className="py-3 border rounded-md border-black  px-6 text-center">
                    {formatRupiah(parseInt(item.harga_dasar, 10))}
                  </td>
                  <td className="py-3 border rounded-md border-black  px-6 text-center">
                    {formatRupiah(item.stok * parseInt(item.harga_dasar, 10))}
                  </td>
                  <td className="py-3 border rounded-md border-black px-6 text-center">
  {Number(item.stok).toLocaleString('id-ID')}
</td>

                  <td className="py-3 border rounded-md border-black  px-6 text-center">
                    {item.nama_suplier}
                  </td>
                  <td className="py-3 border rounded-md border-black  px-6 text-center">
                    {formatRupiah(item.stok * parseInt(item.harga_dasar, 10))}
                  </td>
                </tr>
              ))}
              <tr className="border-b border rounded-md border-black  ">
                <td
                  className="py-3 px-6 border rounded-md border-black  text-center"
                  colSpan={8}
                >
                  Total Pengeluaran
                </td>
                <td className="py-3 px-6 text-center border rounded-md border-black ">
                  {formatRupiah(
                    data.reduce(
                      (acc, item) =>
                        acc + item.stok * parseInt(item.harga_dasar, 10),
                      0
                    )
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Laporan;
