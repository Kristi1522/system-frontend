import { useState } from "react";
import axios from "axios";
import "./AddDish.css";

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function AddDish() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;

    if (!user?.token) {
      alert("❌ Duhet te jesh i loguar (token mungon).");
      return;
    }
    if (!name.trim()) {
      alert("❌ Emri eshte i detyrueshem.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/dishes`,
        { name: name.trim(), price, description: description.trim() },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert("✅ Dish added successfully!");
      setName("");
      setPrice("");
      setDescription("");
    } catch (err) {
      alert("❌ Error while adding the dish");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="shell">
        <header className="head">
          <div className="badge">Menu • Admin</div>
          <h2 className="title">Add New Dish</h2>
          <p className="subtitle">Ploteso te dhenat dhe shto nje pjate te re.</p>
        </header>

        <div className="card">
          <div className="grid">
            <label className="field">
              <span className="label">Name</span>
              <input
                className="input"
                placeholder="p.sh. Pasta Carbonara"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span className="label">Price</span>
              <input
                className="input"
                type="number"
                placeholder="p.sh. 7.50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
              />
            </label>

            <label className="field field--full">
              <span className="label">Description</span>
              <input
                className="input"
                placeholder="p.sh. krem, pancete, djathe parmesan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
              />
            </label>
          </div>

          <button
            onClick={handleAdd}
            className="btn"
            disabled={loading}
            type="button"
          >
            {loading ? "Adding..." : "Add Dish"}
            <span className="btnGlow" aria-hidden="true" />
          </button>

          <p className="hint">
            Tip: mbaj pershkrimin te shkurter dhe te paster per UI me te bukur.
          </p>
        </div>
      </div>
    </div>
  );
}
