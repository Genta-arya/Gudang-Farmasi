import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDetailAmprahan } from "../../service/GetDataStokOpname";
import { useReactToPrint } from "react-to-print";
import KOP from "./KOP";
import Header from "./Header";
import TTD from "./TTD";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale"; // Import locale untuk Bahasa Indonesia
import LoadingGlobal from "../../components/Loading";
import Navbar from "../../components/navbar";

const DetailAmprahan = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDetailAmprahan({ no_permintaan: id });

        const sortedData = response.data.sort((a, b) =>
          a.nama_brng.localeCompare(b.nama_brng)
        );

        setData(sortedData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @media print {
        @page {
          size:  ${data.length > 50 ? "F4 landscape" : "A4 portrait"};
          marginTop: 10mm;
          
        }
       
        .page-break { page-break-before: always; }
        .page-break-margin { margin-top: 10mm; }
       
      }
    `,
  });

  const formatDate = (dateString) => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${monthName} ${year}`;
  };

  if (loading) {
    return <LoadingGlobal />;
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-red-500">{error}</div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center p-20">
        <div className=" w-full max-w-[220mm] bg-gray-100  p-6 shadow-lg border border-gray-500">
          <button
            onClick={handlePrint}
            className=" px-4 py-2 w-full mb-8  bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Print
          </button>

          {data.length > 0 ? (
            <div
              ref={componentRef}
              className="overflow-x-auto  flex justify-center bg-white "
            >
              <div className="w-[90%] ">
                <KOP />
                <div className="mb-8 -mt-4">
                  <h2 className="text-base text-center font-bold text-gray-800 mb-2">
                    DATA PERMINTAAN OBAT/ALKES/BHP MEDIS
                  </h2>
                  <h2 className="text-base text-center font-bold text-gray-800 mb-2">
                    GUDANG FARMASI
                  </h2>
                  <h2 className="text-base text-center font-bold text-gray-800 mb-4">
                    {formatDate(data[0].tanggal)}
                  </h2>
                </div>
                <Header data={data[0]} />
                <table className="min-w-full divide-y  divide-gray-200 border border-black ">
                  <thead className="bg-gray-50 ">
                    <tr className=" text-center ">
                      <th className="w-20 py-2   text-xs border border-black font-bold text-black uppercase tracking-wider">
                        {" "}
                        No{" "}
                      </th>
                      <th className="w-72 py-2  text-xs border   border-black font-bold text-black ppercase tracking-wider">
                        Nama Barang
                      </th>
                      <th className="w-20  py-2  text-xs border border-black font-bold text-black uppercase tracking-wider">
                        Jumlah
                      </th>

                      <th className="w-52 py-2  text-xs border border-black font-bold text-black uppercase tracking-wider">
                        Kode Satuan
                      </th>
                      <th className="w-52 py-2  text-xs border border-black font-bold text-black uppercase tracking-wider">

                        Tersedia</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 border border-black">
                    {data.map((item, index) => (
                      <tr key={item.kode_brng} className=" text-center">
                        <td className="px-6  text-xs border border-black text-gray-500">
                          {" "}
                          {index + 1}
                        </td>
                        <td className="px-6  text-xs border border-black text-gray-500">
                          {item.nama_brng}
                        </td>
                        <td className="px-6   text-xs border border-black text-gray-500">
                          {item.jumlah.toLocaleString("id-ID")}
                        </td>

                        <td className="px-6   text-xs border border-black text-gray-500">
                          {item.kode_sat}
                        </td>

                        <td className="px-6   text-xs border border-black text-gray-500">
                          {item.stok.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <TTD data={data[0]} />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DetailAmprahan;
