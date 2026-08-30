import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "./login.css";

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),

  email: Yup.string().email("Invalid email").required("Required"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
});

const FIELDS = [
  { name: "firstName", label: "Name", type: "text", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "At least 8 characters",
  },
];

const Signup = () => (
  <div className="auth">
    <Formik
      initialValues={{ firstName: "", email: "", password: "" }}
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        // same shape as initial values
        console.log(values);
      }}
    >
      {({ errors, touched }) => (
        <Form className="auth-card" noValidate>
          <h1 className="auth-title">Sign up</h1>
          <p className="auth-sub">
            Create an account to order faster and keep track of your cart.
          </p>

          {FIELDS.map(({ name, label, type, placeholder }) => {
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

          <button className="auth-submit" type="submit">
            Create account
          </button>

          <p className="auth-foot">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </Form>
      )}
    </Formik>
  </div>
);

export default Signup;
