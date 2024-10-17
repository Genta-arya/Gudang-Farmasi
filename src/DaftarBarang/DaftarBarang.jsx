import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/navbar";
import { getDataStokOpname } from "../service/GetDataStokOpname";
import LoadingGlobal from "../components/Loading";
import { FaSearch, FaFilter } from "react-icons/fa"; // Menggunakan icon untuk search dan filter

const Stok = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Untuk data yang sudah difilter
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(""); // Menyimpan jenis filter
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDataStokOpname();
        setData(result.data);
        setFilteredData(result.data); // Default data difilter adalah semua data
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };


  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const searchResults = data.filter(item =>
      item.nama_brng.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredData(searchResults);
  };

 
  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilter(value);

    let filtered = data;

    if (value === "expired") {
      filtered = data.filter(item => new Date(item.expire) < new Date());
    } else if (value === "habis") {
      filtered = data.filter(item => item.stok === 0);
    }

    setFilteredData(filtered);
  };

  if (loading) {
    return <LoadingGlobal />;
  }

  return (
    <>
      <Navbar />
      <div className="p-6 w-full">
   
        <div className="flex justify-between items-center mb-4 md:px-8 lg:px-8 px-0 lg:text-base md:text-base text-xs">
     
          <div className="flex items-center bg-white rounded-md shadow-md p-2">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Cari nama obat..."
              className="outline-none text-gray-600"
            />
          </div>

          {/* Filter Select */}
          <div className="flex items-center  bg-white  rounded-md shadow-md p-2">
            <FaFilter className="text-gray-400 mr-2" />
            <select
              value={filter}
              onChange={handleFilterChange}
              className="outline-none  w-full text-gray-600 bg-white"
            >
              <option value="">Semua</option>
              <option value="expired">Obat Expired</option>
              <option value="habis">Obat Habis</option>
            </select>
          </div>
        </div>

        {filteredData.length > 0 ? (
          <div className="overflow-auto w-full ">
            <div className="">
              <table className="bg-white border border-gray-200 rounded-lg shadow-md mt-8 print:mt-4 w-full">
                <thead className="font-bold text-center">
                  <tr className="bg-gray-100 border-b font-bold text-xs text-center">
                    <th className="px-6 w-20 text-center border border-black text-gray-600 text-xs uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 w-fit  border border-black text-gray-600 text-xs uppercase tracking-wider">
                      Nama Barang
                    </th>
                    <th className="px-6  border border-black text-gray-600 text-xs uppercase tracking-wider">
                      Expire
                    </th>
                    <th className="px-6  border border-black text-gray-600 text-xs uppercase tracking-wider">
                      PBF
                    </th>
                    <th className="px-6   border border-black text-gray-600 text-xs uppercase tracking-wider">
                      Stok
                    </th>
                    <th className="px-6  border border-black text-gray-600 text-xs uppercase tracking-wider">
                      Harga 
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => {
                    const isExpired = new Date(item.expire) < new Date();
                    return (
                      <tr
                        key={item.kode_brng}
                        className={`border-b text-center font-semibold `}
                      >
                        <td className="px-6 text-center border border-black whitespace-nowrap text-xs">
                          {index + 1}
                        </td>
                        <td className="px-6 text-left w-fit  border border-black text-xs">
                          {item.nama_brng}
                        </td>
                        <td className="px-6 w-20 border border-black whitespace-nowrap text-xs">
                          {formatDate(item.expire)}
                        </td>
                        <td className="px-6  py-2 border border-black text-xs">
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
                        <td className="px-6 w-52 py-2 border border-black text-xs">
                          Rp.   {item.harga_jual.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No data available</p>
        )}
      </div>
    </>
  );
};

export default Stok;
