import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Dashboard.css";

const Dashboard = () => {
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedVendorName, setSelectedVendorName] = useState("");
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/vendors`);
        setVendors(response.data);
      } catch (error) {
        console.error("Tedarikçi verileri alınırken hata oluştu:", error);
      }
    };

    fetchVendors();
  }, [API_URL]);

  const handleView = (viewType) => {
    if (selectedVendor) {
      navigate(`/${viewType}/${selectedVendor}`, {
        state: { vendorName: selectedVendorName },
      });
    } else {
      alert("Lütfen önce bir tedarikçi seçin!");
    }
  };

  const handleVendorChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedVendor(selectedValue);

    const vendor = vendors.find((v) => v._id === selectedValue);
    setSelectedVendorName(vendor ? vendor.name : "");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Ana Ekran</h1>
      <div className="vendor-selection-container">
        <label htmlFor="vendorSelect">Tedarikçi Seç:</label>
        <select
          id="vendorSelect"
          onChange={handleVendorChange}
          value={selectedVendor}
        >
          <option value="">Tedarikçi Seçin</option>
          {vendors.map((vendor) => (
            <option key={vendor._id} value={vendor._id}>
              {vendor.name}
            </option>
          ))}
        </select>
      </div>
      <div className="dashboard-buttons">
        <button
          className="dashboard-button monthly-sales"
          onClick={() => handleView("monthly-sales")}
        >
          Aylık Grafik
        </button>
        <button
          className="dashboard-button all-time-sales"
          onClick={() => handleView("all-time-table")}
        >
          Tüm Zamanlar Tablosu
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
