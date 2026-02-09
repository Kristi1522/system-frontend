import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./MyMeetings.css";

export default function MyMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  useEffect(() => {
    const fetchMyMeetings = async () => {
      if (!user?.token) return;

      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/meetings/my`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMeetings(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Gabim gjate marrjes se takimeve te mia:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyMeetings();
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
          <div className="at-badgeTop">User • Meetings</div>

          <div className="at-headRow">
            <h2 className="at-title">Takimet e mia</h2>
          </div>

          <p className="at-subtitle">Ketu shikon takimet e tua dhe statusin e tyre.</p>
        </header>

        {!user?.token ? (
          <div className="at-empty">
            <div className="at-emptyTitle">Duhet login</div>
            <div className="at-emptySub">Token mungon, s’mund te lexohen takimet.</div>
          </div>
        ) : loading ? (
          <div className="at-empty">
            <div className="at-emptyTitle">Duke ngarkuar...</div>
            <div className="at-emptySub">Po marrim te dhenat nga serveri.</div>
          </div>
        ) : meetings.length === 0 ? (
          <div className="at-empty">
            <div className="at-emptyTitle">Nuk ke asnje takim</div>
            <div className="at-emptySub">Kur admini te krijoje nje takim, do shfaqet ketu.</div>
          </div>
        ) : (
          <div className="at-tableWrap">
            <table className="at-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Ora</th>
                  <th>Tema</th>
                  <th className="at-thRight">Statusi</th>
                </tr>
              </thead>

              <tbody>
                {meetings.map((m) => (
                  <tr key={m._id}>
                    <td className="at-tdMuted">
                      {m.date ? new Date(m.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="at-tdStrong">{m.hour || "-"}</td>
                    <td>{m.topic || "-"}</td>
                    <td className="at-tdRight">
                      <span className={statusClass(m.status)}>{m.status || "N/A"}</span>
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
