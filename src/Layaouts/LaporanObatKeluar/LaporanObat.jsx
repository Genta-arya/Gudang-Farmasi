import React, { useState, useEffect, useRef } from "react";
import { getDataLaporan } from "../../service/GetDataLaporan";
import LoadingGlobal from "../../components/Loading";
import ExcelJS from "exceljs"; // Library untuk export Excel
import { saveAs } from "file-saver"; // Library untuk menyimpan file
import { useReactToPrint } from "react-to-print";
import KOPLaporan from "./KOP_Laporan";
import TTDLaporan from "./TTDLaporan";
import Navbar from "../../components/navbar";

const LaporanObat = () => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7); // Mengambil bagian 'YYYY-MM'
  });
  const [isPrinting, setIsPrinting] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getDataLaporan({ date });

      const sortedData = response.data.sort((a, b) => {
        const nameA = a.nama_barang.toLowerCase();
        const nameB = b.nama_barang.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      setData(sortedData);
    } catch (error) {
      console.error(error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatStok = (value) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
    }).format(value);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    onAfterPrint: () => setIsPrinting(false),
    content: () => componentRef.current,
    pageStyle: `
      @media print {
        @page {
          size:  ${data.length > 50 ? "F4 landscape" : "F4 landscape"};
          
     
         
        
          
          
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

  // Fungsi untuk export data ke Excel
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(`Laporan Obat ${formatDate(date)}`);

    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Nama Barang", key: "nama_barang", width: 65 },
      {
        header: "Stok Awal",
        key: "stok_awal",
        width: 15,
        alignment: { horizontal: "center" },
      },
      {
        header: "Sisa Stok",
        key: "sisa_stok",
        width: 15,
        alignment: { horizontal: "center" },
      },
      {
        header: "Total Keluar",
        key: "total_keluar",
        width: 15,
        alignment: { horizontal: "center" },
      },
      {
        header: "Perencanaan 3 Bulan",
        key: "perencanaan",
        width: 20,
        alignment: { horizontal: "center" },
      },
      {
        header: "Expire",
        key: "expire",
        width: 15,
        alignment: { horizontal: "center" },
      },
      {
        header: "Kode Satuan",
        key: "kode_satuan",
        width: 15,
        alignment: { horizontal: "center" },
      },
      {
        header: "Harga Dasar",
        key: "harga_dasar",
        width: 20,
        style: { numFmt: "#,##0.00" },
        alignment: { horizontal: "center" },
      },
      {
        header: "Nama Suplier",
        key: "nama_suplier",
        width: 40,
        alignment: { horizontal: "center" },
      },
    ];

    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // Tambahkan data ke worksheet dengan border di setiap sel
    filteredData.forEach((item, index) => {
      const row = worksheet.addRow({
        no: index + 1,
        nama_barang: item.nama_barang,
        stok_awal: formatStok(item.stok_awal + item.total_keluar),
        sisa_stok: formatStok(item.sisa_stok),
        total_keluar: formatStok(item.total_keluar),
        perencanaan: formatStok(item.total_keluar * 3 * 1.2),
        expire: item.expire
          ? new Date(item.expire).toLocaleDateString("id-ID")
          : "Tidak diketahui",
        kode_satuan: item.kode_sat,
        harga_dasar: item.harga_dasar,
        nama_suplier: item.nama_suplier,
      });

      // Tambahkan border pada setiap sel di row
      row.eachCell((cell) => {
        cell.border = borderStyle;
        cell.alignment = { horizontal: "center" };
      });
    });

    // Tambahkan border pada header
    worksheet.getRow(1).eachCell((cell) => {
      cell.border = borderStyle;
      cell.alignment = { horizontal: "center" };
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF808080" },
      };
    });

    // Generate file Excel dan simpan
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Laporan_Obat_${date}.xlsx`);
  };

  // if (loading) return <LoadingGlobal />;

  const filteredData = data.filter((item) =>
    item.nama_barang.toLowerCase().includes(searchTerm)
  );

  const totalHargaTigaBulan = filteredData.reduce((total, item) => {
    return total + item.harga_dasar * item.total_keluar * 3 * 1.2;
  }, 0);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Laporan Obat</h1>

        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Pilih Tanggal:
          </label>
          <input
            type="month"
            id="date"
            max={formatDate(new Date())}
            value={date}
            onChange={handleDateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700"
          >
            Cari Nama Barang:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Masukkan nama barang"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={exportToExcel}
          className="mb-4 bg-gray-800 w-full hover:opacity-90 text-white font-bold py-2 px-4 rounded"
        >
          Export to Excel
        </button>
        <button
          onClick={() => {
            setIsPrinting(true); // Set isPrinting true langsung
            setTimeout(() => {
              handlePrint(); // Eksekusi handlePrint setelah 1.5 detik
            }, 1500); // 1.5 detik
          }}
          className="mb-4 bg-gray-800 w-full hover:opacity-90 text-white font-bold py-2 px-4 rounded"
        >
          Cetak PDF
        </button>

        {error && <p className="text-red-500">{error}</p>}

        <div ref={componentRef}>
          <div className="">
            <KOPLaporan />
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 text-center text-xs">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 print:py-2 px-4 border border-black w-12">
                      No
                    </th>
                    <th className="py-2 print:py-2  px-4 border  border-black ">
                      Nama Barang
                    </th>
                    <th className="py-2 print:py-2  px-4 border border-black print:w-20">
                      Satuan
                    </th>
                    <th className="py-2 print:py-2 px-4 border border-black print:hidden">
                      Stok Awal
                    </th>
                    <th className="py-2 print:py-2 px-4 border border-black print:w-20">
                      Sisa Stok
                    </th>
                    <th className="py-2 print:py-2 px-4 border border-black print:w-20">
                      Pengeluaran Bulan ini
                    </th>
                    <th className="py-2 print:py-2 px-4 border border-black print:w-20">
                      Perencanaan 3 bulan
                    </th>
                    <th className="py-2 print:py-2  px-4 border border-black print:hidden">
                      Expire
                    </th>

                    <th className="py-2 print:py-2  px-4 border border-black print:w-36 ">
                      Harga Dasar
                    </th>
                    <th className="py-2 print:py-2  px-4 border border-black print:w-36 ">
                      Total Harga 3 bulan
                    </th>
                    <th className="py-2 print:py-2  px-4 border border-black  ">
                      Keterangan
                    </th>
                    <th className="py-2 print:py-2 px-4 border border-black print:hidden">
                      Nama Suplier
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData
                      .filter((item) => !isPrinting || item.total_keluar > 0) // Hanya tampilkan jika total_keluar > 0 saat isPrinting true
                      .map((item, index) => {
                        const expireDate = item.expire
                          ? new Date(item.expire)
                          : null;
                        const formattedExpireDate = expireDate
                          ? expireDate.toLocaleDateString("id-ID")
                          : "Tidak diketahui";

                        return (
                          <tr
                            key={item.kode_brng}
                            className="hover:bg-gray-100 text-center"
                          >
                            <td className="py-2 print:py-2 px-4 border border-black">
                              {index + 1}
                            </td>
                            <td className="py-2 print:py-2 px-4 border border-black text-start">
                              {item.nama_barang}
                            </td>
                            <td className="py-2 print:py-2 px-4 border border-black">
                              {item.kode_sat}
                            </td>
                            <td className="py-2 print:py-2 px-4 border border-black print:hidden ">
                              {formatStok(item.stok_awal + item.total_keluar)}
                            </td>
                            <td className="py-2 print:py-2 px-4 border border-black">
                              {formatStok(item.stok_awal)}
                            </td>
                            <td className="py-2 print:py-2 px-4 border border-black">
                              {formatStok(item.total_keluar)}
                            </td>
                            <td className="py-2 print:py-2  px-4 border border-black">
                              {formatStok(item.total_keluar * 3 * 1.2)}
                            </td>

                            <td className="py-2 print:py-2 px-4 border border-black print:hidden ">
                              {formattedExpireDate}
                            </td>

                            <td className="py-2 print:py-2 px-4 border border-black print:w-20">
                              {/* {formatRupiah(item.harga_dasar)} */}
                  {/* {item.harga_dasar.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    // hapus ,00
                    minimumFractionDigits: 0,
                  })} */}
                  {item.harga_dasar.toLocaleString()}
                            </td>
                            <td className="py-2 print:py-2 px-4 border border-black print:w-20">
                              {/* {formatRupiah(
                                item.harga_dasar * (item.total_keluar * 3 * 1.2)
                              )} */}
                              {(
                                item.harga_dasar * (item.total_keluar * 3 * 1.2)
                              ).toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              })}
                            </td>
                            <td className="py-2 print:py-2 px-4 border border-black"></td>
                            <td className="py-2 print:py-2 px-4 border border-black print:hidden">
                              {item.nama_suplier}
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan="10" className="py-4">
                        Tidak ada data yang sesuai.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-center  p-1 border border-black rounded-md">
              <div className="flex flex-col">
                <p className="font-bold">BIAYA PERENCANAAN 3 BULAN: </p>
                <span className="text-red-500 font-bold text-md">
                  {formatRupiah(totalHargaTigaBulan)}
                </span>
              </div>
            </div>

            <TTDLaporan />
          </div>
        </div>
      </div>
    </>
  );
};

export default LaporanObat;
