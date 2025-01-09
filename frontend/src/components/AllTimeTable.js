import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../AllTimeTable.css";

const AllTimeTable = () => {
  const { vendorId } = useParams();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();

  const vendorName = location.state?.vendorName || "Bilinmeyen Tedarikçi";
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/sales-by-vendor?vendor=${vendorId}`
        );
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Tablo verisi alınırken hata oluştu:", error);
      }
    };

    fetchData();
  }, [vendorId, API_URL]);

  const handleSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.totalSold - b.totalSold;
      } else {
        return b.totalSold - a.totalSold;
      }
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = data.filter(
      (item) =>
        item._id.toLowerCase().includes(value) ||
        item.totalSold.toString().includes(value)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="table-container">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Geri
        </button>
        <h2 className="vendor-name">{vendorName}</h2>
      </div>

      <h1 className="table-title">Tüm Zamanlar Satış Tablosu</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Ürün ID veya Toplam Satış Ara"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Ürün ID</th>
            <th>
              Toplam Satış{" "}
              <button className="sort-button" onClick={handleSort}>
                {sortOrder === "asc" ? "Artan ↓" : "Azalan ↑"}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.totalSold}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredData.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Aramanıza uygun sonuç bulunamadı.
        </p>
      )}
    </div>
  );
};

export default AllTimeTable;
