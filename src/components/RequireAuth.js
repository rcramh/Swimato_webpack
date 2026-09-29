import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { PageShimmer } from "./Shimmer";
import { selectAuthStatus, selectCurrentUser } from "../utils/authSlice";
import "./Login/login.css";

/**
 * Route guard. Signed-out visitors go to /login, which sends them back
 * here afterwards. With `roles`, a signed-in user outside those roles
 * sees a "not allowed" card instead.
 *
 * This only shapes the UI — the API enforces the same rules on every
 * request, which is what actually protects the data.
 */
function RequireAuth({ roles, children }) {
  const status = useSelector(selectAuthStatus);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  // Don't bounce a signed-in user to /login while the startup check runs.
  if (status === "checking") return <PageShimmer />;

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="auth">
        <div className="auth-card">
          <h1 className="auth-title">Not allowed</h1>
          <p className="auth-sub">Your account doesn&apos;t have access to this page.</p>
          <p className="auth-foot">
            <Link to="/">Back to restaurants</Link>
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default RequireAuth;
