import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Orders.css";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function Orders() {
  const [dishes, setDishes] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const token = useMemo(() => {
    const raw = localStorage.getItem("user");
    const u = raw ? JSON.parse(raw) : null;
    return u?.token || localStorage.getItem("token") || "";
  }, []);

  useEffect(() => {
    const fetchDishes = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/dishes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDishes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching dishes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [token]);

  const addToOrder = (dish) => {
    setOrderItems((prev) => {
      const exists = prev.find((x) => x.dishId === dish._id);
      if (exists) {
        return prev.map((x) =>
          x.dishId === dish._id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }
      return [...prev, { dishId: dish._id, quantity: 1 }];
    });
  };

  const inc = (dishId) => {
    setOrderItems((prev) =>
      prev.map((x) => (x.dishId === dishId ? { ...x, quantity: x.quantity + 1 } : x))
    );
  };

  const dec = (dishId) => {
    setOrderItems((prev) =>
      prev
        .map((x) => (x.dishId === dishId ? { ...x, quantity: x.quantity - 1 } : x))
        .filter((x) => x.quantity > 0)
    );
  };

  const removeItem = (dishId) => {
    setOrderItems((prev) => prev.filter((x) => x.dishId !== dishId));
  };

  const getDish = (dishId) => dishes.find((d) => d._id === dishId);

  const totalPrice = orderItems.reduce((sum, item) => {
    const dish = getDish(item.dishId);
    return sum + (Number(dish?.price) || 0) * item.quantity;
  }, 0);

  const totalCount = orderItems.reduce((s, x) => s + x.quantity, 0);

  const submitAndPrintOrder = async () => {
    if (!token) return;
    if (orderItems.length === 0) return;

    try {
      setSubmitting(true);

      await axios.post(
        `${API_URL}/orders`,
        { items: orderItems, totalPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Print
      const printWindow = window.open("", "_blank");
      const now = new Date();

      const rowsHtml = orderItems
        .map((item) => {
          const dish = getDish(item.dishId);
          const name = dish?.name || "Unknown Name";
          const price = Number(dish?.price || 0);
          const line = (price * item.quantity).toFixed(2);
          return `<div style="display:flex;justify-content:space-between;gap:12px;margin:6px 0;">
              <div>${name} x ${item.quantity}</div>
              <div>${line}€</div>
            </div>`;
        })
        .join("");

      printWindow.document.write(`
        <div style="font-family: Arial, sans-serif; padding: 16px; max-width: 420px; margin: 0 auto;">
          <h2 style="margin:0 0 8px;">🧾 Order Receipt</h2>
          <div style="color:#555; margin-bottom:10px;">
            <div><strong>Date:</strong> ${now.toLocaleDateString()}</div>
            <div><strong>Time:</strong> ${now.toLocaleTimeString()}</div>
          </div>
          <hr />
          ${rowsHtml}
          <hr />
          <div style="display:flex;justify-content:space-between;font-weight:700;">
            <div>Total</div>
            <div>${totalPrice.toFixed(2)}€</div>
          </div>
        </div>
      `);
      printWindow.document.close();
      printWindow.print();

      alert("✅ Order submitted successfully!");
      setOrderItems([]);
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("Error submitting order.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDishes = dishes.filter((d) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      String(d?.name || "").toLowerCase().includes(s) ||
      String(d?.description || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="or-page">
      <div className="or-shell">
        <header className="or-head">
          <div className="or-badge">Waiter • Orders</div>

          <div className="or-headRow">
            <div>
              <h2 className="or-title">Create Order</h2>
              <p className="or-subtitle">Zgjidh pjata nga menuja dhe printo faturen.</p>
            </div>

            <div className="or-search">
              <label className="or-label" htmlFor="q">Search</label>
              <input
                id="q"
                className="or-input"
                placeholder="Kerko pjate..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
        </header>

        {!token ? (
          <div className="or-empty">
            <div className="or-emptyTitle">Duhet login</div>
            <div className="or-emptySub">Token mungon, s’mund te shfaqet menuja.</div>
          </div>
        ) : (
          <div className="or-layout">
            {/* MENU */}
            <section className="or-card">
              <div className="or-cardHead">
                <h3 className="or-cardTitle">Menu</h3>
                <span className="or-pill">
                  {loading ? "Loading..." : `${filteredDishes.length} dishes`}
                </span>
              </div>

              {loading ? (
                <div className="or-empty or-empty--inCard">
                  <div className="or-emptyTitle">Duke ngarkuar...</div>
                  <div className="or-emptySub">Po marrim pjatat.</div>
                </div>
              ) : filteredDishes.length === 0 ? (
                <div className="or-empty or-empty--inCard">
                  <div className="or-emptyTitle">S’ka rezultate</div>
                  <div className="or-emptySub">Provo nje kerkese tjeter.</div>
                </div>
              ) : (
                <div className="or-grid">
                  {filteredDishes.map((dish) => (
                    <div key={dish._id} className="or-item">
                      <div className="or-itemTop">
                        <div className="or-name" title={dish.name}>{dish.name}</div>
                        <div className="or-price">{Number(dish.price || 0).toFixed(2)}€</div>
                      </div>

                      {dish.description ? (
                        <div className="or-desc" title={dish.description}>
                          {dish.description}
                        </div>
                      ) : (
                        <div className="or-desc or-desc--empty">No description</div>
                      )}

                      <button type="button" className="or-btn" onClick={() => addToOrder(dish)}>
                        Add
                        <span className="or-btnGlow" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* CURRENT ORDER */}
            <aside className="or-side">
              <div className="or-sideCard">
                <div className="or-sideHead">
                  <div>
                    <div className="or-sideTitle">Current Order</div>
                    <div className="or-sideSub">{totalCount} items</div>
                  </div>
                  <div className="or-total">
                    <div className="or-totalLabel">Total</div>
                    <div className="or-totalValue">{totalPrice.toFixed(2)}€</div>
                  </div>
                </div>

                {orderItems.length === 0 ? (
                  <div className="or-empty or-empty--inCard">
                    <div className="or-emptyTitle">No items selected</div>
                    <div className="or-emptySub">Shto pjata nga menuja.</div>
                  </div>
                ) : (
                  <div className="or-lines">
                    {orderItems.map((item) => {
                      const dish = getDish(item.dishId);
                      const name = dish?.name || "Unknown";
                      const unit = Number(dish?.price || 0);
                      const line = unit * item.quantity;

                      return (
                        <div key={item.dishId} className="or-line">
                          <div className="or-lineMain">
                            <div className="or-lineName" title={name}>{name}</div>
                            <div className="or-linePrice">{line.toFixed(2)}€</div>
                          </div>

                          <div className="or-lineBottom">
                            <div className="or-qty">
                              <button type="button" className="or-qtyBtn" onClick={() => dec(item.dishId)}>-</button>
                              <div className="or-qtyNum">{item.quantity}</div>
                              <button type="button" className="or-qtyBtn" onClick={() => inc(item.dishId)}>+</button>
                            </div>

                            <button type="button" className="or-remove" onClick={() => removeItem(item.dishId)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  type="button"
                  className="or-submit"
                  onClick={submitAndPrintOrder}
                  disabled={orderItems.length === 0 || submitting}
                  title={orderItems.length === 0 ? "S’ka items" : "Dergo dhe printo"}
                >
                  {submitting ? "Submitting..." : "Submit and Print Invoice"}
                  <span className="or-submitGlow" aria-hidden="true" />
                </button>

                <div className="or-hint">
                  Printimi hap nje dritare te re. Sigurohu qe browseri s’e bllokon pop-up.
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
