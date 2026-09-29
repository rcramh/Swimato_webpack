import React from "react";
import App_logo from "../../Assets/app_logo.png";
import "./login.css";

const PERKS = [
  "Order from the best restaurants near you",
  "Track your cart across visits",
  "Checkout faster, every time",
];

/**
 * Shared shell for the sign-in and sign-up pages: a brand panel on the
 * left (collapses to a strip on phones) and the form card on the right.
 */
function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <div className="auth-shell">
        <aside className="auth-brand" aria-hidden="true">
          <div className="auth-brand-mark">
            <img src={App_logo} alt="" />
            <span>
              Swi<em>mato</em>
            </span>
          </div>

          <h2 className="auth-brand-title">
            Hungry?
            <br />
            We&apos;ve got you.
          </h2>

          <ul className="auth-perks">
            {PERKS.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
        </aside>

        <section className="auth-card">
          <h1 className="auth-title">{title}</h1>
          <p className="auth-sub">{subtitle}</p>
          {children}
          {footer && <p className="auth-foot">{footer}</p>}
        </section>
      </div>
    </div>
  );
}

export default AuthLayout;
