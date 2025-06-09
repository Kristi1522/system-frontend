// Importimi i hook-ëve të nevojshëm nga React dhe React Router
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// URL-ja bazë e backend-it
const API_URL = "https://system-backend-0i7a.onrender.com";

// Komponenti për login që pranon setUser si props
export default function Login({ setUser }) {
  // Gjendja për ruajtjen e input-eve nga përdoruesi
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook për navigim

  // Funksioni që trajton login-in kur dorëzohet forma
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ndalo reload-in e faqes

    try {
      // Kërkesa POST për autentikim te backend-i
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      // Nëse login-i është i suksesshëm
      if (res.status === 200) {
        // Ruaj të dhënat në localStorage për përdorim të mëvonshëm
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('token', res.data.token);
        setUser(res.data); // Përditëso gjendjen globale të user-it

        // Sipas rolit, dërgo përdoruesin në faqen përkatëse
        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/orders");
        }
      } else {
        alert('Incorrect login!');
      }
    } catch (err) {
      // Në rast gabimi, shfaq mesazh dhe log error-in
      console.error('❌ Error during login:', err.response?.data || err.message);
      alert('Incorrect email or password!');
    }
  };

  // JSX për formën e login-it
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-primary">Login</h2>

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

        {/* Butoni për login */}
        <button
          type="submit"
          className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
