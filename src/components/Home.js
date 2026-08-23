import React, { useEffect, useMemo, useRef, useState } from "react";
import RestaurantCard, { withPromotedLabel } from "./RestaurantCard";
import Shimmer from "./Shimmer";
import useOnlineStatus from "../utils/useOnlineStatus";
import swiggy_api_data_in_json from "../utils/HydAndGurgaon";
import "./Home.css";

// Built once at module scope. Creating it inside the component would make a
// brand new component type on every render, remounting every card.
const VegRestaurantCard = withPromotedLabel(RestaurantCard);

// Swiggy blocks direct API calls from the browser, so the listing is served
// from a captured response committed under src/utils.
const readRestaurants = () =>
  swiggy_api_data_in_json?.data?.cards?.[2]?.card?.card?.gridElements
    ?.infoWithStyle?.restaurants ?? [];

// "₹250 for two" -> 250
const parseCost = (costForTwo) =>
  parseInt(String(costForTwo ?? "").replace(/[^0-9]/g, ""), 10) || 0;

const TOP_RATING = 4.5;
const FAST_DELIVERY_MINS = 30;

const COST_BANDS = {
  any: () => true,
  budget: (cost) => cost > 0 && cost < 300,
  mid: (cost) => cost >= 300 && cost <= 500,
  premium: (cost) => cost > 500,
};

const COST_LABELS = {
  any: "Any price",
  budget: "Under ₹300",
  mid: "₹300 to ₹500",
  premium: "Over ₹500",
};

const SORTS = {
  relevance: null,
  rating: (a, b) => (b.info.avgRating ?? 0) - (a.info.avgRating ?? 0),
  delivery: (a, b) =>
    (a.info.sla?.deliveryTime ?? Infinity) - (b.info.sla?.deliveryTime ?? Infinity),
  costAsc: (a, b) => parseCost(a.info.costForTwo) - parseCost(b.info.costForTwo),
  costDesc: (a, b) => parseCost(b.info.costForTwo) - parseCost(a.info.costForTwo),
};

const SORT_LABELS = {
  relevance: "Featured",
  rating: "Rating: high to low",
  delivery: "Fastest delivery",
  costAsc: "Cost: low to high",
  costDesc: "Cost: high to low",
};

const DEFAULT_FILTERS = {
  diet: "all", // all | veg | nonveg
  cuisine: "all",
  cost: "any",
  topRated: false,
  fastDelivery: false,
  sort: "relevance",
};

