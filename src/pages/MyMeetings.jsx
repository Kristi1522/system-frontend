// Importimi i hook-ëve nga React dhe axios për komunikim me backend
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";

// Komponenti që shfaq takimet personale të përdoruesit
export default function MyMeetings() {
  const [meetings, setMeetings] = useState([]); // Gjendja për ruajtjen e listës së takimeve

  // Merr të dhënat e user-it nga localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // useEffect që ekzekutohet vetëm një herë kur ngarkohet komponenti
  useEffect(() => {
    const fetchMyMeetings = async () => {
      try {
        // Kërkesa GET për të marrë takimet e përdoruesit aktual
        const res = await axios.get(`${API_URL}/api/meetings/my`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMeetings(res.data); // Ruaj takimet në gjendje
      } catch (err) {
        console.error("Gabim gjatë marrjes së takimeve të mia:", err);
      }
    };

    fetchMyMeetings();
  }, []); // [] siguron që të ekzekutohet vetëm një herë

  // JSX për shfaqjen e takimeve
  return (
    <div className="p-6 min-h-screen bg-background text-textdark">
      <h2 className="text-3xl font-bold mb-6 text-primary">📅 Takimet e mia</h2>

      {/* Nëse nuk ka takime */}
      {meetings.length === 0 ? (
        <p className="text-gray-500">Nuk keni asnjë takim.</p>
      ) : (
        // Tabela që shfaq takimet
        <table className="w-full border-collapse bg-white shadow-md rounded">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="border px-4 py-2">Data</th>
              <th className="border px-4 py-2">Ora</th>
              <th className="border px-4 py-2">Tema</th>
              <th className="border px-4 py-2">Statusi</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((m) => (
              <tr key={m._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{new Date(m.date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{m.hour}</td>
                <td className="border px-4 py-2">{m.topic}</td>
                <td className="border px-4 py-2">{m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
