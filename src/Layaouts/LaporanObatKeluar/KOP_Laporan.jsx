import React from "react";
import icon from "../../assets/icon.png";
import icon_rs from "../../assets/icon_rs.png";

const KOPLaporan = ( { tanggal}) => {

  const dateObj = new Date(tanggal);
  dateObj.setDate(1); // Pastikan tanggal selalu 1
  const formatTanggal = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const romawiBulan = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

  // Mengambil bulan saat ini (dimulai dari 0, jadi tambahkan 1)
  const bulanSaatIni = new Date().getMonth();
  const bulanRomawi = romawiBulan[bulanSaatIni];

  return (
    <>
      <div className="mb-8 bg-white w-full">
        <div className="flex items-center mb-4 justify-evenly text-center">
          <img src={icon} alt="Logo" className="w-16 print:w-12" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              PEMERINTAH KABUPATEN KETAPANG
            </h1>
            <h1 className="text-xl font-bold text-gray-800">DINAS KESEHATAN</h1>
            <p className="text-xs text-black">
              Jalan. Mayjen D.I. Panjaitan No. 51 Ketapang, Kalimantan Barat,
              Kode Pos : 78851 Telp. (0534) - 306715
            </p>

            <p className="text-sm text-black">
              e-mail: rsudagoesdjamktp@gmailcom
            </p>
          </div>
          <div></div>
        </div>

        <hr className="border-t border-black mb-1" />
        <hr className="border-t-2 border-black mb-4" />
      </div>

      <div className="mb-8 -mt-4">
        <div>
          <h2 className="text-base uppercase text-center font-bold text-gray-800 mb-2">
            Pemberitahuan Sisa Stok Obat Farmasi
          </h2>
        </div>
        <div className="flex justify-between mt-8 text-sm font-bold">
          <div className="flex flex-col gap-2">
            <div className="flex gap-[46px]">
              <p>Nomor</p>
              <p>
                :
                <span className="ml-4 fontb-bold">
                  B/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ PENUNJANG-
                  A.442.1/{bulanRomawi}/2024
                </span>
              </p>
            </div>
            <div className="flex gap-8">
              <p className="">Lampiran</p>
              <p className="">
                : <span className="ml-4 font-bold">-</span>
              </p>
            </div>
            <p></p>
          </div>
          <div className="flex flex-col gap-2 font-bold">
            <div className="flex flex-col">
              <p>Ketapang, {formatTanggal}</p>
              <p>Kepada</p>
              <p>Yth. PPK dan Pejabat Pengadaan </p>
              <div className="ml-7">
                <p>Obat dan BHP Farmasi</p>
                <p>di- Ketapang</p>
              </div>
            </div>

            <p></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default KOPLaporan;
