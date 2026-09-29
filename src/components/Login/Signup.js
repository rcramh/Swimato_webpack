import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSignupMutation } from "../../utils/authApi";
import { readApiError } from "../../utils/apiSlice";
import { selectCurrentUser } from "../../utils/authSlice";
import AuthLayout from "./AuthLayout";
import { FormAlert, PasswordField, SubmitButton, TextField } from "./AuthFields";

// Same rules the server enforces (validators/auth.validators.ts); checking
// here only saves a round trip. The server's answer is the one that counts.
const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (value) => value.length >= 8 },
  { label: "An uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "A lowercase letter", test: (value) => /[a-z]/.test(value) },
  { label: "A number", test: (value) => /\d/.test(value) },
];

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, "Name is too short")
    .max(50, "Name is too long")
    .required("Name is required"),
  email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .max(72, "Password must be at most 72 characters")
    .test(
      "strength",
      "Password doesn't meet the requirements below",
      (value = "") => PASSWORD_RULES.every((rule) => rule.test(value)),
    ),
});

function PasswordChecklist({ password }) {
  return (
    <ul className="auth-rules" aria-label="Password requirements">
      {PASSWORD_RULES.map(({ label, test }) => {
        const met = test(password);
        return (
          <li key={label} className={met ? "is-met" : ""}>
            <span className="sr-only">{met ? "Done: " : "Missing: "}</span>
            {label}
          </li>
        );
      })}
    </ul>
  );
}

const Signup = () => {
  const [signup] = useSignupMutation();
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  const returnTo = location.state?.from?.pathname ?? "/";

  // Signing up also signs in (the server sets the cookies), so a
  // successful submit re-renders straight into this redirect.
  if (user) return <Navigate to={returnTo} replace />;

  const handleSubmit = async (values, { setErrors, setStatus }) => {
    setStatus(undefined);
    try {
      await signup({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      }).unwrap();
    } catch (error) {
      const { code, message, fieldErrors } = readApiError(error);
      setErrors(fieldErrors);
      setStatus({ code, message });
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes less than a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={location.state}>
            Log in
          </Link>
        </>
      }
    >
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, status }) => (
          <Form noValidate>
            <FormAlert
              message={status?.message}
              action={
                status?.code === "EMAIL_TAKEN" && (
                  <Link to="/login" state={location.state}>
                    Log in instead
                  </Link>
                )
              }
            />

            <TextField
              label="Name"
              name="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
            <PasswordField
              label="Password"
              name="password"
              placeholder="Create a password"
              autoComplete="new-password"
            >
              <PasswordChecklist password={values.password} />
            </PasswordField>

            <SubmitButton
              isSubmitting={isSubmitting}
              idleLabel="Create account"
              busyLabel="Creating account…"
            />
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Signup;
