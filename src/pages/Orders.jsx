// Importimi i hooks dhe axios
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = "https://system-backend-0i7a.onrender.com";

export default function Orders() {
  // Lista e pjatave që vjen nga serveri
  const [dishes, setDishes] = useState([]);
  // Lista e pjatave të përzgjedhura për porosi
  const [orderItems, setOrderItems] = useState([]);
  // Merr tokenin nga localStorage
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // Merr pjatat nga serveri kur komponenti ngarkohet
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await axios.get(`${API_URL}/dishes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDishes(res.data);
      } catch (err) {
        console.error("❌ Error fetching dishes:", err);
      }
    };

    fetchDishes();
  }, [token]);

  // Shton ose rrit sasinë e një pjate në porosi
  const addToOrder = (dish) => {
    const exists = orderItems.find((item) => item.dishId === dish._id);
    if (exists) {
      setOrderItems(orderItems.map((item) =>
        item.dishId === dish._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, { dishId: dish._id, quantity: 1 }]);
    }
  };

  // Dërgon porosinë në server dhe e printon faturën
  const submitAndPrintOrder = async () => {
    // Llogarit çmimin total
    const totalPrice = orderItems.reduce((sum, item) => {
      const dish = dishes.find((d) => d._id === item.dishId);
      return sum + (dish?.price || 0) * item.quantity;
    }, 0);

    try {
      // Dërgo porosinë në backend
      await axios.post(`${API_URL}/orders`, {
        items: orderItems,
        totalPrice,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Order submitted successfully!");

      // Printo faturën
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <h3>🧾 Order Receipt</h3>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
        <hr />
        ${orderItems.map((item) => {
          const dish = dishes.find((d) => d._id === item.dishId);
          return `<div>${dish?.name || "Unknown Name"} x ${item.quantity}</div>`;
        }).join('')}
        <hr />
        <p><strong>Total:</strong> ${totalPrice.toFixed(2)}€</p>
      `);
      printWindow.document.close();
      printWindow.print();

      // Pasi porosia u dërgua, pastro listën
      setOrderItems([]);
    } catch (err) {
      console.error("❌ Error submitting order:", err);
      alert("Error submitting order.");
    }
  };

  // JSX për shfaqjen e faqes së porosisë
  return (
    <div className="min-h-screen bg-background p-6 text-textdark">
      <h2 className="text-4xl font-bold text-primary mb-8">🛒 Create Order</h2>

      {/* Nëse nuk ka pjata, shfaq mesazh */}
      {dishes.length === 0 ? (
        <p className="text-gray-500 mb-8">No dishes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dishes.map((dish) => (
            <div key={dish._id} className="bg-white p-4 rounded-lg shadow-md hover:bg-gray-100 transition flex flex-col gap-2">
              <strong className="text-lg text-primary">{dish.name}</strong>
              <span className="text-gray-600">€{dish.price.toFixed(2)}</span>
              <p className="text-sm text-gray-500">{dish.description}</p>
              <button
                onClick={() => addToOrder(dish)}
                className="mt-auto bg-primary text-white py-2 rounded-lg font-semibold hover:bg-secondary transition"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}

      <hr className="border-t-2 border-gray-200 mb-8" />

      <h3 className="text-2xl font-semibold text-secondary mb-4">📋 Current Order:</h3>

      {/* Nëse nuk ka asnjë pjatë të përzgjedhur */}
      {orderItems.length === 0 ? (
        <p className="text-gray-500 mb-8">No items selected.</p>
      ) : (
        <ul className="list-disc list-inside mb-8">
          {orderItems.map((item) => {
            const dish = dishes.find((d) => d._id === item.dishId);
            return (
              <li key={item.dishId} className="text-lg">
                {dish?.name || "Unknown Name"} x {item.quantity}
              </li>
            );
          })}
        </ul>
      )}

      {/* Butoni për të dërguar dhe printuar porosinë */}
      <button
        onClick={submitAndPrintOrder}
        disabled={orderItems.length === 0}
        className={`w-full max-w-md mx-auto block py-3 px-6 rounded-lg font-bold transition ${
          orderItems.length === 0
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-primary text-white hover:bg-secondary"
        }`}
      >
        🚀 Submit and Print Invoice
      </button>
    </div>
  );
}
