// Importim i hooks nga React dhe axios për thirrje HTTP
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config"; // URL-ja bazë për API-në nga një file konfigurimi

// Komponenti për adminin që shfaq dhe menaxhon takimet
export default function AdminMeetings() {
  const [meetings, setMeetings] = useState([]); // Gjendja për listën e takimeve
  const user = JSON.parse(localStorage.getItem("user")); // Merr tokenin nga localStorage për autorizim

  // useEffect për të ngarkuar takimet në momentin kur ngarkohet komponenti
  useEffect(() => {
    fetchMeetings(); // Thirrja për të marrë takimet nga API
  }, []);

  // Funksion që merr listën e takimeve nga backend-i
  const fetchMeetings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/meetings`, {
        headers: { Authorization: `Bearer ${user.token}` }, // Dërgo tokenin për autorizim
      });
      setMeetings(res.data); // Ruaj takimet në state
    } catch (err) {
      console.error("Gabim gjatë marrjes së takimeve:", err); // Në rast gabimi, printo në console
    }
  };

  // Funksion për të fshirë një takim në bazë të ID-së së tij
  const handleDelete = async (id) => {
    if (!window.confirm("Fshi takimin?")) return; // Pyet konfirmim para fshirjes
    try {
      await axios.delete(`${API_URL}/api/meetings/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMeetings((prev) => prev.filter((m) => m._id !== id)); // Përditëso gjendjen pas fshirjes
    } catch (err) {
      console.error("Gabim gjatë fshirjes së takimit:", err);
    }
  };

  // JSX për përfaqësimin vizual të listës së takimeve
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-primary">📋 Takimet</h2>

      {/* Nëse nuk ka takime, shfaq mesazh informues */}
      {meetings.length === 0 ? (
        <p className="text-gray-500">Nuk ka takime.</p>
      ) : (
        // Nëse ka takime, shfaqen në formë tabele
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Përdoruesi</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Data</th>
              <th className="border px-4 py-2">Ora</th>
              <th className="border px-4 py-2">Tema</th>
              <th className="border px-4 py-2">Statusi</th>
              <th className="border px-4 py-2">Veprim</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((m) => (
              <tr key={m._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{m.user?.name || "Anonim"}</td>
                <td className="border px-4 py-2">{m.user?.email}</td>
                <td className="border px-4 py-2">{new Date(m.date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{m.hour}</td>
                <td className="border px-4 py-2">{m.topic}</td>
                <td className="border px-4 py-2">{m.status}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleDelete(m._id)} className="text-red-500 hover:underline">
                    🗑️ Fshi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
