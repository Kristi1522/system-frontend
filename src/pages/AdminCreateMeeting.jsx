import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./AdminCreateMeeting.css";

export default function AdminCreateMeeting() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [topic, setTopic] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      alert("❌ Duhet te jesh i loguar (token mungon).");
      return;
    }
    if (!userId || !date || !hour || !topic.trim()) {
      alert("❌ Ploteso te gjitha fushat.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        `${API_URL}/api/meetings/by-admin`,
        { userId, date, hour, topic: topic.trim() },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert("✅ Takimi u krijua me sukses!");
      setUserId("");
      setDate("");
      setHour("");
      setTopic("");
    } catch (err) {
      console.error("❌ Gabim gjate krijimit te takimit:", err);
      alert("Gabim gjate krijimit te takimit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="am-page">
      <div className="am-shell">
        <header className="am-head">
          <div className="am-badge">Admin • Meetings</div>
          <h2 className="am-title">Shto Takim</h2>
          <p className="am-subtitle">
            Zgjidh perdoruesin dhe cakto daten/oren me nje teme te shkurter.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="am-card">
          <div className="am-grid">
            <label className="am-field">
              <span className="am-label">Perdoruesi</span>
              <div className="am-selectWrap">
                <select
                  className="am-select"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  disabled={loadingUsers || !user?.token}
                >
                  <option value="">
                    {loadingUsers ? "Duke ngarkuar..." : "-- Zgjidh perdoruesin --"}
                  </option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.email}
                    </option>
                  ))}
                </select>
                <span className="am-selectIcon" aria-hidden="true">▾</span>
              </div>

              {!user?.token ? (
                <span className="am-help am-help--warn">Duhet login per te pare perdoruesit.</span>
              ) : null}
            </label>

            <label className="am-field">
              <span className="am-label">Data</span>
              <input
                type="date"
                className="am-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>

            <label className="am-field">
              <span className="am-label">Ora</span>
              <input
                type="time"
                className="am-input"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                required
              />
            </label>

            <label className="am-field am-field--full">
              <span className="am-label">Tema</span>
              <input
                type="text"
                className="am-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Shembull: Mbledhje mujore"
                required
              />
            </label>
          </div>

          <button className="am-btn" type="submit" disabled={submitting || !user?.token}>
            {submitting ? "Duke krijuar..." : "Krijo Takim"}
            <span className="am-btnGlow" aria-hidden="true" />
          </button>

          <p className="am-hint">
            Sugjerim: perdor teme te shkurter (5–7 fjale) qe te duket bukur ne liste.
          </p>
        </form>
      </div>
    </div>
  );
}
