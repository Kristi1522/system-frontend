import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("token", res.data.token);
        setUser(res.data);

        if (res.data.role === "admin") navigate("/admin");
        else navigate("/orders");
      } else {
        setErrMsg("Incorrect login!");
      }
    } catch (err) {
      console.error("Error during login:", err.response?.data || err.message);
      setErrMsg("Incorrect email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg-page">
      <div className="lg-shell">
        <div className="lg-card">
          <div className="lg-head">
            <div className="lg-badge">Secure Access</div>
            <h2 className="lg-title">Login</h2>
            <p className="lg-subtitle">Shkruaj kredencialet per te vazhduar.</p>
          </div>

          {errMsg ? (
            <div className="lg-error" role="alert">
              <div className="lg-errorTitle">Gabim</div>
              <div className="lg-errorMsg">{errMsg}</div>
            </div>
          ) : null}

          <form className="lg-form" onSubmit={handleSubmit}>
            <label className="lg-field">
              <span className="lg-label">Email</span>
              <input
                className="lg-input"
                type="email"
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </label>

            <label className="lg-field">
              <span className="lg-label">Password</span>
              <input
                className="lg-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>

            <button type="submit" className="lg-btn" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
              <span className="lg-btnGlow" aria-hidden="true" />
            </button>
          </form>

          <div className="lg-foot">
            <span className="lg-footText">Tip:</span>
            <span className="lg-footSub">Per admin do te ridrejtohesh te /admin.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
