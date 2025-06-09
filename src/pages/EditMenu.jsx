// Importimi i hooks nga React dhe axios për thirrje HTTP
import { useEffect, useState } from "react";
import axios from "axios";

// URL-ja bazë e backend-it
const API_URL = "https://system-backend-0i7a.onrender.com";

// Komponenti për editimin e pjatave në menu
export default function EditMenu() {
  const [dishes, setDishes] = useState([]); // Gjendja për të ruajtur pjatat
  const token = localStorage.getItem("token"); // Merr tokenin nga localStorage për autorizim

  // useEffect që thirret vetëm një herë në ngarkim të komponentit për të marrë të dhënat
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        // Merr listën e pjatave nga API
        const res = await axios.get(`${API_URL}/dishes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDishes(res.data); // Ruaj pjatat në state
      } catch (err) {
        console.error("❌ Error fetching dishes:", err.message);
      }
    };

    fetchDishes();
  }, [token]);

  // Funksion për të përditësuar të dhënat e një pjate të caktuar
  const handleUpdate = async (id, updatedDish) => {
    try {
      // Dërgo PUT request me të dhënat e reja
      await axios.put(`${API_URL}/dishes/${id}`, updatedDish, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Dish updated successfully!");
    } catch (err) {
      console.error("❌ Error updating dish:", err.message);
      alert("Error updating dish.");
    }
  };

  // JSX për paraqitjen e formës së editimit për çdo pjatë
  return (
    <div className="min-h-screen bg-background p-6 text-textdark">
      <h2 className="text-4xl font-bold text-primary mb-8">✏️ Edit Menu</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish) => (
          <div key={dish._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
            {/* Input për emrin e pjates */}
            <input
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={dish.name}
              onChange={(e) => setDishes((prev) =>
                prev.map((d) => (d._id === dish._id ? { ...d, name: e.target.value } : d))
              )}
              placeholder="Dish Name"
            />

            {/* Input për përshkrimin */}
            <textarea
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={dish.description}
              onChange={(e) => setDishes((prev) =>
                prev.map((d) => (d._id === dish._id ? { ...d, description: e.target.value } : d))
              )}
              placeholder="Description"
              rows={3}
            />

            {/* Input për çmimin */}
            <input
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              type="number"
              value={dish.price}
              onChange={(e) => setDishes((prev) =>
                prev.map((d) => (d._id === dish._id ? { ...d, price: e.target.value } : d))
              )}
              placeholder="Price"
            />

            {/* Buton për të ruajtur ndryshimet */}
            <button
              onClick={() => handleUpdate(dish._id, {
                name: dish.name,
                description: dish.description,
                price: dish.price
              })}
              className="bg-primary text-white font-semibold py-3 rounded-lg hover:bg-secondary transition"
            >
              Save Changes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
