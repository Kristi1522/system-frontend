import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", password: "" });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const token = useMemo(() => {
    // tek disa file e ruan tokenin si "token", tek disa si user.token
    // ketu po ruajme fallback te dyja.
    const t = localStorage.getItem("token");
    if (t) return t;
    const raw = localStorage.getItem("user");
    const u = raw ? JSON.parse(raw) : null;
    return u?.token || "";
  }, []);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      setLoadingUsers(true);
      const res = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const promoteUser = async (id) => {
    try {
      await axios.put(
        `${API_URL}/auth/promote/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error promoting user:", err);
      alert("Error promoting user.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/auth/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error deleting user.");
    }
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((p) => ({ ...p, [name]: value }));
  };

  const handleNewUserSubmit = async () => {
    if (!newUser.email || !newUser.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${API_URL}/auth/register`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ User successfully registered!");
      setNewUser({ email: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error("Error registering user:", err);
      alert("Error registering user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ap-page">
      <div className="ap-shell">
        <header className="ap-head">
          <div className="ap-badge">Admin • Users</div>
          <h2 className="ap-title">Admin Panel</h2>
          <p className="ap-subtitle">Regjistro perdorues, jep role, menaxho listen.</p>
        </header>

        {!token ? (
          <div className="ap-empty">
            <div className="ap-emptyTitle">Duhet login</div>
            <div className="ap-emptySub">Token mungon, s’mund te hapet paneli.</div>
          </div>
        ) : (
          <>
            <section className="ap-card">
              <div className="ap-cardHead">
                <div>
                  <h3 className="ap-cardTitle">Add New User</h3>
                  <p className="ap-cardDesc">Krijo nje user te ri (email + password).</p>
                </div>
                <span className={`ap-pill ${submitting ? "is-loading" : ""}`}>
                  {submitting ? "Saving..." : "Ready"}
                </span>
              </div>

              <div className="ap-form">
                <label className="ap-field">
                  <span className="ap-label">Email</span>
                  <input
                    className="ap-input"
                    type="email"
                    name="email"
                    placeholder="email@domain.com"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    autoComplete="off"
                  />
                </label>

                <label className="ap-field">
                  <span className="ap-label">Password</span>
                  <input
                    className="ap-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    autoComplete="new-password"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleNewUserSubmit}
                  className="ap-btn"
                  disabled={submitting}
                >
                  {submitting ? "Adding..." : "Add User"}
                  <span className="ap-btnGlow" aria-hidden="true" />
                </button>
              </div>
            </section>

            <section className="ap-card ap-card--table">
              <div className="ap-cardHead">
                <div>
                  <h3 className="ap-cardTitle">Users List</h3>
                  <p className="ap-cardDesc">
                    {loadingUsers ? "Duke ngarkuar..." : `${users.length} users`}
                  </p>
                </div>
                <button type="button" className="ap-btnGhost" onClick={fetchUsers} disabled={loadingUsers}>
                  Refresh
                </button>
              </div>

              {users.length === 0 ? (
                <div className="ap-empty ap-empty--inCard">
                  <div className="ap-emptyTitle">Nuk ka users</div>
                  <div className="ap-emptySub">Kur te shtohen, do shfaqen ketu.</div>
                </div>
              ) : (
                <div className="ap-tableWrap">
                  <table className="ap-table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th className="ap-thRight">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td className="ap-tdStrong">{u.email}</td>
                          <td>
                            <span className={`ap-role ${String(u.role).toLowerCase() === "admin" ? "is-admin" : ""}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="ap-tdRight">
                            {u.role !== "admin" ? (
                              <div className="ap-actions">
                                <button
                                  type="button"
                                  onClick={() => promoteUser(u._id)}
                                  className="ap-btnSmall ap-btnSmall--warn"
                                >
                                  Promote
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteUser(u._id)}
                                  className="ap-btnSmall ap-btnSmall--danger"
                                >
                                  Delete
                                </button>
                              </div>
                            ) : (
                              <span className="ap-muted">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <div className="ap-footer">
              <button
                type="button"
                className="ap-btnGhost"
                onClick={() => navigate("/admin/dashboard")}
              >
                Go to Dashboard →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
