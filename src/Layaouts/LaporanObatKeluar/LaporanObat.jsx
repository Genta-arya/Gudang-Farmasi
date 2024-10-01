import React, { useState, useEffect } from "react";
import { getDataLaporan } from "../../service/GetDataLaporan";
import LoadingGlobal from "../../components/Loading";
import ExcelJS from "exceljs"; // Library untuk export Excel
import { saveAs } from "file-saver"; // Library untuk menyimpan file

const LaporanObat = () => {
  const [date, setDate] = useState("2024-09");
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
        style: { numFmt: '"Rp "#,##0.00' },
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
        harga_dasar: formatRupiah(item.harga_dasar),
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

  if (loading) return <LoadingGlobal />;

  const filteredData = data.filter((item) =>
    item.nama_barang.toLowerCase().includes(searchTerm)
  );

  return (
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
        className="mb-4 bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Export to Excel
      </button>

      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white border border-gray-300 text-center text-xs">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 border-b">No</th>
            <th className="py-2 px-4 border-b">Nama Barang</th>
            <th className="py-2 px-4 border-b">Stok Awal</th>
            <th className="py-2 px-4 border-b">Sisa Stok</th>
            <th className="py-2 px-4 border-b">Total Keluar</th>
            <th className="py-2 px-4 border-b">Perencanaan 3 bulan</th>
            <th className="py-2 px-4 border-b">Expire</th>
            <th className="py-2 px-4 border-b">Kode Satuan</th>
            <th className="py-2 px-4 border-b">Harga Dasar</th>
            <th className="py-2 px-4 border-b">Nama Suplier</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              const expireDate = item.expire ? new Date(item.expire) : null;
              const formattedExpireDate = expireDate
                ? expireDate.toLocaleDateString("id-ID")
                : "Tidak diketahui";

              return (
                <tr
                  key={item.kode_brng}
                  className="hover:bg-gray-100 text-center"
                >
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{item.nama_barang}</td>
                  <td className="py-2 px-4 border-b">
                    {formatStok(item.stok_awal + item.total_keluar)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatStok(item.stok_awal)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatStok(item.total_keluar)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatStok(item.total_keluar * 3 * 1.2)}
                  </td>
                  <td className="py-2 px-4 border-b">{formattedExpireDate}</td>
                  <td className="py-2 px-4 border-b">{item.kode_sat}</td>
                  <td className="py-2 px-4 border-b">
                    {formatRupiah(item.harga_dasar)}
                  </td>
                  <td className="py-2 px-4 border-b">{item.nama_suplier}</td>
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
  );
};

export default LaporanObat;
