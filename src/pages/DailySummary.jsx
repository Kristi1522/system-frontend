// Importime të nevojshme nga React dhe axios
import { useEffect, useState } from "react";
import axios from "axios";

// Komponentët grafikë për vizualizim
import BarChartComponent from "../components/BarChartComponent";
import DailyRevenueChart from "../components/DailyRevenueChart";

// URL-ja bazë për API
const API_URL = "https://system-backend-0i7a.onrender.com";

// Komponenti kryesor për përmbledhjen ditore të të ardhurave
export default function DailySummary() {
  const [data, setData] = useState([]); // Të ardhura për një ditë të caktuar sipas kamarierëve
  const [revenueByDate, setRevenueByDate] = useState([]); // Të ardhura për çdo ditë (për grafikun)
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  ); // Data e zgjedhur, fillimisht sot

  const token = localStorage.getItem("token"); // Merr tokenin për autorizim

  // useEffect që ekzekutohet sa herë ndryshon data e zgjedhur
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Kërkesë për përmbledhje ditore sipas kamarierëve
        const res = await axios.get(`${API_URL}/orders/daily-summary`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { date: selectedDate }, // Dërgo datën si parametër
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching daily summary:", err);
      }
    };

    const fetchRevenueByDate = async () => {
      try {
        // Kërkesë për të ardhura sipas datave për grafikun
        const res = await axios.get(`${API_URL}/orders/revenue-by-date`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRevenueByDate(res.data);
      } catch (err) {
        console.error("Error fetching revenue by date:", err);
      }
    };

    fetchData();
    fetchRevenueByDate();
  }, [selectedDate]);

  // Llogaritja e totalit të të ardhurave për ditën e zgjedhur
  const totalRevenue = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-screen bg-background p-6 text-textdark">
      {/* Titulli dhe përzgjedhja e datës */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-primary">📅 Daily Revenue by Waiters</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="date" className="text-sm font-medium">Select date:</label>
          <input
            type="date"
            id="date"
            className="border px-3 py-1 rounded shadow-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela e të ardhurave sipas kamarierëve */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Revenue (€)</th>
              <th className="py-3 px-6 text-left">Order Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.email} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{d.email}</td>
                <td className="py-3 px-6">{d.total.toFixed(2)}€</td>
                <td className="py-3 px-6">{d.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totali i përmbledhur i të ardhurave ditore */}
      <div className="mb-12">
        <table className="w-full max-w-md mx-auto bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="py-3 px-6 text-center">Total Daily Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-4 px-6 text-center font-bold text-lg">
                {totalRevenue.toFixed(2)}€
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Grafik me kolonë për të ardhura sipas kamarierëve */}
      <h3 className="text-3xl font-semibold text-secondary mb-6 text-center">
        📊 Revenue by Waiter
      </h3>
      <BarChartComponent data={data} />

      {/* Grafik me linjë për të ardhura sipas datës */}
      <h3 className="text-3xl font-semibold text-secondary mt-12 mb-6 text-center">
        📈 Revenue by Date
      </h3>
      <DailyRevenueChart data={revenueByDate} />
    </div>
  );
}
