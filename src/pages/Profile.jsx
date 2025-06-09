/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Adresa e backend-it
const API_URL = "https://system-backend-0i7a.onrender.com";

export default function Profile() {
  // Ruaj të dhënat e profilit
  const [data, setData] = useState({});
  // Flag për ngarkimin e të dhënave
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Marrja e të dhënave të profilit sapo komponenti ngarkohet
  useEffect(() => {
    const fetchProfile = async () => {
      // Merr përdoruesin dhe tokenin nga localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      // Nëse nuk ka token, vendos mesazhin për gabim
      if (!token) {
        setData({ message: "Missing token" });
        setLoading(false);
        return;
      }

      try {
        // Kërkesë për profilin me token në header
        const res = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ruaj të dhënat në state
        setData(res.data);
      } catch (err) {
        // Në rast gabimi, vendos mesazhin për gabim
        setData({ message: "Invalid or expired token" });
      } finally {
        // Fikso përfundimin e ngarkimit
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // JSX për shfaqjen e profilit
  return (
    <div className="min-h-screen bg-background p-6 text-textdark flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-primary mb-6">Profile</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            {/* Shfaq mesazhin nëse ka ndonjë gabim */}
            {data.message && (
              <p className="text-red-500 font-semibold">{data.message}</p>
            )}
            {/* Shfaq emailin nëse është i disponueshëm */}
            {data.email && (
              <p className="text-lg text-gray-700">
                <strong>Email:</strong> {data.email}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
