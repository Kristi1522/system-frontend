import { useMemo, useState } from "react";
import axios from "axios";
import "./registerUser.css";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function RegisterUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" }); // type: ok | bad

  const token = useMemo(() => {
    const raw = localStorage.getItem("user");
    const u = raw ? JSON.parse(raw) : null;
    return u?.token || localStorage.getItem("token") || "";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!token) {
      setMsg({ type: "bad", text: "Missing token (login required)." });
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API_URL}/auth/register`,
        { email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg({ type: "ok", text: "User registered successfully!" });
      setEmail("");
      setPassword("");
      setRole("employee");
    } catch (err) {
      console.error("Error during registration:", err.response?.data || err.message);
      setMsg({ type: "bad", text: "Error during registration." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ru-page">
      <div className="ru-shell">
        <div className="ru-card">
          <div className="ru-head">
            <div className="ru-badge">Admin • Users</div>
            <h2 className="ru-title">Register New User</h2>
            <p className="ru-subtitle">Krijo nje user te ri (employee ose admin).</p>
          </div>

          {msg.text ? (
            <div
              className={`ru-alert ${msg.type === "ok" ? "ru-ok" : "ru-bad"}`}
              role="alert"
            >
              <div className="ru-alertTitle">
                {msg.type === "ok" ? "Success" : "Error"}
              </div>
              <div className="ru-alertMsg">{msg.text}</div>
            </div>
          ) : null}

          <form className="ru-form" onSubmit={handleSubmit}>
            <label className="ru-field">
              <span className="ru-label">Email</span>
              <input
                className="ru-input"
                type="email"
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>

            <label className="ru-field">
              <span className="ru-label">Password</span>
              <input
                className="ru-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </label>

            <label className="ru-field">
              <span className="ru-label">Role</span>
              <select
                className="ru-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <button type="submit" className="ru-btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
              <span className="ru-btnGlow" aria-hidden="true" />
            </button>

            <div className="ru-hint">
              Kujdes: vetem admin mund te regjistroje user-a te rinj.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
