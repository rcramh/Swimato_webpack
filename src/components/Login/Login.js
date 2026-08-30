import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./login.css";

// Deliberately looser than SignupSchema: an existing password only has to be
// present. Re-running the strength rules here would reject accounts made
// before those rules existed, and tells an attacker what the format is.
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Password is required"),
});

const FIELDS = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Your password",
    autoComplete: "current-password",
  },
];

const Login = () => {
  const navigate = useNavigate();

  // No backend yet, so this stands in for the round trip: hold the button in
  // its pending state, then drop the user back on the listing.
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Sign in requested for", values.email);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    navigate("/");
  };

  return (
    <div className="auth">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="auth-card" noValidate>
            <h1 className="auth-title">Log in</h1>
            <p className="auth-sub">
              Welcome back. Sign in to pick up where you left off.
            </p>

            {FIELDS.map(({ name, label, type, placeholder, autoComplete }) => {
              const showError = errors[name] && touched[name];

              return (
                <div className="auth-field" key={name}>
                  <label className="auth-label" htmlFor={name}>
                    {label}
                  </label>
                  <Field
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`auth-input ${showError ? "is-invalid" : ""}`}
                    aria-invalid={Boolean(showError)}
                    aria-describedby={showError ? `${name}-error` : undefined}
                  />
                  {showError && (
                    <p className="auth-error" id={`${name}-error`} role="alert">
                      {errors[name]}
                    </p>
                  )}
                </div>
              );
            })}

            <button
              className="auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Log in"}
            </button>

            <p className="auth-foot">
              New here? <Link to="/signup">Create an account</Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
