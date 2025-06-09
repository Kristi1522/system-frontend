/* eslint-disable no-unused-vars */ // Ky koment ndalon një paralajmërim nga ESLint nëse ka variabla që nuk përdoren

import { useState } from 'react'; // Hook nga React për të menaxhuar gjendjen lokale të komponentit
import axios from 'axios'; // Libraria për thirrje HTTP

const API_URL = "https://system-backend-0i7a.onrender.com"; // URL-ja bazë e API-së nga backend-i yt

// Komponenti kryesor funksional për shtimin e një pjate
export default function AddDish() {
  // Deklarimi i tre state-ve për emrin, çmimin dhe përshkrimin
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // Funksioni që ekzekutohet kur klikojmë butonin "Add"
  const handleAdd = async () => {
    const user = JSON.parse(localStorage.getItem('user')); // Merr tokenin e përdoruesit nga localStorage

    try {
      // Bën kërkesë POST për të shtuar një pjatë të re
      await axios.post(`${API_URL}/dishes`, { name, price, description }, {
        headers: { Authorization: `Bearer ${user.token}` }, // Header me token për autentifikim
      });

      alert("✅ Dish added successfully!"); // Njoftim për sukses
      // Pas suksesit, pastron inputet
      setName('');
      setPrice('');
      setDescription('');
    } catch (err) {
      alert("❌ Error while adding the dish"); // Njoftim në rast gabimi
    }
  };

  // JSX që përfaqëson formën e ndërfaqes për shtimin e një pjate
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <h2 className="text-3xl font-bold text-primary mb-8">Add New Dish</h2>
      
      {/* Input për emrin e pjates */}
      <input
        className="w-full max-w-md p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      
      {/* Input për çmimin */}
      <input
        className="w-full max-w-md p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      
      {/* Input për përshkrimin */}
      <input
        className="w-full max-w-md p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      {/* Butoni për të shtuar pjatën */}
      <button
        onClick={handleAdd}
        className="w-full max-w-md bg-primary text-white font-semibold py-3 rounded-lg hover:bg-secondary transition transform hover:-translate-y-1"
      >
        Add
      </button>
    </div>
  );
}
