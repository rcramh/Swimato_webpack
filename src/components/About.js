import React, { useEffect, useState } from "react";
import App_logo from "../Assets/app_logo.png";
import "./About.css";

const GITHUB_USER = "rcramh";
const GITHUB_API = `https://api.github.com/users/${GITHUB_USER}`;
const GITHUB_PROFILE = `https://github.com/${GITHUB_USER}`;
const REPO_URL = "https://github.com/rcramh/Swimato_webpack";
const LIVE_URL = "https://swimato-web.vercel.app/";

const TECH_STACK = [
  "React 18",
  "Redux Toolkit",
  "React Router 6",
  "Formik + Yup",
  "Create React App",
  "Plain CSS",
];

const HIGHLIGHTS = [
  {
    title: "Search that works",
    body: "Filter the listing by restaurant name, cuisine or area.",
  },
  {
    title: "Menus by category",
    body: "Every restaurant page groups its dishes into collapsible sections.",
  },
  {
    title: "A real cart",
    body: "Add and remove dishes, with state held in a Redux Toolkit slice.",
  },
  {
    title: "Code splitting",
    body: "Routes load on demand using React.lazy and Suspense.",
  },
  {
    title: "Custom hooks",
    body: "useOnlineStatus keeps the UI honest when the connection drops.",
  },
  {
    title: "Component patterns",
    body: "A higher-order component tags restaurants that are pure veg.",
  },
];

function ProfileSkeleton() {
  return (
    <div className="about-skeleton" aria-hidden="true">
      <div className="sk-avatar" />
      <div className="sk-body">
        <div className="sk-line w-40" />
        <div className="sk-line w-70" />
        <div className="sk-line w-90" />
        <div className="sk-line w-40" />
      </div>
    </div>
  );
}

function About() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    // Abort in flight if the user navigates away before the response lands.
    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        const response = await fetch(GITHUB_API, { signal: controller.signal });

        // GitHub answers rate-limit errors with 403 and a JSON body, so a
        // bare response.json() would happily hand back an error object.
        if (!response.ok) throw new Error(`GitHub responded ${response.status}`);

        setProfile(await response.json());
        setStatus("ready");
      } catch (error) {
        if (error.name === "AbortError") return;
        setStatus("error");
      }
    };

    loadProfile();
    return () => controller.abort();
  }, []);

  return (
    <div className="about">
      <header className="about-hero">
        <img src={App_logo} alt="" className="about-hero-mark" />
        <h1 className="about-title">A food ordering app, built from scratch</h1>
        <p className="about-lede">
          Swimato is a food delivery web app in the spirit of Swiggy and Zomato.
          I built it to work through modern React properly: routing, global
          state, component patterns and a responsive interface.
        </p>
        <div className="about-actions">
          <a
            className="about-btn is-primary"
            href={LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View live app
          </a>
          <a
            className="about-btn"
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source on GitHub
          </a>
        </div>
      </header>

      <section className="about-section" aria-labelledby="about-stack">
        <h2 className="about-section-title" id="about-stack">
          Built with
        </h2>
        <ul className="about-chips">
          {TECH_STACK.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <p className="about-note">
          Restaurant and menu data comes from a saved Swiggy API response that
          lives in the repository, because their public endpoints block requests
          made from the browser. Everything built on top of it is real.
        </p>
      </section>

      <section className="about-section" aria-labelledby="about-features">
        <h2 className="about-section-title" id="about-features">
          What&apos;s inside
        </h2>
        <ul className="about-features">
          {HIGHLIGHTS.map(({ title, body }) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-section" aria-labelledby="about-dev">
        <h2 className="about-section-title" id="about-dev">
          Who built it
        </h2>

        <div className="about-profile-card">
          {status === "loading" && <ProfileSkeleton />}

          {status === "error" && (
            <div className="about-fallback">
              <p>
                The GitHub profile could not be loaded right now. Its public API
                limits how often it can be called.
              </p>
              <a
                className="about-btn"
                href={GITHUB_PROFILE}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit @{GITHUB_USER} on GitHub
              </a>
            </div>
          )}

          {status === "ready" && profile && (
            <div className="about-profile">
              <img
                className="about-avatar"
                src={profile.avatar_url}
                alt={profile.name || profile.login}
                width="132"
                height="132"
                loading="lazy"
              />

              <div className="about-profile-body">
                <h3 className="about-name">{profile.name || profile.login}</h3>
                <a
                  className="about-handle"
                  href={profile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{profile.login}
                </a>

                {profile.bio && <p className="about-bio">{profile.bio}</p>}

                <ul className="about-facts">
                  {profile.company && <li>{profile.company}</li>}
                  {profile.location && <li>{profile.location}</li>}
                </ul>

                <ul className="about-stats">
                  <li>
                    <b>{profile.public_repos}</b>
                    <span>Repos</span>
                  </li>
                  <li>
                    <b>{profile.followers}</b>
                    <span>Followers</span>
                  </li>
                  <li>
                    <b>{profile.following}</b>
                    <span>Following</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default About;
