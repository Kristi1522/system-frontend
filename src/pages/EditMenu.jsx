import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./EditMenu.css";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function EditMenu() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);

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

        const list = Array.isArray(res.data) ? res.data : [];
        // ruajme edhe versionin origjinal per "dirty" check
        setDishes(list.map((d) => ({ ...d, __orig: { name: d.name, description: d.description, price: d.price } })));
      } catch (err) {
        console.error("Error fetching dishes:", err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [token]);

  const patchDish = (id, patch) => {
    setDishes((prev) => prev.map((d) => (d._id === id ? { ...d, ...patch } : d)));
  };

  const isDirty = (dish) => {
    const o = dish.__orig || {};
    return (
      String(dish.name ?? "") !== String(o.name ?? "") ||
      String(dish.description ?? "") !== String(o.description ?? "") ||
      String(dish.price ?? "") !== String(o.price ?? "")
    );
  };

  const handleUpdate = async (id, dish) => {
    try {
      setSavingId(id);
      await axios.put(
        `${API_URL}/dishes/${id}`,
        { name: dish.name, description: dish.description, price: dish.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update orig => tani konsiderohet e ruajtur
      setDishes((prev) =>
        prev.map((d) =>
          d._id === id
            ? { ...d, __orig: { name: d.name, description: d.description, price: d.price } }
            : d
        )
      );

      alert("✅ Dish updated successfully!");
    } catch (err) {
      console.error("Error updating dish:", err?.message || err);
      alert("Error updating dish.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="em-page">
      <div className="em-shell">
        <header className="em-head">
          <div className="em-badge">Admin • Menu</div>
          <div className="em-headRow">
            <div>
              <h2 className="em-title">Edit Menu</h2>
              <p className="em-subtitle">Ndrysho emrin, pershkrimin dhe cmimin. Ruaj me “Save”.</p>
            </div>
            <div className="em-meta">
              <span className={`em-pill ${loading ? "is-loading" : ""}`}>
                {loading ? "Loading..." : `${dishes.length} dishes`}
              </span>
            </div>
          </div>
        </header>

        {!token ? (
          <div className="em-empty">
            <div className="em-emptyTitle">Duhet login</div>
            <div className="em-emptySub">Token mungon, s’mund te editohen pjatat.</div>
          </div>
        ) : loading ? (
          <div className="em-empty">
            <div className="em-emptyTitle">Duke ngarkuar...</div>
            <div className="em-emptySub">Po marrim listen e pjatave.</div>
          </div>
        ) : dishes.length === 0 ? (
          <div className="em-empty">
            <div className="em-emptyTitle">Nuk ka pjata</div>
            <div className="em-emptySub">Menuja eshte bosh.</div>
          </div>
        ) : (
          <div className="em-grid">
            {dishes.map((dish) => {
              const dirty = isDirty(dish);
              const saving = savingId === dish._id;

              return (
                <div key={dish._id} className={`em-card ${dirty ? "is-dirty" : ""}`}>
                  <div className="em-cardTop">
                    <div className="em-cardTitleRow">
                      <div className="em-cardTitle">{dish.name || "Unnamed dish"}</div>
                      {dirty ? <span className="em-dot" title="Ka ndryshime te paruajtura" /> : null}
                    </div>
                    <div className="em-cardSub">
                      ID: <span className="em-mono">{dish._id}</span>
                    </div>
                  </div>

                  <label className="em-field">
                    <span className="em-label">Dish Name</span>
                    <input
                      className="em-input"
                      value={dish.name || ""}
                      onChange={(e) => patchDish(dish._id, { name: e.target.value })}
                      placeholder="Dish Name"
                    />
                  </label>

                  <label className="em-field">
                    <span className="em-label">Description</span>
                    <textarea
                      className="em-textarea"
                      value={dish.description || ""}
                      onChange={(e) => patchDish(dish._id, { description: e.target.value })}
                      placeholder="Description"
                      rows={3}
                    />
                  </label>

                  <label className="em-field">
                    <span className="em-label">Price</span>
                    <input
                      className="em-input"
                      type="number"
                      value={dish.price ?? ""}
                      onChange={(e) => patchDish(dish._id, { price: e.target.value })}
                      placeholder="Price"
                    />
                  </label>

                  <button
                    type="button"
                    className="em-btn"
                    onClick={() => handleUpdate(dish._id, dish)}
                    disabled={!dirty || saving}
                    title={!dirty ? "Ska ndryshime per t’u ruajtur" : "Ruaj ndryshimet"}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                    <span className="em-btnGlow" aria-hidden="true" />
                  </button>

                  <div className="em-hint">
                    {dirty ? "Ke ndryshime te paruajtura." : "E ruajtur."}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
