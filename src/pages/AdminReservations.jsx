// Importime nga React dhe axios për API
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config"; // URL-ja bazë e API-së

// Komponenti për adminin që menaxhon rezervimet
export default function AdminReservations() {
  const [reservations, setReservations] = useState([]); // Lista e rezervimeve
  const user = JSON.parse(localStorage.getItem("user")); // Merr përdoruesin nga localStorage (për tokenin)

  // useEffect që ngarkohet një herë kur komponenti renderohet
  useEffect(() => {
    fetchReservations(); // Merr të gjitha rezervimet nga backend
  }, []);

  // Kërkesë GET për të marrë rezervimet
  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reservations`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Dërgo tokenin për autorizim
        },
      });
      setReservations(res.data); // Ruaj rezultatin në gjendje (state)
    } catch (err) {
      console.error("Gabim gjatë marrjes së rezervimeve:", err);
    }
  };

  // Fshirja e një rezervimi me konfirmim paraprak
  const handleDelete = async (id) => {
    if (!window.confirm("A je i sigurt që do ta fshish këtë rezervim?")) return;

    try {
      await axios.delete(`${API_URL}/api/reservations/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Përditëso listën lokale duke hequr rezervimin e fshirë
      setReservations((prev) => prev.filter((r) => r._id !== id));
      alert("✅ Rezervimi u fshi me sukses.");
    } catch (err) {
      console.error("❌ Gabim gjatë fshirjes:", err);
      alert("Gabim gjatë fshirjes së rezervimit.");
    }
  };

  // JSX për përfaqësimin vizual të rezervimeve
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-primary">📋 Të gjitha rezervimet</h2>

      {/* Nëse nuk ka asnjë rezervim */}
      {reservations.length === 0 ? (
        <p className="text-gray-500">Nuk ka rezervime.</p>
      ) : (
        // Tabela me rezervimet
        <table className="w-full border-collapse mt-4">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="border px-4 py-2 text-left">Përdoruesi</th>
              <th className="border px-4 py-2 text-left">Email</th>
              <th className="border px-4 py-2 text-left">Data</th>
              <th className="border px-4 py-2 text-left">Ora</th>
              <th className="border px-4 py-2 text-left">Persona</th>
              <th className="border px-4 py-2 text-left">Statusi</th>
              <th className="border px-4 py-2 text-left">Veprim</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{r.user?.name || "Anonim"}</td>
                <td className="border px-4 py-2">{r.user?.email}</td>
                <td className="border px-4 py-2">
                  {new Date(r.date).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{r.time}</td>
                <td className="border px-4 py-2">{r.peopleCount}</td>
                <td className="border px-4 py-2">{r.status}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-red-500 hover:underline"
                  >
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
