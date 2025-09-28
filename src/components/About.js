import React, { useState, useEffect } from "react";

function About() {
  const [userData, setUserData] = useState(null);
  const url = "https://api.github.com/users/rcramh";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch(url);
    const data = await response.json();
    setUserData(data);
  };

  if (userData === null) {
    return (
      <div className="about-container">
        <h2>About Swimato</h2>
        <p>Loading developer details...</p>
      </div>
    );
  }

  return (
    <div className="about-container" style={{ maxWidth: "700px", margin: "40px auto", padding: "32px", background: "#f8f8f8", borderRadius: "16px", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
      <h2>About Swimato</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
        <img
          style={{ borderRadius: "15px", height: "180px", width: "180px", objectFit: "cover", border: "3px solid #1abc9c" }}
          src={userData.avatar_url}
          alt="Rahul Chaubey"
        />
        <div>
          <h3 style={{ margin: "0 0 8px 0" }}>{userData.name}</h3>
          <p style={{ margin: "0 0 8px 0" }}><b>Developer:</b> Rahul Chaubey</p>
          <p style={{ margin: "0 0 8px 0" }}><b>GitHub:</b> <a href={userData.html_url} target="_blank" rel="noopener noreferrer">{userData.login}</a></p>
          <p style={{ margin: "0 0 8px 0" }}><b>Location:</b> {userData.location || "India"}</p>
          <p style={{ margin: "0 0 8px 0" }}><b>Bio:</b> {userData.bio || "Passionate Full Stack Developer. Building scalable web apps with React & Node.js."}</p>
        </div>
      </div>
      <div style={{ marginTop: "32px" }}>
        <h4>About This Project</h4>
        <p>
          Swimato is a food delivery web application inspired by Swiggy and Zomato. It demonstrates modern React development, API integration, and responsive UI design.
        </p>
      </div>
    </div>
  );
}

export default About;

