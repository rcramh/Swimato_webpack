import React from "react";
import { Link } from "react-router-dom";
import App_logo from "../Assets/app_logo.png";
import "./Footer.css";

const EXPLORE_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/cart", label: "Cart" },
];

const SUPPORT_EMAIL = "support@swimato.com";
const SUPPORT_PHONE = "+91 12345 67890";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-about">
          <div className="footer-brand">
            <img src={App_logo} alt="" className="footer-mark" />
            <span className="footer-wordmark">
              Swi<em>mato</em>
            </span>
          </div>
          <p className="footer-tagline">
            Delicious food from the restaurants near you, delivered to your
            doorstep.
          </p>
        </div>

        <nav aria-labelledby="footer-explore">
          <h2 className="footer-heading" id="footer-explore">
            Explore
          </h2>
          <ul className="footer-list">
            {EXPLORE_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="footer-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="footer-heading" id="footer-contact">
            Contact
          </h2>
          <ul className="footer-list" aria-labelledby="footer-contact">
            <li>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="footer-link">
                {SUPPORT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                className="footer-link"
              >
                {SUPPORT_PHONE}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} Swimato. All rights reserved.</p>
          <p>Built with React &amp; Redux Toolkit.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
