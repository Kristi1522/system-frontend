import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./adminForms.css";

export default function AdminCreateReservation() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    date: "",
    time: "",
    peopleCount: 1,
  });

  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.token) return;

      try {
        setLoadingUsers(true);
        const res = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Gabim gjate marrjes se perdoruesve:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "peopleCount" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      alert("❌ Duhet te jesh i loguar (token mungon).");
      return;
    }
    if (!form.userId || !form.date || !form.time || !form.peopleCount) {
      alert("❌ Ploteso te gjitha fushat.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API_URL}/api/reservations/by-admin`, form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert("✅ Rezervimi u krijua!");
      setForm({ userId: "", date: "", time: "", peopleCount: 1 });
    } catch (err) {
      console.error(err);
      alert("❌ Deshtoi krijimi i rezervimit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="af-page">
      <div className="af-shell">
        <header className="af-head">
          <div className="af-badge">Admin • Reservations</div>
          <h2 className="af-title">Shto Rezervim</h2>
          <p className="af-subtitle">
            Zgjidh perdoruesin dhe vendos daten/oren + numrin e personave.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="af-card">
          <div className="af-grid">
            <label className="af-field af-field--full">
              <span className="af-label">Perdoruesi</span>

              <div className="af-selectWrap">
                <select
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  required
                  className="af-select"
                  disabled={loadingUsers || !user?.token}
                >
                  <option value="">
                    {loadingUsers ? "Duke ngarkuar..." : "Zgjidh perdoruesin"}
                  </option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.email}
                    </option>
                  ))}
                </select>
                <span className="af-selectIcon" aria-hidden="true">
                  ▾
                </span>
              </div>

              {!user?.token ? (
                <span className="af-help af-help--warn">Duhet login per te pare perdoruesit.</span>
              ) : null}
            </label>

            <label className="af-field">
              <span className="af-label">Data</span>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="af-input"
              />
            </label>

            <label className="af-field">
              <span className="af-label">Ora</span>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                className="af-input"
              />
            </label>

            <label className="af-field af-field--full">
              <span className="af-label">Numri i personave</span>
              <input
                type="number"
                name="peopleCount"
                min="1"
                value={form.peopleCount}
                onChange={handleChange}
                required
                className="af-input"
              />
            </label>
          </div>

          <button className="af-btn" type="submit" disabled={submitting || !user?.token}>
            {submitting ? "Duke krijuar..." : "Krijo Rezervim"}
            <span className="af-btnGlow" aria-hidden="true" />
          </button>

          <p className="af-hint">Sugjerim: mos lejo rezervime me 0 persona (min 1).</p>
        </form>
      </div>
    </div>
  );
}
