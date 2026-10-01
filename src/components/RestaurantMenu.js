import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, selectCartItems } from "../utils/cartSlice";
import listing from "../utils/HydAndGurgaon";
import { readApiError } from "../utils/apiSlice";
import { useGetRestaurantMenuQuery } from "../utils/restaurantApi";
import "./RestaurantMenu.css";
import "./Shimmer.css";

const CDN =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508/";
const FALLBACK_IMAGE_ID = "45900";

const readListing = () =>
  listing?.data?.cards?.[2]?.card?.card?.gridElements?.infoWithStyle
    ?.restaurants ?? [];

const NO_CATEGORIES = [];

const rupees = (paise) => Math.round(paise / 100);

function RestaurantMenu() {
  const { resId } = useParams();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [openCategories, setOpenCategories] = useState(() => new Set());

  // The header (name, rating, delivery time) still comes from the local
  // listing; the menu itself is fetched from the API.
  const restaurant = useMemo(() => {
    const match = readListing().find(({ info }) => info.id === resId);
    return match?.info ?? null;
  }, [resId]);

  const {
    data: menu,
    error: menuError,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetRestaurantMenuQuery(resId, { skip: !restaurant });

  const categories = menu?.categories ?? NO_CATEGORIES;

  // Open the first category once the data is in.
  useEffect(() => {
    if (categories.length) setOpenCategories(new Set([categories[0].id]));
  }, [categories]);

  const needle = query.trim().toLowerCase();

  const visibleCategories = useMemo(() => {
    if (!needle && !vegOnly) return categories;

    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          if (vegOnly && !item.isVeg) return false;
          if (!needle) return true;
          return `${item.name} ${item.description ?? ""}`
            .toLowerCase()
            .includes(needle);
        }),
      }))
      .filter((category) => category.items.length);
  }, [categories, needle, vegOnly]);

  // While filtering, everything that still matches should be visible.
  const isFiltering = Boolean(needle) || vegOnly;

  const dishCount = visibleCategories.reduce(
    (total, category) => total + category.items.length,
    0,
  );

  // id -> quantity, so each dish can show its own count without walking
  // the cart once per row
  const quantities = useMemo(
    () =>
      cartItems.reduce((map, entry) => {
        map[entry.id] = entry.quantity;
        return map;
      }, {}),
    [cartItems],
  );

  const toggleCategory = (categoryId) =>
    setOpenCategories((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });

  if (!restaurant) {
    return (
      <div className="menu">
        <div className="menu-empty">
          <h2>Restaurant not found</h2>
          <p>We couldn&apos;t find a restaurant with that id.</p>
          <Link to="/" className="menu-btn">
            Back to all restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="menu">
      <nav className="menu-crumbs" aria-label="Breadcrumb">
        <Link to="/">Restaurants</Link>
        <span aria-hidden="true">›</span>
        <span>{restaurant.name}</span>
      </nav>

      <header className="menu-hero">
        <img
          className="menu-hero-img"
          src={CDN + restaurant.cloudinaryImageId}
          alt=""
          loading="lazy"
        />

        <div className="menu-hero-body">
          <h1 className="menu-hero-name">{restaurant.name}</h1>
          <p className="menu-hero-cuisines">
            {(restaurant.cuisines ?? []).join(", ")}
          </p>
          <p className="menu-hero-area">
            {restaurant.areaName}
            {restaurant.locality ? `, ${restaurant.locality}` : ""}
          </p>

          <div className="menu-hero-stats">
            {restaurant.avgRating && (
              <span className="menu-stat is-rating">
                {restaurant.avgRating} ★<em>{restaurant.totalRatingsString}</em>
              </span>
            )}
            {restaurant.sla?.slaString && (
              <span className="menu-stat">
                {restaurant.sla.slaString}
                <em>delivery</em>
              </span>
            )}
            {restaurant.costForTwo && (
              <span className="menu-stat">
                {restaurant.costForTwo.replace(" for two", "")}
                <em>for two</em>
              </span>
            )}
          </div>
        </div>
      </header>

      {menu?.isSample && (
        <p className="menu-datanote">
          Only one menu was captured from the Swiggy API, so the dishes below
          are sample data from {menu.menuOf.name}.
        </p>
      )}

      {isLoading ? (
        <MenuSkeleton />
      ) : isError ? (
        <MenuError
          error={menuError}
          onRetry={refetch}
          isRetrying={isFetching}
        />
      ) : (
        <>
          <div className="menu-toolbar">
            <div className="menu-search">
              <span className="menu-search-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="m20 20-3.6-3.6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === "Escape" && setQuery("")}
                placeholder="Search dishes"
                aria-label="Search dishes"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  className="menu-search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear dish search"
                >
                  &times;
                </button>
              )}
            </div>

            <label className="veg-switch">
              {/* a real checkbox with role=switch, so it is keyboard and
              screen-reader operable; the visuals are the spans below */}
              <input
                type="checkbox"
                role="switch"
                checked={vegOnly}
                onChange={(event) => setVegOnly(event.target.checked)}
              />
              <span className="veg-switch-track" aria-hidden="true">
                <span className="veg-switch-knob" />
              </span>
              <span className="veg-switch-text">
                <span className="veg-mark" aria-hidden="true" />
                Veg only
              </span>
            </label>

            <p className="menu-count">
              {dishCount} {dishCount === 1 ? "dish" : "dishes"}
            </p>
          </div>

          {visibleCategories.length === 0 ? (
            <div className="menu-empty">
              <h2>No dishes match</h2>
              <p>Try a different search, or switch off the veg filter.</p>
              <button
                type="button"
                className="menu-btn"
                onClick={() => {
                  setQuery("");
                  setVegOnly(false);
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="menu-list">
              {visibleCategories.map((category) => {
                const isOpen = isFiltering || openCategories.has(category.id);

                return (
                  <section className="menu-category" key={category.id}>
                    <h2>
                      <button
                        type="button"
                        className="menu-category-head"
                        aria-expanded={isOpen}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <span>
                          {category.title}
                          <em>({category.items.length})</em>
                        </span>
                        <span
                          className={`menu-chevron ${isOpen ? "is-open" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                    </h2>

                    {isOpen && (
                      <ul className="menu-items">
                        {category.items.map((item) => {
                          const inCart = quantities[String(item.id)] ?? 0;

                          return (
                            <li className="menu-item" key={item.id}>
                              <div className="menu-item-body">
                                <span
                                  className={`veg-mark ${item.isVeg ? "" : "is-nonveg"}`}
                                  title={item.isVeg ? "Veg" : "Non-veg"}
                                />
                                <h3>{item.name}</h3>
                                <p className="menu-item-price">
                                  ₹{rupees(item.pricePaise)}
                                </p>
                                {item.rating && (
                                  <p className="menu-item-rating">
                                    {item.rating} ★
                                  </p>
                                )}
                                {item.description && (
                                  <p className="menu-item-desc">
                                    {item.description}
                                  </p>
                                )}
                              </div>

                              <div className="menu-item-media">
                                <img
                                  src={
                                    CDN + (item.imageId ?? FALLBACK_IMAGE_ID)
                                  }
                                  alt=""
                                  loading="lazy"
                                />
                                {inCart > 0 ? (
                                  <div className="qty-stepper menu-qty">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        dispatch(removeItem(item.id))
                                      }
                                      aria-label={`Remove one ${item.name}`}
                                    >
                                      &minus;
                                    </button>
                                    <span
                                      className="qty-value"
                                      aria-live="polite"
                                    >
                                      {inCart}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => dispatch(addItem(item))}
                                      aria-label={`Add one more ${item.name}`}
                                    >
                                      +
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    className="menu-add"
                                    onClick={() => dispatch(addItem(item))}
                                  >
                                    Add
                                  </button>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* Placeholder in the shape of the menu, so nothing jumps when it loads. */
function MenuSkeleton() {
  return (
    <div className="menu-skeleton" role="status" aria-live="polite">
      <span className="sr-only">Loading menu…</span>
      <div className="shimmer-line menu-skeleton-toolbar" aria-hidden="true" />
      {[0, 1, 2].map((category) => (
        <div
          className="menu-skeleton-category"
          key={category}
          aria-hidden="true"
        >
          <div className="shimmer-line menu-skeleton-title" />
          {[0, 1].map((item) => (
            <div className="menu-skeleton-item" key={item}>
              <div className="menu-skeleton-text">
                <div className="shimmer-line w-60" />
                <div className="shimmer-line w-40" />
                <div className="shimmer-line w-80" />
              </div>
              <div className="shimmer-block menu-skeleton-img" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function MenuError({ error, onRetry, isRetrying }) {
  const { code, message } = readApiError(error);

  // No menu exists: retrying cannot help, so don't offer it.
  if (code === "MENU_NOT_FOUND") {
    return (
      <div className="menu-empty" role="status">
        <h2>Menu not available yet</h2>
        <p>This restaurant hasn&apos;t published its menu. Check back later.</p>
        <Link to="/" className="menu-btn">
          Browse other restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="menu-empty menu-error" role="alert">
      <h2>Couldn&apos;t load the menu</h2>
      <p>{message}</p>
      <button
        type="button"
        className="menu-btn is-primary"
        onClick={onRetry}
        disabled={isRetrying}
      >
        {isRetrying ? "Retrying…" : "Try again"}
      </button>
    </div>
  );
}

export default RestaurantMenu;
