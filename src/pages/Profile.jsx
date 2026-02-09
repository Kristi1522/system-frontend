/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function Profile() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = useMemo(() => {
    const raw = localStorage.getItem("user");
    const u = raw ? JSON.parse(raw) : null;
    return u?.token || localStorage.getItem("token") || "";
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setData({ message: "Missing token" });
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data || {});
      } catch (err) {
        setData({ message: "Invalid or expired token" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <div className="pr-page">
      <div className="pr-shell">
        <div className="pr-card">
          <div className="pr-head">
            <div className="pr-badge">Account</div>
            <h2 className="pr-title">Profile</h2>
            <p className="pr-subtitle">Te dhenat e llogarise tende.</p>
          </div>

          {loading ? (
            <div className="pr-loading">
              <div className="pr-spinner" aria-hidden="true" />
              <div>
                <div className="pr-loadingTitle">Loading...</div>
                <div className="pr-loadingSub">Po marrim te dhenat nga serveri.</div>
              </div>
            </div>
          ) : (
            <>
              {data.message ? (
                <div className="pr-alert pr-alertBad" role="alert">
                  <div className="pr-alertTitle">Error</div>
                  <div className="pr-alertMsg">{data.message}</div>
                </div>
              ) : (
                <div className="pr-info">
                  <div className="pr-row">
                    <div className="pr-k">Email</div>
                    <div className="pr-v">{data.email || "-"}</div>
                  </div>

                  {data.role ? (
                    <div className="pr-row">
                      <div className="pr-k">Role</div>
                      <div className="pr-v">{data.role}</div>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="pr-actions">
                <button type="button" className="pr-btnGhost" onClick={() => navigate(-1)}>
                  Back
                </button>

                <button
                  type="button"
                  className="pr-btn"
                  onClick={() => navigate("/orders")}
                >
                  Go to Orders
                  <span className="pr-btnGlow" aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
