import React, { useState } from "react";
import { useField } from "formik";

/* Form building blocks shared by Login and Signup. Each field wires its
   label, error text and aria attributes together, so the pages only
   describe which fields they have. */

export function TextField({ label, name, hint, ...inputProps }) {
  const [field, meta] = useField(name);
  const showError = Boolean(meta.touched && meta.error);
  const describedBy = showError ? `${name}-error` : hint ? `${name}-hint` : undefined;

  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        className={`auth-input ${showError ? "is-invalid" : ""}`}
        aria-invalid={showError}
        aria-describedby={describedBy}
        {...field}
        {...inputProps}
      />
      {showError ? (
        <p className="auth-error" id={`${name}-error`}>
          {meta.error}
        </p>
      ) : (
        hint && (
          <p className="auth-hint" id={`${name}-hint`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function PasswordField({ label, name, children, ...inputProps }) {
  const [field, meta] = useField(name);
  const [visible, setVisible] = useState(false);
  const showError = Boolean(meta.touched && meta.error);

  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={name}>
        {label}
      </label>
      <div className="auth-password">
        <input
          id={name}
          type={visible ? "text" : "password"}
          className={`auth-input ${showError ? "is-invalid" : ""}`}
          aria-invalid={showError}
          aria-describedby={showError ? `${name}-error` : undefined}
          {...field}
          {...inputProps}
        />
        <button
          type="button"
          className="auth-password-toggle"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {showError && (
        <p className="auth-error" id={`${name}-error`}>
          {meta.error}
        </p>
      )}
      {children}
    </div>
  );
}

export function SubmitButton({ isSubmitting, idleLabel, busyLabel }) {
  return (
    <button className="auth-submit" type="submit" disabled={isSubmitting}>
      {isSubmitting && <span className="auth-spinner" aria-hidden="true" />}
      {isSubmitting ? busyLabel : idleLabel}
    </button>
  );
}

/* Form-level message from the server (wrong password, email taken,
   rate limited, server down). `action` is an optional link or button. */
export function FormAlert({ message, action }) {
  if (!message) return null;

  return (
    <div className="auth-alert" role="alert">
      <span>{message}</span>
      {action}
    </div>
  );
}
