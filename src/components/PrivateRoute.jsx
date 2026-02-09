import { Navigate } from 'react-router-dom';

/**
 * Komponent për të mbrojtur rrugët që kërkojnë login dhe/ose role specifike.
 * @param {object} user - përdoruesi i loguar nga App.jsx
 * @param {array} allowedRoles - array me rolet që lejohen (opsionale)
 * @param {ReactNode} children - komponentët që do shfaqen nëse ka akses
 */
export default function PrivateRoute({ user, allowedRoles = [], children }) {
  // Nuk je i loguar fare → shko te login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Je i loguar, por nuk ke rol të lejuar → kthehu në home
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Je brenda, ke rol të saktë → lejo aksesin
  return children;
}

