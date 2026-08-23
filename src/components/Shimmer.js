import React from "react";
import "./Shimmer.css";

const PLACEHOLDER_COUNT = 12;

function Shimmer() {
  return (
    <ul className="shimmer-grid" aria-hidden="true">
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
        <li className="shimmer-card" key={index}>
          <div className="shimmer-media" />
          <div className="shimmer-body">
            <div className="shimmer-line w-80" />
            <div className="shimmer-line w-60" />
            <div className="shimmer-line w-40" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Shimmer;
