import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "../App.css";

const MonthlySales = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({});
  const [allData, setAllData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [filterType, setFilterType] = useState("all");
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/sales-by-vendor?vendor=${vendorId}`
        );
        const data = response.data;

        setAllData(data);
        setChartData(data);
      } catch (error) {
        console.error("Grafik verisi alınırken hata oluştu:", error);
      }
    };

    fetchSalesData();
  }, [vendorId, API_URL]);

  useEffect(() => {
    let filteredData = [...allData];

    if (filterType === "lastMonth") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      filteredData = filteredData.filter((item) => {
        if (!item.payment_at) return false;
        const itemDate = new Date(item.payment_at);
        return itemDate >= oneMonthAgo;
      });
    } else {
      if (filterType === "top10") {
        filteredData = filteredData
          .sort((a, b) => b.totalSold - a.totalSold)
          .slice(0, 10);
      } else if (filterType === "specific" && selectedProduct) {
        filteredData = filteredData.filter(
          (item) => item._id === selectedProduct
        );
      }
    }

    const labels = filteredData.map((item) =>
      item._id.length > 15 ? item._id.slice(0, 15) + "..." : item._id
    );
    const values = filteredData.map((item) => item.totalSold);
    const backgroundColors = labels.map(() => getRandomColor());

    setChartData({
      labels,
      datasets: [
        {
          label:
            filterType === "specific" ? `Ürün: ${selectedProduct}` : "Satışlar",
          data: values,
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    });
  }, [filterType, selectedProduct, allData]);

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilterType(selectedFilter);

    if (selectedFilter === "lastMonth") {
      setSelectedProduct("");
    }
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    setFilterType("specific");
  };

  return (
    <div style={{ overflowX: "hidden", width: "100%" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "#ff4d4d",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "15px",
        }}
      >
        ← Geri
      </button>
      <h1>Satış Grafiği</h1>
      <div>
        <label>
          Filtre Türü:
          <select value={filterType} onChange={handleFilterChange}>
            <option value="all">Tüm Veriler</option>
            <option value="top10">Top 10</option>
            <option value="specific">Belirli Ürün</option>
            <option value="lastMonth">Son 1 Ay</option>
          </select>
        </label>

        {filterType === "specific" && (
          <label>
            Ürün Seçin:
            <select value={selectedProduct} onChange={handleProductChange}>
              <option value="">Ürün Seç</option>
              {allData.map((item) => (
                <option key={item._id} value={item._id}>
                  {item._id}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {chartData.labels && chartData.labels.length > 0 ? (
        <div
          style={{
            overflowX: filterType === "all" ? "auto" : "hidden",
            overflowY: "hidden",
            whiteSpace: filterType === "all" ? "nowrap" : "normal",
            paddingBottom: "20px",
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              display: filterType === "all" ? "inline-block" : "block",
              minWidth:
                filterType === "all"
                  ? `${Math.max(chartData.labels.length * 50, 1500)}px`
                  : "auto",
              height: "500px",
            }}
          >
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    callbacks: {
                      title: (tooltipItems) => {
                        const index = tooltipItems[0].dataIndex;
                        return allData[index]?._id || chartData.labels[index];
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      maxRotation: 90,
                      minRotation: 90,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", fontSize: "18px", marginTop: "20px" }}>
          Bu filtre için veri bulunamadı.
        </p>
      )}
    </div>
  );
};

export default MonthlySales;
