import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalesTable = () => {
  const [salesData, setSalesData] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

  useEffect(() => {
    axios.get(`${API_URL}/api/sales`)
      .then((response) => {
        setSalesData(response.data);
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error);
      });
  }, [API_URL]);

  return (
    <div>
      <h1>Satış Tablosu</h1>
      <table>
        <thead>
          <tr>
            <th>Ürün Adı</th>
            <th>Toplam Satış</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((item) => (
            <tr key={item._id}>
              <td>{item.productName}</td>
              <td>{item.totalSold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
