import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import "./barChartComponent.css";

export default function BarChartComponent({ data }) {
  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="email" tick={{ fontSize: 12 }} stroke="#64748b" />
          <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              fontWeight: 600,
            }}
          />
          <Bar dataKey="total" fill="#6366f1" radius={[10, 10, 0, 0]}>
            <LabelList
              dataKey="total"
              position="top"
              formatter={(v) => `${Number(v).toFixed(0)}€`}
              style={{ fontWeight: 800, fill: "#0f172a", fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
