import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import BarChartComponent from "../components/BarChartComponent";
import DailyRevenueChart from "../components/DailyRevenueChart";

import "./DailySummary.css";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function DailySummary() {
  const [data, setData] = useState([]);
  const [revenueByDate, setRevenueByDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);

  const token = useMemo(() => {
    const t = localStorage.getItem("token");
    if (t) return t;
    const raw = localStorage.getItem("user");
    const u = raw ? JSON.parse(raw) : null;
    return u?.token || "";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/orders/daily-summary`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { date: selectedDate },
        });
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching daily summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, token]);

  useEffect(() => {
    const fetchRevenueByDate = async () => {
      if (!token) return;
      try {
        setLoadingChart(true);
        const res = await axios.get(`${API_URL}/orders/revenue-by-date`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRevenueByDate(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching revenue by date:", err);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchRevenueByDate();
  }, [token]);

  const totalRevenue = data.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  return (
    <div className="ds-page">
      <div className="ds-shell">
        <header className="ds-head">
          <div className="ds-badge">Admin • Revenue</div>

          <div className="ds-headRow">
            <div>
              <h2 className="ds-title">Daily Revenue by Waiters</h2>
              <p className="ds-subtitle">
                Zgjidh daten dhe shiko te ardhurat sipas kamarierit + totalin ditor.
              </p>
            </div>

            <div className="ds-date">
              <label htmlFor="date" className="ds-label">
                Select date
              </label>
              <input
                type="date"
                id="date"
                className="ds-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </header>

        {!token ? (
          <div className="ds-empty">
            <div className="ds-emptyTitle">Duhet login</div>
            <div className="ds-emptySub">Token mungon, s’mund te lexohen te dhenat.</div>
          </div>
        ) : (
          <>
            <section className="ds-card">
              <div className="ds-cardHead">
                <h3 className="ds-cardTitle">Revenue Table</h3>
                <span className={`ds-pill ${loading ? "is-loading" : ""}`}>
                  {loading ? "Loading..." : `${data.length} rows`}
                </span>
              </div>

              {loading ? (
                <div className="ds-empty ds-empty--inCard">
                  <div className="ds-emptyTitle">Duke ngarkuar...</div>
                  <div className="ds-emptySub">Po marrim te dhenat per daten e zgjedhur.</div>
                </div>
              ) : data.length === 0 ? (
                <div className="ds-empty ds-empty--inCard">
                  <div className="ds-emptyTitle">Nuk ka te dhena</div>
                  <div className="ds-emptySub">S’ka porosi per kete date.</div>
                </div>
              ) : (
                <div className="ds-tableWrap">
                  <table className="ds-table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Revenue (€)</th>
                        <th className="ds-thRight">Order Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((d) => (
                        <tr key={d.email}>
                          <td className="ds-tdStrong">{d.email}</td>
                          <td className="ds-tdStrong">{Number(d.total || 0).toFixed(2)}€</td>
                          <td className="ds-tdRight ds-tdMuted">{d.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="ds-card ds-total">
              <div className="ds-totalLabel">Total Daily Revenue</div>
              <div className="ds-totalValue">{totalRevenue.toFixed(2)}€</div>
              <div className="ds-totalHint">Totali per daten: {selectedDate}</div>
            </section>

            <section className="ds-card">
              <div className="ds-cardHead">
                <h3 className="ds-cardTitle">Revenue by Waiter</h3>
                <p className="ds-cardDesc">Grafik me kolona.</p>
              </div>
              <div className="ds-chart">
                <BarChartComponent data={data} />
              </div>
            </section>

            <section className="ds-card">
              <div className="ds-cardHead">
                <h3 className="ds-cardTitle">Revenue by Date</h3>
                <p className="ds-cardDesc">
                  Grafik me linje. {loadingChart ? "Duke ngarkuar..." : ""}
                </p>
              </div>
              <div className="ds-chart">
                <DailyRevenueChart data={revenueByDate} />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
