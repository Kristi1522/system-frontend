// Importimi i hooks nga React dhe libraria axios për thirrje HTTP
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config"; // URL-ja bazë e API-së, ruajtur në një skedar konfigurimi

// Komponenti kryesor për krijimin e takimeve nga admini
export default function AdminCreateMeeting() {
  // Gjendjet për inputet e formës
  const [users, setUsers] = useState([]);        // Lista e përdoruesve
  const [userId, setUserId] = useState("");      // ID e përdoruesit të përzgjedhur
  const [date, setDate] = useState("");          // Data e takimit
  const [hour, setHour] = useState("");          // Ora e takimit
  const [topic, setTopic] = useState("");        // Tema e takimit

  // Merr të dhënat e përdoruesit aktual nga localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // useEffect për të ngarkuar përdoruesit kur komponenti ngarkohet
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Thirrje GET për të marrë të gjithë përdoruesit
        const res = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${user.token}` }, // Header me token autentikimi
        });
        setUsers(res.data); // Ruaj përdoruesit në state
      } catch (err) {
        console.error("Gabim gjatë marrjes së përdoruesve:", err);
      }
    };

    fetchUsers(); // Thirrja e funksionit
  }, []);

  // Funksioni që përpunon dërgimin e formës
  const handleSubmit = async (e) => {
    e.preventDefault(); // Parandalon rifreskimin e faqes

    try {
      // Dërgon të dhënat e takimit me metodën POST
      await axios.post(
        `${API_URL}/api/meetings/by-admin`,
        { userId, date, hour, topic },
        { headers: { Authorization: `Bearer ${user.token}` } } // Autentikim me token
      );
      alert("✅ Takimi u krijua me sukses!");

      // Pastrimi i inputeve pas suksesit
      setUserId("");
      setDate("");
      setHour("");
      setTopic("");
    } catch (err) {
      console.error("❌ Gabim gjatë krijimit të takimit:", err);
      alert("Gabim gjatë krijimit të takimit.");
    }
  };

  // JSX që kthen formën për krijimin e takimit
  return (
    <div className="min-h-screen p-6 bg-background text-textdark">
      <h2 className="text-3xl font-bold mb-6 text-primary">➕ Shto Takim</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto space-y-4">
        {/* Zgjedhja e përdoruesit */}
        <div>
          <label className="block mb-1 font-medium">Përdoruesi:</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          >
            <option value="">-- Zgjidh përdoruesin --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.email}
              </option>
            ))}
          </select>
        </div>

        {/* Fusha për datën e takimit */}
        <div>
          <label className="block mb-1 font-medium">Data:</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* Fusha për orën e takimit */}
        <div>
          <label className="block mb-1 font-medium">Ora:</label>
          <input
            type="time"
            className="w-full border px-3 py-2 rounded"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            required
          />
        </div>

        {/* Fusha për temën e takimit */}
        <div>
          <label className="block mb-1 font-medium">Tema:</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Shembull: Mbledhje mujore"
            required
          />
        </div>

        {/* Butoni për të krijuar takimin */}
        <button
          type="submit"
          className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded w-full"
        >
          Krijo Takim
        </button>
      </form>
    </div>
  );
}
