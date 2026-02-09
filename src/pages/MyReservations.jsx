import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./adminTables.css";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  useEffect(() => {
    const fetchMyReservations = async () => {
      if (!user?.token) return;

      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/reservations/my`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setReservations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Gabim gjate marrjes se rezervimeve:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReservations();
  }, [user]);

  const statusClass = (s) => {
    const v = String(s || "").toLowerCase();
    if (v.includes("approved") || v.includes("confirmed") || v.includes("done") || v.includes("ok"))
      return "at-badge at-ok";
    if (v.includes("pending") || v.includes("wait"))
      return "at-badge at-warn";
    if (v.includes("reject") || v.includes("cancel"))
      return "at-badge at-bad";
    return "at-badge";
  };

  return (
    <div className="at-page">
      <div className="at-shell">
        <header className="at-head">
          <div className="at-badgeTop">User • Reservations</div>

          <div className="at-headRow">
            <h2 className="at-title">Rezervimet e mia</h2>
          </div>

          <p className="at-subtitle">Ketu shikon rezervimet e tua dhe statusin.</p>
        </header>

        {!user?.token ? (
          <div className="at-empty">
            <div className="at-emptyTitle">Duhet login</div>
            <div className="at-emptySub">Token mungon, s’mund te lexohen rezervimet.</div>
          </div>
        ) : loading ? (
          <div className="at-empty">
            <div className="at-emptyTitle">Duke ngarkuar...</div>
            <div className="at-emptySub">Po marrim te dhenat nga serveri.</div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="at-empty">
            <div className="at-emptyTitle">Nuk ke asnje rezervim</div>
            <div className="at-emptySub">Kur te krijosh nje rezervim, do shfaqet ketu.</div>
          </div>
        ) : (
          <div className="at-tableWrap">
            <table className="at-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Ora</th>
                  <th className="at-thRight">Persona</th>
                  <th className="at-thRight">Statusi</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((r) => (
                  <tr key={r._id}>
                    <td className="at-tdMuted">
                      {r.date ? new Date(r.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="at-tdStrong">{r.time || "-"}</td>
                    <td className="at-tdRight at-tdStrong">{r.peopleCount ?? "-"}</td>
                    <td className="at-tdRight">
                      <span className={statusClass(r.status)}>{r.status || "N/A"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
