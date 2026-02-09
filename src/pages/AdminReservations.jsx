import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./AdminReservations.css";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReservations = async () => {
    if (!user?.token) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/reservations`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReservations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gabim gjate marrjes se rezervimeve:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt qe do ta fshish kete rezervim?")) return;

    try {
      await axios.delete(`${API_URL}/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setReservations((prev) => prev.filter((r) => r._id !== id));
      alert("✅ Rezervimi u fshi me sukses.");
    } catch (err) {
      console.error("Gabim gjate fshirjes:", err);
      alert("Gabim gjate fshirjes se rezervimit.");
    }
  };

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
          <div className="at-badgeTop">Admin • Reservations</div>

          <div className="at-headRow">
            <h2 className="at-title">Te gjitha rezervimet</h2>

            <div className="at-headActions">
              <button
                type="button"
                className="at-btnGhost"
                onClick={fetchReservations}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          <p className="at-subtitle">Menaxho rezervimet (shfaq, kontrollo, fshi).</p>
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
            <div className="at-emptyTitle">Nuk ka rezervime</div>
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
                  <th>Persona</th>
                  <th>Statusi</th>
                  <th className="at-thRight">Veprim</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((r) => (
                  <tr key={r._id}>
                    <td className="at-tdStrong">{r.user?.name || "Anonim"}</td>
                    <td className="at-tdMuted">{r.user?.email || "-"}</td>
                    <td className="at-tdMuted">
                      {r.date ? new Date(r.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="at-tdMuted">{r.time || "-"}</td>
                    <td className="at-tdStrong">{r.peopleCount ?? "-"}</td>
                    <td>
                      <span className={statusClass(r.status)}>{r.status || "N/A"}</span>
                    </td>
                    <td className="at-tdRight">
                      <button
                        type="button"
                        onClick={() => handleDelete(r._id)}
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
