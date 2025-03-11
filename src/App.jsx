import React from "react";
import { Route, Routes } from "react-router-dom";
import StokObat from "./Layaouts/StokObat/StokObat";
import Amprahan from "./Layaouts/Amprahan/Amprahan";
import DetailAmprahan from "./Layaouts/Amprahan/DetailAmprahan";
import LayoutHome from "./Home/LayoutHome";
import Stok from "./DaftarBarang/DaftarBarang";
import Laporan from "./Layaouts/LaporanSO/Laporan";
import LaporanObat from "./Layaouts/LaporanObatKeluar/LaporanObat";


const App = () => {
  return (
    <Routes>
      <Route path="/stok" element={<StokObat />} />
      <Route path="/barang" element={<Stok />} />
      <Route path="/" element={<LayoutHome />} />

      <Route path="/detail/:id/:dari" element={<DetailAmprahan />} />
      <Route path="/laporan/stokopname" element={<Laporan />} />
      <Route path="/obatkeluar" element={<LaporanObat />} />
      <Route path="/amprahan" element={<Amprahan />} />
      <Route
        path="*"
        element={
          <>
            <p className="flex justify-center h-screen mx-auto items-center">
              404 || Halaman tidak ditemukan
            </p>
          </>
        }
      />
    </Routes>
  );
};

export default App;
