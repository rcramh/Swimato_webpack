import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../utils/authApi";
import { readApiError } from "../../utils/apiSlice";
import { selectCurrentUser } from "../../utils/authSlice";
import AuthLayout from "./AuthLayout";
import { FormAlert, PasswordField, SubmitButton, TextField } from "./AuthFields";

// Deliberately looser than SignupSchema: an existing password only has to be
// present. Re-running the strength rules here would reject accounts made
// before those rules existed, and tells an attacker what the format is.
const LoginSchema = Yup.object().shape({
  email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const [login] = useLoginMutation();
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  // RequireAuth sends people here with the page they were trying to reach.
  const returnTo = location.state?.from?.pathname ?? "/";

  // The fulfilled login lands the user in authSlice, which re-renders this
  // page into a redirect — so there is no navigate() in the submit handler.
  if (user) return <Navigate to={returnTo} replace />;

  const handleSubmit = async (values, { setErrors, setStatus }) => {
    setStatus(undefined);
    try {
      await login({ email: values.email.trim(), password: values.password }).unwrap();
    } catch (error) {
      const { message, fieldErrors } = readApiError(error);
      setErrors(fieldErrors);
      setStatus(message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
      footer={
        <>
          New to Swimato?{" "}
          <Link to="/signup" state={location.state}>
            Create an account
          </Link>
        </>
      }
    >
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form noValidate>
            <FormAlert message={status} />

            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
            />
            <PasswordField
              label="Password"
              name="password"
              placeholder="Your password"
              autoComplete="current-password"
            />

            <SubmitButton
              isSubmitting={isSubmitting}
              idleLabel="Log in"
              busyLabel="Logging in…"
            />
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Login;
