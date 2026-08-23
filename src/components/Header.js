import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import App_logo from "../Assets/app_logo.png";
import useOnlineStatus from "../utils/useOnlineStatus";
import "./Header.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
];

const navLinkClass = ({ isActive }) =>
  isActive ? "nav-link is-active" : "nav-link";

function Header() {
  const isOnline = useOnlineStatus();
  const cartItems = useSelector((store) => store.cart.items);
  const cartCount = cartItems.length;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Collapse the mobile menu whenever the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Escape closes the mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Swimato, go to home">
          <img src={App_logo} alt="" className="brand-mark" />
          <span className="brand-name">
            Swi<em>mato</em>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="primary-nav"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>

        <nav
          id="primary-nav"
          className={isMenuOpen ? "primary-nav is-open" : "primary-nav"}
          aria-label="Primary"
        >
          <ul className="nav-list">
            {NAV_LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={navLinkClass}>
                  {label}
                </NavLink>
              </li>
            ))}

            <li>
              <NavLink
                to="/cart"
                className={navLinkClass}
                aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
              >
                Cart
                {cartCount > 0 && (
                  <span className="cart-badge" aria-hidden="true">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>

          <div className="nav-meta">
            {!isOnline && (
              <span className="status-offline" role="status">
                Offline
              </span>
            )}
            <Link to="/login" className="btn-signin">
              Sign in
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
