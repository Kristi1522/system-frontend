import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./deleteDish.css";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function DeleteDish() {
  const [dishes, setDishes] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const token = useMemo(() => {
    const t = localStorage.getItem("token");
    if (t) return t;
    const raw = localStorage.getItem("user");
    const u = raw ? JSON.parse(raw) : null;
    return u?.token || "";
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
        console.error("Error fetching dishes:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;

    try {
      await axios.delete(`${API_URL}/dishes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDishes((prev) => prev.filter((dish) => dish._id !== id));
      alert("✅ Dish deleted successfully!");
    } catch (err) {
      console.error("Error deleting the dish:", err?.message || err);
      alert("Error deleting the dish.");
    }
  };

  const filtered = dishes.filter((d) => {
    const name = String(d?.name || "").toLowerCase();
    return name.includes(q.trim().toLowerCase());
  });

  return (
    <div className="dd-page">
      <div className="dd-shell">
        <header className="dd-head">
          <div className="dd-badge">Admin • Menu</div>

          <div className="dd-headRow">
            <div>
              <h2 className="dd-title">Delete Dishes</h2>
              <p className="dd-subtitle">Zgjidh nje pjate dhe fshije nga menuja.</p>
            </div>

            <div className="dd-search">
              <label className="dd-label" htmlFor="q">Search</label>
              <input
                id="q"
                className="dd-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Kerko me emer..."
                autoComplete="off"
              />
            </div>
          </div>
        </header>

        {!token ? (
          <div className="dd-empty">
            <div className="dd-emptyTitle">Duhet login</div>
            <div className="dd-emptySub">Token mungon, s’mund te lexohen pjatat.</div>
          </div>
        ) : loading ? (
          <div className="dd-empty">
            <div className="dd-emptyTitle">Duke ngarkuar...</div>
            <div className="dd-emptySub">Po marrim listen e pjatave.</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="dd-empty">
            <div className="dd-emptyTitle">Nuk ka pjata</div>
            <div className="dd-emptySub">Nuk u gjet asgje per kerkimin aktual.</div>
          </div>
        ) : (
          <div className="dd-list">
            {filtered.map((dish) => (
              <div key={dish._id} className="dd-item">
                <div className="dd-left">
                  <div className="dd-name">{dish.name}</div>
                  <div className="dd-meta">
                    <span className="dd-price">{dish.price}€</span>
                    {dish.description ? (
                      <span className="dd-desc">{dish.description}</span>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  className="dd-danger"
                  onClick={() => handleDelete(dish._id)}
                >
                  Delete
                  <span className="dd-dangerGlow" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
