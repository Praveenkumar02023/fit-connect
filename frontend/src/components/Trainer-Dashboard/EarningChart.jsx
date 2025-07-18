import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const EarningsChart = ({ data }) => {
  // Format current month like "July 2025"
  const currentMonthLabel = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl shadow p-6 w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-left">
        This Month's Earnings
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#3b82f6" name="Earnings" />
        </BarChart>
      </ResponsiveContainer>

      <p className="text-sm text-gray-500 text-center mt-4">{currentMonthLabel}</p>
    </div>
  );
};

export default EarningsChart;
