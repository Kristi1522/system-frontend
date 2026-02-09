import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  LogOut,
  Pencil,
  Trash2,
  UserPlus,
  PlusSquare,
  CalendarDays,
  CalendarPlus,
} from "lucide-react";
import axios from "axios";
import "./AdminDashboard.css";

const API_URL = "https://system-backend-0i7a.onrender.com";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Orders", icon: FileText, path: "/orders" },
  { name: "Reports", icon: BarChart2, path: "/reports" },
];

const actions = [
  { name: "Add Dish", icon: PlusSquare, path: "/add-dish" },
  { name: "Edit Menu", icon: Pencil, path: "/edit-menu" },
  { name: "Delete Dish", icon: Trash2, path: "/delete-dish" },
  { name: "Register User", icon: UserPlus, path: "/register-user" },
  { name: "Daily Summary", icon: CalendarDays, path: "/daily-summary" },
  { name: "Create Reservation", icon: CalendarPlus, path: "/admin-create-reservation" },
];

export default function AdminDashboard() {
  const [selected, setSelected] = useState("Dashboard");
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalOrders: 0,
    orders: [],
  });
  const [expandedUsers, setExpandedUsers] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const token = useMemo(() => {
    // ne kodin tend ke localStorage.getItem("token")
    // nese projekti ruan user si JSON, do e rregullojme kur te me nisesh auth flow.
    return localStorage.getItem("token") || "";
  }, []);

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/orders/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (email) => {
    setExpandedUsers((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  const handleDeleteOrder = async (orderId) => {
    const ok = window.confirm("Are you sure you want to delete this order?");
    if (!ok) return;

    try {
      await axios.delete(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSummary((prev) => {
        const newOrders = prev.orders.filter((o) => o._id !== orderId);
        return { ...prev, orders: newOrders, totalOrders: newOrders.length };
      });

      alert("✅ Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting the order:", err?.message || err);
      alert("Error deleting the order.");
    }
  };

  const ordersByUser = (summary.orders || []).reduce((acc, order) => {
    const key = order.userEmail || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {});

  const onMenuClick = (item) => {
    setSelected(item.name);
    navigate(item.path);
  };

  const onLogout = () => {
    // s’e di auth flow tendin. Ky eshte default i paster.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="ad-layout">
      <aside className="ad-side">
        <div className="ad-brand">
          <div className="ad-logo" aria-hidden="true">R</div>
          <div className="ad-brandText">
            <div className="ad-brandTitle">Restorant Admin</div>
            <div className="ad-brandSub">Control Panel</div>
          </div>
        </div>

        <nav className="ad-nav">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = selected === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => onMenuClick(item)}
                className={`ad-navItem ${active ? "is-active" : ""}`}
              >
                <span className="ad-navIcon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <span className="ad-navLabel">{item.name}</span>
                <span className="ad-navDot" aria-hidden="true" />
              </button>
            );
          })}
        </nav>

        <div className="ad-sideFooter">
          <button type="button" className="ad-logout" onClick={onLogout}>
            <LogOut size={16} />
            <span>Log out</span>
          </button>
          <div className="ad-footNote">v1 • UI clean</div>
        </div>
      </aside>

      <main className="ad-main">
        <header className="ad-topbar">
          <div>
            <h2 className="ad-title">{selected}</h2>
            <p className="ad-subtitle">
              {selected === "Dashboard"
                ? "Overview i shpejte i biznesit."
                : selected === "Orders"
                ? "Porosite te grupuara sipas perdoruesit."
                : "Raporte dhe analiza."}
            </p>
          </div>

          <div className="ad-topbarActions">
            <button type="button" className="ad-btnGhost" onClick={fetchSummary}>
              Refresh
            </button>
            <span className={`ad-pill ${loading ? "is-loading" : ""}`}>
              {loading ? "Loading..." : "Live"}
            </span>
          </div>
        </header>

        {selected === "Dashboard" && (
          <>
            <section className="ad-grid2">
              <div className="ad-card ad-card--stat">
                <div className="ad-statLabel">Total Income</div>
                <div className="ad-statValue">{summary.totalIncome}€</div>
                <div className="ad-statHint">Te ardhura totale</div>
              </div>

              <div className="ad-card ad-card--stat">
                <div className="ad-statLabel">Total Orders</div>
                <div className="ad-statValue">{summary.totalOrders}</div>
                <div className="ad-statHint">Porosi gjithsej</div>
              </div>
            </section>

            <section className="ad-card ad-card--actions">
              <div className="ad-cardHead">
                <h3 className="ad-cardTitle">Menu Management</h3>
                <p className="ad-cardDesc">Veprime te shpejta per menaxhim.</p>
              </div>

              <div className="ad-actions">
                {actions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <Link key={a.name} to={a.path} className="ad-action">
                      <span className="ad-actionIcon" aria-hidden="true">
                        <Icon size={18} />
                      </span>
                      <span className="ad-actionText">{a.name}</span>
                      <span className="ad-actionArrow" aria-hidden="true">→</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {selected === "Orders" && (
          <section className="ad-orders">
            <div className="ad-ordersHead">
              <h3 className="ad-cardTitle">Orders by Waiters</h3>
              <p className="ad-cardDesc">
                Kliko Show per te pare tabelen e porosive per secilin.
              </p>
            </div>

            <div className="ad-ordersList">
              {Object.keys(ordersByUser).length === 0 ? (
                <div className="ad-empty">
                  <div className="ad-emptyTitle">Nuk ka porosi</div>
                  <div className="ad-emptySub">Kur te kete, do shfaqen ketu.</div>
                </div>
              ) : (
                Object.keys(ordersByUser).map((email) => (
                  <div key={email} className="ad-orderCard">
                    <div className="ad-orderCardTop">
                      <div className="ad-user">
                        <div className="ad-userAvatar" aria-hidden="true">
                          {String(email).slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="ad-userTitle">{email}</div>
                          <div className="ad-userMeta">
                            {ordersByUser[email].length} orders
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ad-btn"
                        onClick={() => toggleExpand(email)}
                      >
                        {expandedUsers[email] ? "Hide" : "Show"}
                        <span className="ad-btnGlow" aria-hidden="true" />
                      </button>
                    </div>

                    {expandedUsers[email] && (
                      <div className="ad-tableWrap">
                        <table className="ad-table">
                          <thead>
                            <tr>
                              <th>Total</th>
                              <th>Date</th>
                              <th className="ad-thRight">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ordersByUser[email].map((order) => (
                              <tr key={order._id}>
                                <td className="ad-tdStrong">{order.total}€</td>
                                <td className="ad-tdMuted">
                                  {new Date(order.createdAt).toLocaleString()}
                                </td>
                                <td className="ad-tdRight">
                                  <button
                                    type="button"
                                    className="ad-linkDanger"
                                    onClick={() => handleDeleteOrder(order._id)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
