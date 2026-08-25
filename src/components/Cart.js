import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  removeItem,
  deleteItem,
  clearCart,
  selectCartItems,
  selectCartCount,
  selectCartTotalPaise,
} from "../utils/cartSlice";
import "./Cart.css";

const CDN =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508/";
const FALLBACK_IMAGE_ID = "45900";

// order maths, all in paise so nothing drifts on the rounding
const DELIVERY_FEE_PAISE = 3900;
const FREE_DELIVERY_OVER_PAISE = 49900;
const GST_RATE = 0.05;

const rupees = (paise) => Math.round(paise / 100).toLocaleString("en-IN");

function Cart() {
  const cartItems = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartCount);
  const itemTotal = useSelector(selectCartTotalPaise);

  const dispatch = useDispatch();

  const bill = useMemo(() => {
    const delivery =
      itemTotal >= FREE_DELIVERY_OVER_PAISE ? 0 : DELIVERY_FEE_PAISE;
    const taxes = Math.round(itemTotal * GST_RATE);

    return {
      delivery,
      taxes,
      total: itemTotal + delivery + taxes,
      toFreeDelivery: Math.max(FREE_DELIVERY_OVER_PAISE - itemTotal, 0),
    };
  }, [itemTotal]);

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <div className="cart-empty">
          <span className="cart-empty-art" aria-hidden="true">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 8h14l-1.2 11.1A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.9L5 8Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M9 8V6.5a3 3 0 1 1 6 0V8"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <h1>Your cart is empty</h1>
          <p>
            Nothing here yet. Pick a restaurant and add a few dishes — they will
            show up right here.
          </p>
          <Link to="/" className="cart-btn is-primary">
            Browse restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <header className="cart-head">
        <div>
          <h1>Your cart</h1>
          <p className="cart-head-sub">
            {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
            {cartItems.length} {cartItems.length === 1 ? "dish" : "dishes"}
          </p>
        </div>

        <button
          type="button"
          className="cart-btn is-ghost"
          onClick={() => dispatch(clearCart())}
        >
          Clear cart
        </button>
      </header>

      <div className="cart-grid">
        <ul className="cart-lines">
          {cartItems.map((item) => (
            <li className="cart-line" key={item.id}>
              <img
                className="cart-line-img"
                src={CDN + (item.imageId ?? FALLBACK_IMAGE_ID)}
                alt=""
                loading="lazy"
              />

              <div className="cart-line-body">
                <span
                  className={`veg-mark ${item.isVeg ? "" : "is-nonveg"}`}
                  title={item.isVeg ? "Veg" : "Non-veg"}
                />
                <h2 className="cart-line-name">{item.name}</h2>
                <p className="cart-line-unit">₹{rupees(item.pricePaise)} each</p>

                <button
                  type="button"
                  className="cart-line-remove"
                  onClick={() => dispatch(deleteItem(item.id))}
                >
                  Remove
                </button>
              </div>

              <div className="cart-line-side">
                <div className="qty-stepper">
                  <button
                    type="button"
                    onClick={() => dispatch(removeItem(item.id))}
                    aria-label={`Remove one ${item.name}`}
                  >
                    &minus;
                  </button>
                  <span className="qty-value" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => dispatch(addItem(item))}
                    aria-label={`Add one more ${item.name}`}
                  >
                    +
                  </button>
                </div>

                <p className="cart-line-total">
                  ₹{rupees(item.pricePaise * item.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <aside className="cart-summary" aria-label="Bill details">
          <h2 className="cart-summary-title">Bill details</h2>

          <dl className="cart-bill">
            <div>
              <dt>
                Item total
                <em>
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </em>
              </dt>
              <dd>₹{rupees(itemTotal)}</dd>
            </div>

            <div>
              <dt>Delivery fee</dt>
              <dd className={bill.delivery === 0 ? "is-free" : ""}>
                {bill.delivery === 0 ? "FREE" : `₹${rupees(bill.delivery)}`}
              </dd>
            </div>

            <div>
              <dt>
                Taxes and charges<em>GST 5%</em>
              </dt>
              <dd>₹{rupees(bill.taxes)}</dd>
            </div>
          </dl>

          <div className="cart-total">
            <span>To pay</span>
            <span>₹{rupees(bill.total)}</span>
          </div>

          {bill.toFreeDelivery > 0 && (
            <p className="cart-nudge">
              Add ₹{rupees(bill.toFreeDelivery)} more for free delivery.
            </p>
          )}

          <Link to="/checkout" className="cart-btn is-primary is-block">
            Proceed to checkout
          </Link>

          <Link to="/" className="cart-keep-shopping">
            Add more items
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
