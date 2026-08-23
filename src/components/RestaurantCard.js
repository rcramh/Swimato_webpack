import React from "react";
import { Link } from "react-router-dom";
import "./RestaurantCard.css";

const IMAGE_CDN =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/";

const ratingClass = (rating) => {
  if (!rating) return "is-none";
  if (rating >= 4) return "is-good";
  if (rating >= 3) return "is-ok";
  return "is-poor";
};

function RestaurantCard({ res_data }) {
  const {
    id,
    name,
    cloudinaryImageId,
    avgRating,
    costForTwo,
    cuisines = [],
    areaName,
    sla,
  } = res_data?.info ?? {};

  return (
    <Link to={`/restaurants/${id}`} className="res-card">
      <div className="res-card-media">
        <img
          src={IMAGE_CDN + cloudinaryImageId}
          alt={name}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="res-card-body">
        <h3 className="res-card-name">{name}</h3>
        <p className="res-card-cuisines">{cuisines.join(", ")}</p>
        {areaName && <p className="res-card-area">{areaName}</p>}

        <div className="res-card-meta">
          <span
            className={`res-card-rating ${ratingClass(avgRating)}`}
            aria-label={avgRating ? `Rated ${avgRating} out of 5` : "Not rated"}
          >
            {avgRating ? `${avgRating} ★` : "New"}
          </span>
          {sla?.slaString && (
            <>
              <span className="dot" aria-hidden="true" />
              <span>{sla.slaString}</span>
            </>
          )}
          {costForTwo && (
            <>
              <span className="dot" aria-hidden="true" />
              {/* costForTwo already reads "₹250 for two", so no prefix */}
              <span>{costForTwo}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

/**
 * Higher-order component: tags a card as pure veg.
 * Kept as an HOC so the pattern stays visible in the codebase.
 */
export function withPromotedLabel(WrappedCard) {
  const PromotedCard = (props) => (
    <div className="res-card-wrap">
      <WrappedCard {...props} />
      <span className="res-card-veg">Pure Veg</span>
    </div>
  );

  PromotedCard.displayName = `withPromotedLabel(${
    WrappedCard.displayName || WrappedCard.name || "Component"
  })`;

  return PromotedCard;
}

export default RestaurantCard;
