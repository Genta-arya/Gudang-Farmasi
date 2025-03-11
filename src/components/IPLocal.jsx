import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaServer } from "react-icons/fa";

const IPLocal = () => {
  const [publicIP, setPublicIP] = useState("Memuat...");
  const [localIP, setLocalIP] = useState("");
  const [inputPublic, setInputPublic] = useState("");
  const [inputLocal, setInputLocal] = useState("");
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);

  // Ambil IP Publik dari API dengan Axios
  const fetchPublicIP = async () => {
    try {
      const response = await axios.get("https://bridging-ip.vercel.app/api/ip");
      setPublicIP(response.data.data.ip);
      setInputPublic(response.data.data.ip); // Set input default dengan IP Publik
      setId(response.data.data.id);

      localStorage.setItem("ip", response.data.data.ip);
    } catch (error) {
      console.error("Gagal mengambil IP Publik:", error);
      setPublicIP("Gagal mengambil IP");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPublicIP();
  }, []);

  // Ambil IP Lokal menggunakan WebRTC
  const fetchLocalIPAddress = () => {
    return new Promise((resolve, reject) => {
      const localIPs = new Set();
      const rtcPeerConnection = new RTCPeerConnection({ iceServers: [] });

      rtcPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          const regex = /(?:\d{1,3}\.){3}\d{1,3}/;
          const ipMatch = event.candidate.candidate.match(regex);
          if (ipMatch) {
            localIPs.add(ipMatch[0]);
          }
        } else {
          resolve(Array.from(localIPs));
          rtcPeerConnection.close();
        }
      };

      console.log(localIPs);

      rtcPeerConnection.createDataChannel("");
      rtcPeerConnection
        .createOffer()
        .then((offer) => rtcPeerConnection.setLocalDescription(offer))
        .catch((error) => reject(error));
    });
  };
  useEffect(() => {
    console.log("aasda");
    fetchLocalIPAddress()
      .then((ips) => {
        setLocalIP(ips[0]);
        setInputLocal(ips[0]);
      })
      .catch((error) => {
        console.error("Gagal mendapatkan IP lokal:", error);
      });
  }, []);

  // Handle update IP ke backend
  const handleUpdateIP = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `https://bridging-ip.vercel.app/api/ip/${id}`,
        {
          ip: inputLocal,
        }
      );

      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error update IP:", error);
    } finally {
      setLoading(false); // Matikan loading setelah request selesai
    }
  };

  return (
    <div className="p-6 bg-white text-sm rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Informasi Server
      </h1>

      {/* IP Publik */}
      {!loading && (
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            IP Server
          </label>
          <input
            type="text"
            readOnly
            className="p-2 border rounded w-full"
            value={inputPublic}
          />
        </div>
      )}

      {/* IP Lokal */}

      {localIP && (
        <div className="flex items-center justify-start gap-4 mb-4">
          <FaServer className="text-blue-500 text-xl" />
          <p className="text-lg text-gray-600">
            {localIP || "Tidak ditemukan"}
          </p>
        </div>
      )}

      {/* Input IP Lokal dengan tombol Simpan */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Ganti IP
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="p-2 border rounded w-full"
            value={inputLocal}
            placeholder="Masukkan Alamat IP"
            onChange={(e) => setInputLocal(e.target.value)}
          />
          <button
            className={`px-8 py-1 rounded ${
              inputLocal === publicIP
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
            onClick={handleUpdateIP}
            disabled={inputLocal === publicIP}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default IPLocal;
