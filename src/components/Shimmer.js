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

// Stand-in for a whole route while its lazy chunk downloads. Kept generic so
// any page can use it as a Suspense fallback.
export function PageShimmer() {
  return (
    <div className="page-shimmer" aria-hidden="true">
      <div className="page-shimmer-hero">
        <div className="shimmer-block sk-mark" />
        <div className="shimmer-line sk-title" />
        <div className="shimmer-line sk-lede" />
        <div className="shimmer-line sk-lede short" />
      </div>
      <div className="shimmer-block sk-panel" />
      <div className="shimmer-block sk-panel" />
    </div>
  );
}

export default Shimmer;
