import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useReactToPrint } from "react-to-print";
 const exportToExcel = async (data) => {
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
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
      cell.alignment = { horizontal: "center" };
    } else if (colNumber === 9) {
      cell.numFmt = '"Rp "#,##0.00'; // Format untuk total pengeluaran
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { horizontal: "center" };
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
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


  const handleExportExcel = (data) => {
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


export { exportToExcel, formatRupiah , handleExportExcel , formatDate };