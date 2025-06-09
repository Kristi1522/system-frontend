// Importimi i hooks nga React dhe axios për thirrje HTTP
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config"; // URL-ja bazë e API-së, nga një file konfigurimi

// Komponenti për të krijuar një rezervim si admin
export default function AdminCreateReservation() {
  // Lista e përdoruesve që mund të përzgjidhen
  const [users, setUsers] = useState([]);

  // Gjendja e formës për rezervimin
  const [form, setForm] = useState({
    userId: "",          // ID e përdoruesit të përzgjedhur
    date: "",            // Data e rezervimit
    time: "",            // Ora e rezervimit
    peopleCount: 1       // Numri i personave
  });

  // Merr përdoruesin aktual (adminin) nga localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // useEffect për të marrë listën e përdoruesve sapo të ngarkohet komponenti
  useEffect(() => {
    axios.get(`${API_URL}/api/users`, {
      headers: { Authorization: `Bearer ${user.token}` } // Token për autorizim
    }).then(res => setUsers(res.data)); // Ruaj përdoruesit në state
  }, []);

  // Funksion që përditëson gjendjen e formës kur ndryshohet ndonjë input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // Përditëso fushën përkatëse
  };

  // Funksioni për të dërguar rezervimin në backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Parandalon rifreskimin e faqes
    try {
      // Kërkesë POST për krijimin e rezervimit
      await axios.post(`${API_URL}/api/reservations/by-admin`, form, {
        headers: { Authorization: `Bearer ${user.token}` }, // Header me token
      });
      alert("✅ Rezervimi u krijua!"); // Njoftim suksesi

      // Pastro formën pas dërgimit
      setForm({ userId: "", date: "", time: "", peopleCount: 1 });
    } catch (err) {
      console.error(err); // Printo gabimin në console
      alert("❌ Dështoi krijimi i rezervimit."); // Njoftim gabimi
    }
  };

  // JSX që përfaqëson formën për krijimin e një rezervimi
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4 text-center">Shto Rezervim</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-4 max-w-md mx-auto space-y-4"
      >
        {/* Zgjedhja e përdoruesit */}
        <div>
          <label className="block mb-1 font-medium">Përdoruesi</label>
          <select
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          >
            <option value="">Zgjidh përdoruesin</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.email}</option>
            ))}
          </select>
        </div>

        {/* Fusha për datën */}
        <div>
          <label className="block mb-1 font-medium">Data</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        {/* Fusha për orën */}
        <div>
          <label className="block mb-1 font-medium">Ora</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        {/* Fusha për numrin e personave */}
        <div>
          <label className="block mb-1 font-medium">Numri i personave</label>
          <input
            type="number"
            name="peopleCount"
            min="1"
            value={form.peopleCount}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        {/* Butoni për të dërguar formën */}
        <button
          type="submit"
          className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded w-full"
        >
          Krijo Rezervim
        </button>
      </form>
    </div>
  );
}
