import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import "./dailyRevenueChart.css";

export default function DailyRevenueChart({ data }) {
  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#64748b"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#64748b"
          />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              fontWeight: 600,
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Revenue €"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
