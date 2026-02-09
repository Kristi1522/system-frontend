import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./MyOrders.css";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  const token = useMemo(() => {
    const t = localStorage.getItem("token");
    if (t) return t;
    const raw = localStorage.getItem("user");
    const u = raw ? JSON.parse(raw) : null;
    return u?.token || "";
  }, []);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = Array.isArray(res.data) ? res.data : [];

      // vetem sot (nga ora 00:00)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filtered = list.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= today;
      });

      setOrders(filtered);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter((o) => !o.shiftClosed);

  const totalRevenue = activeOrders.reduce(
    (sum, order) => sum + (Number(order.totalPrice) || 0),
    0
  );

  const handleEndShiftAndPrint = async () => {
    if (!token) return;
    if (activeOrders.length === 0) return;

    setClosing(true);

    // print summary (vetem active)
    const printWindow = window.open("", "_blank");
    const now = new Date();

    const rowsHtml = activeOrders
      .map((order, index) => {
        const email = order.user?.email || "Unknown";
        const total = Number(order.totalPrice || 0).toFixed(2);
        const t = new Date(order.createdAt).toLocaleTimeString();
        return `<div style="margin:6px 0;">Invoice #${index + 1}: ${email} – ${total}€ (${t})</div>`;
      })
      .join("");

    printWindow.document.write(`
      <div style="font-family: Arial, sans-serif; padding: 16px;">
        <h2 style="margin:0 0 8px;">🧾 Shift Summary</h2>
        <div style="color:#555; margin-bottom:10px;">
          <div><strong>Date:</strong> ${now.toLocaleDateString()}</div>
          <div><strong>Time:</strong> ${now.toLocaleTimeString()}</div>
        </div>
        <hr />
        ${rowsHtml}
        <hr />
        <p><strong>Total Revenue:</strong> ${totalRevenue.toFixed(2)}€</p>
        <p><strong>Number of Orders:</strong> ${activeOrders.length}</p>
      </div>
    `);
    printWindow.document.close();
    printWindow.print();

    try {
      await axios.put(
        `${API_URL}/orders/close-shift`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Shift closed successfully!");
      fetchOrders();
    } catch (err) {
      console.error("Error closing shift:", err);
      alert("Error closing the shift!");
    } finally {
      setClosing(false);
    }
  };

  const statusBadge = (closed) =>
    closed ? "mo-badge mo-closed" : "mo-badge mo-active";

  return (
    <div className="mo-page">
      <div className="mo-shell">
        <header className="mo-head">
          <div className="mo-badgeTop">Waiter • Orders</div>

          <div className="mo-headRow">
            <div>
              <h2 className="mo-title">Today's Orders</h2>
              <p className="mo-subtitle">Shfaqen vetem porosite e sotme. Mbyll turnin dhe printo summary.</p>
            </div>

            <button
              type="button"
              className="mo-btnGhost"
              onClick={fetchOrders}
              disabled={loading || !token}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </header>

        {!token ? (
          <div className="mo-empty">
            <div className="mo-emptyTitle">Duhet login</div>
            <div className="mo-emptySub">Token mungon, s’mund te lexohen porosite.</div>
          </div>
        ) : loading ? (
          <div className="mo-empty">
            <div className="mo-emptyTitle">Duke ngarkuar...</div>
            <div className="mo-emptySub">Po marrim porosite e sotme.</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="mo-empty">
            <div className="mo-emptyTitle">Nuk ka porosi sot</div>
            <div className="mo-emptySub">Sapo te krijosh porosi, do shfaqet ketu.</div>
          </div>
        ) : (
          <>
            <section className="mo-card">
              <div className="mo-cardHead">
                <h3 className="mo-cardTitle">Orders</h3>
                <span className="mo-pill">
                  {activeOrders.length} active • {orders.length} total
                </span>
              </div>

              <div className="mo-tableWrap">
                <table className="mo-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Total (€)</th>
                      <th>Date and Time</th>
                      <th className="mo-thRight">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="mo-tdStrong">{order.user?.email || "Unknown"}</td>
                        <td className="mo-tdStrong">{Number(order.totalPrice || 0).toFixed(2)}€</td>
                        <td className="mo-tdMuted">{new Date(order.createdAt).toLocaleString()}</td>
                        <td className="mo-tdRight">
                          <span className={statusBadge(order.shiftClosed)}>
                            {order.shiftClosed ? "Closed" : "Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mo-totalCard">
              <div className="mo-totalLabel">Total Revenue Today (Active Only)</div>
              <div className="mo-totalValue">{totalRevenue.toFixed(2)}€</div>
              <div className="mo-totalHint">
                Vetem porosite aktive llogariten per mbylljen e turnit.
              </div>
            </section>

            <div className="mo-actions">
              <button
                type="button"
                onClick={handleEndShiftAndPrint}
                disabled={totalRevenue === 0 || closing}
                className="mo-btnDanger"
                title={totalRevenue === 0 ? "Ska te ardhura aktive sot" : "Mbyll turnin dhe printo"}
              >
                {closing ? "Closing..." : "End Shift and Print Summary"}
                <span className="mo-btnGlow" aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
