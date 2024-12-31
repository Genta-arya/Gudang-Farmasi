import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { getDataStokOpname } from "../../service/GetDataStokOpname";
import LoadingGlobal from "../../components/Loading";
import Navbar from "../../components/navbar";
import { FaPrint } from "react-icons/fa";
import ExcelJS from "exceljs";
const StokObat = () => {
  const [originalData, setOriginalData] = useState([]); // Data asli
  const [data, setData] = useState([]); // Data yang ditampilkan
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDataStokOpname();
        const sortedData = result.data.sort((a, b) => {
          const nameA = a.nama_brng.toLowerCase();
          const nameB = b.nama_brng.toLowerCase();
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });
        setOriginalData(sortedData); // Simpan data asli
        setData(sortedData); // Tampilkan data awal
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterData = () => {
    // Filter barang dengan stok > 0
    const filteredData = originalData.filter((item) => item.stok > 0);
    setData(filteredData);
  };

  const resetFilter = () => {
    // Kembalikan data ke aslinya
    setData(originalData);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @media print {
        @page {
          size:  ${data.length > 50 ? "F4 landscape" : "A4 portrait"};
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

  const handleExportExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Opname");

    // Header
    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Nama Barang", key: "nama_brng", width: 30 },
      { header: "Expire", key: "expire", width: 15 },
      { header: "PBF", key: "pbf", width: 20 },
      { header: "Stok", key: "stok", width: 10 },
      { header: "Harga Dasar", key: "harga_dasar", width: 15 },
      { header: "Harga Total", key: "harga_total", width: 20 },
    ];

    // Data rows
    data.forEach((item, index) => {
      worksheet.addRow({
        no: index + 1,
        nama_brng: item.nama_brng,
        expire: formatDate(item.expire),
        pbf: item.nama_suplier,
        stok: item.stok,
        harga_dasar: item.harga_dasar,
        harga_total: item.stok * item.harga_dasar,
      });
    });

    // Style
    worksheet.getRow(1).font = { bold: true };
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Export
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "LaporanOpname.xlsx");
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  if (loading) {
    return <LoadingGlobal />;
  }

  return (
    <>
      <Navbar />
      <div className="p-6 w-full mx-auto">
        <div className="flex space-x-4 mb-4">
          <button
            className="bg-gray-800 text-white font-bold py-2 px-4 rounded"
            onClick={filterData}
          >
            Filter Stok Tersedia
          </button>
          <button
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={resetFilter}
          >
            Reset Filter
          </button>
          <button
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={handlePrint}
          >
            <div className="flex justify-center gap-2 items-center">
              <FaPrint />
              <p>Print</p>
            </div>
          </button>
          <button
            className="bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleExportExcel}
          >
            Export to Excel
          </button>
        </div>

        {data.length > 0 ? (
          <div className="overflow-x-auto" ref={componentRef}>
            <div className="flex justify-center">
              <table className="bg-white border border-gray-200 rounded-lg shadow-md mt-8 print:mt-4">
                <thead className="font-bold">
                  <tr className="bg-gray-100 border-b text-xs">
                    <th className="px-6 text-center border border-black">No</th>
                    <th className="px-6 text-left border border-black">
                      Nama Barang
                    </th>
                    <th className="px-6 text-left border border-black">
                      Expire
                    </th>
                    <th className="px-6 text-left border border-black">PBF</th>
                    <th className="px-6 text-left border border-black">Stok</th>
                    <th className="px-6 text-left border border-black">
                      Harga Dasar
                    </th>
                    <th className="px-6 text-left border border-black">
                      Harga Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    const isExpired = new Date(item.expire) < new Date();
                    return (
                      <tr
                        key={item.kode_brng}
                        className={`border-b font-semibold text-xs ${
                          isExpired ? "bg-yellow-200 text-black" : "bg-gray-100"
                        } ${item.stok === 0 ? "bg-red-400 text-red-700" : ""}`}
                      >
                        <td className="px-6 text-center border border-black">
                          {index + 1}
                        </td>
                        <td className="px-6 w-64 te border border-black">
                          {item.nama_brng}
                        </td>
                        <td className="px-6 border border-black">
                          {formatDate(item.expire)}
                        </td>
                        <td className="px-6 w-52 border border-black">
                          {item.nama_suplier}
                        </td>
                        <td className="px-6 border border-black">
                          {item.stok.toLocaleString()}
                        </td>
                        <td className="px-6 border border-black">
                          {item.harga_dasar.toLocaleString()}
                        </td>
                        <td className="px-6 border border-black">
                          {(item.stok * item.harga_dasar).toLocaleString()}
                        </td>
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
    </>
  );
};

export default StokObat;
