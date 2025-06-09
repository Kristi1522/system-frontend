// Importimi i hooks nga React dhe axios për thirrje HTTP
import { useState } from "react";
import axios from "axios";

// URL-ja bazë e backend-it
const API_URL = "https://system-backend-0i7a.onrender.com";

export default function RegisterUser() {
  // State për emailin, fjalëkalimin dhe rolin e përdoruesit të ri
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  // Merr tokenin nga localStorage për autorizim
  const token = localStorage.getItem("token");

  // Funksioni për të trajtuar submit-in e formës
  const handleSubmit = async (e) => {
    e.preventDefault(); // Parandalon refresh-in e faqes

    try {
      // Bën kërkesë POST për të regjistruar një përdorues të ri
      await axios.post(
        `${API_URL}/auth/register`,
        { email, password, role }, // Të dhënat e regjistrimit
        {
          headers: {
            Authorization: `Bearer ${token}`, // Header për autorizim
          },
        }
      );

      // Njoftim për sukses
      alert("✅ User registered successfully!");

      // Pastro input-et pas regjistrimit
      setEmail("");
      setPassword("");
      setRole("employee");
    } catch (err) {
      console.error("❌ Error during registration:", err.response?.data || err.message);
      alert("Error during registration.");
    }
  };

  // JSX për të ndërtuar UI e formës së regjistrimit
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">🧑‍💼 Register New User</h2>

        {/* Forma e regjistrimit */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Input për email */}
          <input
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Input për fjalëkalim */}
          <input
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Select për zgjedhjen e rolit */}
          <select
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          {/* Butoni për submit */}
          <button
            type="submit"
            className="bg-primary text-white font-semibold py-3 rounded-lg hover:bg-secondary transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
