import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const role = user?.role || "guest";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const closeMenu = () => setOpen(false);

  const adminLinks = useMemo(
    () => [
      { to: "/admin", label: "Admin" },
      { to: "/daily-summary", label: "Daily Summary" },
      { to: "/admin-create-reservation", label: "Shto rezervim" },
      { to: "/admin-reservations", label: "Te gjitha rezervimet" },
      { to: "/admin-meetings", label: "Takimet" },
      { to: "/admin-create-meeting", label: "Shto Takim" },
    ],
    []
  );

  const employeeLinks = useMemo(
    () => [
      { to: "/orders", label: "Orders" },
      { to: "/my-orders", label: "My Orders" },
      { to: "/my-reservations", label: "Rezervimet e mia" },
      { to: "/my-meetings", label: "Takimet e mia" },
    ],
    []
  );

  const links = role === "admin" ? adminLinks : role === "employee" ? employeeLinks : [];

  return (
    <header className="nb-wrap">
      <nav className="nb-nav" aria-label="Main navigation">
        <div className="nb-left">
          <Link to={user ? (role === "admin" ? "/admin" : "/orders") : "/login"} className="nb-brand">
            <span className="nb-dot" aria-hidden="true" />
            Restorant
          </Link>

          {user ? (
            <span className={`nb-role nb-${role}`}>
              {role === "admin" ? "Admin" : "Employee"}
            </span>
          ) : (
            <span className="nb-role nb-guest">Guest</span>
          )}
        </div>

        {/* Desktop links */}
        <div className="nb-links">
          {!user ? (
            <NavLink
              to="/login"
              className={({ isActive }) => `nb-link ${isActive ? "is-active" : ""}`}
            >
              Login
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/profile"
                onClick={closeMenu}
                className={({ isActive }) => `nb-link ${isActive ? "is-active" : ""}`}
              >
                Profile
              </NavLink>

              {links.map((x) => (
                <NavLink
                  key={x.to}
                  to={x.to}
                  onClick={closeMenu}
                  className={({ isActive }) => `nb-link ${isActive ? "is-active" : ""}`}
                >
                  {x.label}
                </NavLink>
              ))}

              <button type="button" onClick={handleLogout} className="nb-logout">
                Dil
                <span className="nb-logoutGlow" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="nb-burger"
          aria-label="Open menu"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`nb-bLine ${open ? "x1" : ""}`} />
          <span className={`nb-bLine ${open ? "x2" : ""}`} />
          <span className={`nb-bLine ${open ? "x3" : ""}`} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="nb-drop" role="dialog" aria-label="Mobile menu">
          <div className="nb-dropInner">
            {!user ? (
              <NavLink
                to="/login"
                onClick={closeMenu}
                className={({ isActive }) => `nb-dropLink ${isActive ? "is-active" : ""}`}
              >
                Login
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={({ isActive }) => `nb-dropLink ${isActive ? "is-active" : ""}`}
                >
                  Profile
                </NavLink>

                <div className="nb-sep" />

                {links.map((x) => (
                  <NavLink
                    key={x.to}
                    to={x.to}
                    onClick={closeMenu}
                    className={({ isActive }) => `nb-dropLink ${isActive ? "is-active" : ""}`}
                  >
                    {x.label}
                  </NavLink>
                ))}

                <div className="nb-sep" />

                <button type="button" onClick={handleLogout} className="nb-dropLogout">
                  Dil
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
