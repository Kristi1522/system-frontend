import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./AdminMeetings.css";

export default function AdminMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  useEffect(() => {
    fetchMeetings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMeetings = async () => {
    if (!user?.token) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/meetings`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMeetings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gabim gjate marrjes se takimeve:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Fshi takimin?")) return;

    try {
      await axios.delete(`${API_URL}/api/meetings/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMeetings((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Gabim gjate fshirjes se takimit:", err);
      alert("Deshtoi fshirja.");
    }
  };

  const statusClass = (s) => {
    const v = String(s || "").toLowerCase();
    if (v.includes("approved") || v.includes("done") || v.includes("ok")) return "at-badge at-ok";
    if (v.includes("pending") || v.includes("wait")) return "at-badge at-warn";
    if (v.includes("reject") || v.includes("cancel")) return "at-badge at-bad";
    return "at-badge";
  };

  return (
    <div className="at-page">
      <div className="at-shell">
        <header className="at-head">
          <div className="at-badgeTop">Admin • Meetings</div>
          <div className="at-headRow">
            <h2 className="at-title">Takimet</h2>

            <div className="at-headActions">
              <button type="button" className="at-btnGhost" onClick={fetchMeetings} disabled={loading}>
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
          <p className="at-subtitle">Menaxho takimet (shfaq, kontrollo, fshi).</p>
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
            <div className="at-emptyTitle">Nuk ka takime</div>
            <div className="at-emptySub">Kur te krijohen, do shfaqen ketu.</div>
          </div>
        ) : (
          <div className="at-tableWrap">
            <table className="at-table">
              <thead>
                <tr>
                  <th>Perdoruesi</th>
                  <th>Email</th>
                  <th>Data</th>
                  <th>Ora</th>
                  <th>Tema</th>
                  <th>Statusi</th>
                  <th className="at-thRight">Veprim</th>
                </tr>
              </thead>

              <tbody>
                {meetings.map((m) => (
                  <tr key={m._id}>
                    <td className="at-tdStrong">{m.user?.name || "Anonim"}</td>
                    <td className="at-tdMuted">{m.user?.email || "-"}</td>
                    <td className="at-tdMuted">
                      {m.date ? new Date(m.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="at-tdMuted">{m.hour || "-"}</td>
                    <td>{m.topic || "-"}</td>
                    <td>
                      <span className={statusClass(m.status)}>{m.status || "N/A"}</span>
                    </td>
                    <td className="at-tdRight">
                      <button
                        type="button"
                        onClick={() => handleDelete(m._id)}
                        className="at-linkDanger"
                      >
                        Fshi
                      </button>
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
