// Importimi i hooks dhe komponenteve të nevojshme
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Importimi i faqeve (Pages)
import AdminMeetings from './pages/AdminMeetings';
import MyMeetings from './pages/MyMeetings';
import AdminCreateMeeting from "./pages/AdminCreateMeeting";
import DailySummary from './pages/DailySummary';
import Login from './pages/login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';
import MyOrders from './pages/MyOrders';
import AddDish from './pages/AddDish';
import EditMenu from './pages/EditMenu';
import DeleteDish from './pages/DeleteDish';
import RegisterUser from './pages/RegisterUser';
import AdminCreateReservation from './pages/AdminCreateReservation';
import AdminReservations from './pages/AdminReservations';
import MyReservations from './pages/MyReservations';

// Komponentët e përbashkët
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

export default function App() {
  // State për përdoruesin e loguar dhe gjendje tjera
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Marrja e përdoruesit nga localStorage në fillim
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Kapja e eventit për instalim PWA
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Trajtimi i klikimit në butonin "Install App"
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  // Nëse të dhënat janë duke u ngarkuar, mos shfaq asgjë
  if (loading) return null;

  return (
    <>
      {/* Navbar për të gjithë */}
      <Navbar user={user} />

      {/* Definimi i rrugeve për aplikacionin */}
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Dashboard default për admin */}
        <Route
          path="/"
          element={
            <PrivateRoute user={user}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <PrivateRoute user={user}>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Takimet për admin */}
        <Route
          path="/admin-meetings"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <AdminMeetings />
            </PrivateRoute>
          }
        />

        {/* Takimet e mia për admin + punonjës */}
        <Route
          path="/my-meetings"
          element={
            <PrivateRoute user={user} allowedRoles={['employee', 'admin']}>
              <MyMeetings />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-create-meeting"
          element={
            <PrivateRoute user={user} allowedRoles={["admin"]}>
              <AdminCreateMeeting />
            </PrivateRoute>
          }
        />

        {/* Porositë */}
        <Route
          path="/orders"
          element={
            <PrivateRoute user={user} allowedRoles={['admin', 'employee']}>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <PrivateRoute user={user}>
              <MyOrders />
            </PrivateRoute>
          }
        />

        {/* Rezervimet për admin dhe punonjës */}
        <Route
          path="/admin-reservations"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <AdminReservations />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-reservations"
          element={
            <PrivateRoute user={user} allowedRoles={['employee', 'admin']}>
              <MyReservations />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-create-reservation"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <AdminCreateReservation />
            </PrivateRoute>
          }
        />

        {/* Rruga kryesore për admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Menu - shtim/editim/fshirje pjatash */}
        <Route
          path="/add-dish"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <AddDish />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-menu"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <EditMenu />
            </PrivateRoute>
          }
        />
        <Route
          path="/delete-dish"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <DeleteDish />
            </PrivateRoute>
          }
        />

        {/* Regjistrim i përdoruesve të rinj */}
        <Route
          path="/register-user"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <RegisterUser />
            </PrivateRoute>
          }
        />

        {/* Raportet ditore për admin */}
        <Route
          path="/daily-summary"
          element={
            <PrivateRoute user={user} allowedRoles={['admin']}>
              <DailySummary />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Butoni për instalim PWA, shfaqet nëse është e mundur */}
      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            zIndex: 1000
          }}
        >
          Install App
        </button>
      )}
    </>
  );
}
