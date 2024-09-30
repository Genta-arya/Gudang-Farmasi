import React, { useEffect, useState } from "react";
import { getDataStokOpname } from "../../service/GetDataStokOpname";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Stokopname");

    worksheet.columns = [
      {
        header: "No",
        key: "no",
        width: 5,
        alignment: { horizontal: "center" },
      },
      {
        header: "Nama Barang",
        key: "nama_brng",
        width: 65,
        alignment: { horizontal: "center" },
      },
      {
        header: "Expire",
        key: "expire",
        width: 15,
        alignment: { horizontal: "center" },
      },
      {
        header: "Kategori",
        key: "kode_kategori",
        width: 10,
        alignment: { horizontal: "center" },
      },
      {
        header: "Satuan",
        key: "kode_sat",
        width: 10,
        alignment: { horizontal: "center" },
      },
      {
        header: "Harga Dasar",
        key: "harga_dasar",
        width: 25,
        style: { numFmt: '"Rp "#,##0.00' },
        alignment: { horizontal: "center" },
      },
      {
        header: "Total Harga",
        key: "total_harga",
        width: 25,
        style: { numFmt: '"Rp "#,##0.00' },
        alignment: { horizontal: "center" },
      },
      {
        header: "Stok",
        key: "stok",
        width: 10,
        alignment: { horizontal: "center" },
      },
      {
        header: "Nama Suplier",
        key: "nama_suplier",
        width: 40,

        alignment: { horizontal: "center" },
      },
    ];

    // Set gaya untuk header
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        // kuning
        fgColor: { argb: "FFFFFF00" },
      };

    });

    let totalPengeluaran = 0;
    data.forEach((item, index) => {
      const hargaDasar = parseInt(item.harga_dasar, 10);
      const totalHarga = parseInt(item.stok, 10) * hargaDasar;
      totalPengeluaran += totalHarga;

      const row = worksheet.addRow({
        no: index + 1,
        nama_brng: item.nama_brng,
        expire: new Date(item.expire).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        kode_kategori: item.kode_kategori,
        kode_sat: item.kode_sat,
        harga_dasar: hargaDasar,
        total_harga: totalHarga,
        stok: item.stok,
        nama_suplier: item.nama_suplier,
      });

      // Set border untuk setiap sel dalam baris
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Tambahkan baris total di bawah data
    const totalRow = worksheet.addRow([
      "Total Pengeluaran", // Kolom A
      "", // Kolom B
      "", // Kolom C
      "", // Kolom D
      "", // Kolom E
      "", // Kolom F
      "", // Kolom G
      "", // Kolom H
      totalPengeluaran, // Kolom I
    ]);

    // Merge cells A to H for the total row
    worksheet.mergeCells(totalRow.number, 1, totalRow.number, 8);

    // Set style untuk sel yang digabung
    totalRow.getCell(1).font = { bold: true }; // Kolom A
    totalRow.getCell(1).alignment = { horizontal: "center" }; // Align center

    // Set border untuk baris total
    totalRow.eachCell((cell, colNumber) => {
      if (colNumber >= 1 && colNumber <= 8) {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9D9D9" } };
        cell.alignment = { horizontal: "center" };
      } else if (colNumber === 9) {
        cell.numFmt = '"Rp "#,##0.00'; // Format untuk total pengeluaran
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        }
        cell.alignment = { horizontal: "center" };
        cell.font = { bold: true };
         cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9D9D9" } };
      }
    });

    // Ekspor workbook ke file Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "laporan_stokopname_Gudang Farmasi.xlsx");
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Laporan Stok Opname</h1>
      <button
        onClick={exportToExcel}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-lg transition-all duration-300"
      >
        Export to Excel
      </button>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-center">Nama Barang</th>
            <th className="py-3 px-6 text-center">Expire</th>
            <th className="py-3 px-6 text-center">Kategori</th>
            <th className="py-3 px-6 text-center">Satuan</th>
            <th className="py-3 px-6 text-center">Harga Dasar</th>
            <th className="py-3 px-6 text-center">Total Harga</th>
            <th className="py-3 px-6 text-center">Stok</th>
            <th className="py-3 px-6 text-center">Nama Suplier</th>
            <th className="py-3 px-6 text-center">Total Pengeluaran</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-center">{item.nama_brng}</td>
              <td className="py-3 px-6 text-center">
                {new Date(item.expire).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-center">{item.kode_kategori}</td>
              <td className="py-3 px-6 text-center">{item.kode_sat}</td>
              <td className="py-3 px-6 text-center">
                {formatRupiah(parseInt(item.harga_dasar, 10))}
              </td>
              <td className="py-3 px-6 text-center">
                {formatRupiah(item.stok * parseInt(item.harga_dasar, 10))}
              </td>
              <td className="py-3 px-6 text-center">{item.stok}</td>
              <td className="py-3 px-6 text-center">{item.nama_suplier}</td>
              <td className="py-3 px-6 text-center">
                {formatRupiah(item.stok * parseInt(item.harga_dasar, 10))}
              </td>
            </tr>
          ))}
          <tr className="border-b border-gray-200">
            <td className="py-3 px-6 text-center" colSpan={8}>
              Total Pengeluaran
            </td>
            <td className="py-3 px-6 text-center">
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
  );
};

export default Laporan;
