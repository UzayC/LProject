import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import MonthlySales from "./components/MonthlySales";
import AllTimeTable from "./components/AllTimeTable";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/monthly-sales/:vendorId" element={<MonthlySales />} />
        <Route path="/all-time-table/:vendorId" element={<AllTimeTable />} />
      </Routes>
    </Router>
  );
}

export default App;