const matchesQuery = ({ info }, needle) =>
  [info.name, info.areaName, ...(info.cuisines ?? [])]
    .join(" ")
    .toLowerCase()
    .includes(needle);

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const searchRef = useRef(null);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    setRestaurants(readRestaurants());
    setIsLoading(false);
  }, []);

  // "/" jumps to the search box, the way most catalogue UIs behave.
  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return;

      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      event.preventDefault();
      searchRef.current?.focus();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const cuisineOptions = useMemo(() => {
    const counts = new Map();

    restaurants.forEach(({ info }) =>
      (info.cuisines ?? []).forEach((cuisine) =>
        counts.set(cuisine, (counts.get(cuisine) ?? 0) + 1),
      ),
    );

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([cuisine, count]) => ({ cuisine, count }));
  }, [restaurants]);

  const trimmedQuery = searchText.trim();

  const visibleRestaurants = useMemo(() => {
    const needle = trimmedQuery.toLowerCase();
    const withinBand = COST_BANDS[filters.cost];

    const result = restaurants.filter((restaurant) => {
      const { info } = restaurant;

      if (needle && !matchesQuery(restaurant, needle)) return false;
      if (filters.diet === "veg" && !info.veg) return false;
      if (filters.diet === "nonveg" && info.veg) return false;
      if (filters.cuisine !== "all" && !info.cuisines?.includes(filters.cuisine))
        return false;
      if (!withinBand(parseCost(info.costForTwo))) return false;
      if (filters.topRated && (info.avgRating ?? 0) < TOP_RATING) return false;
      if (
        filters.fastDelivery &&
        (info.sla?.deliveryTime ?? Infinity) > FAST_DELIVERY_MINS
      )
        return false;

      return true;
    });

    const comparator = SORTS[filters.sort];
    return comparator ? [...result].sort(comparator) : result;
  }, [restaurants, trimmedQuery, filters]);

  const activeFilterCount = Object.keys(DEFAULT_FILTERS).filter(
    (key) => key !== "sort" && filters[key] !== DEFAULT_FILTERS[key],
  ).length;

  const hasRefinements = activeFilterCount > 0 || Boolean(trimmedQuery);

  const resetAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchText("");
  };

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const toggleFilter = (key) =>
    setFilters((current) => ({ ...current, [key]: !current[key] }));

  if (!isOnline) {
    return (
      <div className="home">
        <div className="home-state">
          <h2>You&apos;re offline</h2>
          <p>
            Check your internet connection. The restaurant list will come back
            as soon as you reconnect.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) return <Shimmer />;

  return (
    <div className="home">
      <div className="home-searchbar">
        <span className="home-search-icon" aria-hidden="true">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="m20 20-3.6-3.6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <input
          ref={searchRef}
          type="text"
          className="home-search-input"
          placeholder="Search for a restaurant, cuisine or area"
          aria-label="Search for a restaurant, cuisine or area"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSearchText("");
          }}
          autoComplete="off"
        />

        {searchText ? (
          <button
            type="button"
            className="home-search-clear"
            onClick={() => setSearchText("")}
            aria-label="Clear search"
          >
            &times;
          </button>
        ) : (
          <kbd className="home-search-kbd" aria-hidden="true">
            /
          </kbd>
        )}
      </div>

      <div className="home-filters">
        <div className="segmented" role="group" aria-label="Dietary preference">
          {[
            { value: "all", label: "All" },
            { value: "veg", label: "Pure Veg" },
            { value: "nonveg", label: "Non-veg" },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={filters.diet === value ? "is-active" : ""}
              aria-pressed={filters.diet === value}
              onClick={() => updateFilter("diet", value)}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`filter-chip ${filters.topRated ? "is-active" : ""}`}
          aria-pressed={filters.topRated}
          onClick={() => toggleFilter("topRated")}
        >
          Rated {TOP_RATING}+
        </button>

        <button
          type="button"
          className={`filter-chip ${filters.fastDelivery ? "is-active" : ""}`}
          aria-pressed={filters.fastDelivery}
          onClick={() => toggleFilter("fastDelivery")}
        >
          Under {FAST_DELIVERY_MINS} mins
        </button>

        <label className="filter-select">
          <span className="sr-only">Cuisine</span>
          <select
            value={filters.cuisine}
            onChange={(event) => updateFilter("cuisine", event.target.value)}
          >
            <option value="all">All cuisines</option>
            {cuisineOptions.map(({ cuisine, count }) => (
              <option key={cuisine} value={cuisine}>
                {cuisine} ({count})
              </option>
            ))}
          </select>
        </label>

        <label className="filter-select">
          <span className="sr-only">Price for two</span>
          <select
            value={filters.cost}
            onChange={(event) => updateFilter("cost", event.target.value)}
          >
            {Object.entries(COST_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-select is-sort">
          <span className="sr-only">Sort by</span>
          <select
            value={filters.sort}
            onChange={(event) => updateFilter("sort", event.target.value)}
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="home-resultbar">
        <p aria-live="polite">
          <strong>{visibleRestaurants.length}</strong>{" "}
          {visibleRestaurants.length === 1 ? "restaurant" : "restaurants"}
          {trimmedQuery && <> for &ldquo;{trimmedQuery}&rdquo;</>}
        </p>

        {hasRefinements && (
          <button type="button" className="home-reset" onClick={resetAll}>
            Reset{activeFilterCount > 0 && ` (${activeFilterCount})`}
          </button>
        )}
      </div>

      {visibleRestaurants.length === 0 ? (
        <div className="home-state">
          <h2>No restaurants match</h2>
          <p>Try widening the price range or clearing a filter or two.</p>
          <button type="button" onClick={resetAll}>
            Reset everything
          </button>
        </div>
      ) : (
        <ul className="home-grid">
          {visibleRestaurants.map((restaurant) => {
            const Card = restaurant.info.veg ? VegRestaurantCard : RestaurantCard;

            return (
              <li key={restaurant.info.id}>
                <Card res_data={restaurant} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Home;
