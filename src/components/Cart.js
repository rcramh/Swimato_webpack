import React, { useContext, useState } from "react";
//import UserContext from "../utils/UserContext";
import { clearCart } from "../utils/cartSlice";
import { useSelector, useDispatch } from "react-redux";


function Cart(){

    // const loggedInUser = useContext(UserContext);
    // const userName = loggedInUser.userName;

    //subscribing to the part of the store
    const cartItems = useSelector((store) => store.cart.items);
    console.log(cartItems);

    const dispatch = useDispatch();

    const handleAddItem = () => {
        
    }

    const handleClearCart = () => {
        dispatch(clearCart());
    }

    return (
        <div>
            {(cartItems.length === 0) ? <div>
                <h3> Please add items into the cart ...</h3>
            </div> :

            <div className="resMenu">
                <div className="clearCart">
                    <button onClick = {() => handleClearCart()}>
                    Clear Cart
                    </button>
                </div>

                <div className="clearCart">
                    <button >
                    Checkout
                    </button>
                </div>
            
                <ul>
                {cartItems.map((item) => (
                <li key={item.card.info.id}>
                    <div className="dishDetails">
                        {item.card.info.name} -{" Rs."}
                        {item.card.info.price / 100 || item.card.info.defaultPrice / 100}
                    </div>
                    <div className="dishAdd">
                        <button onClick = {() => handleAddItem(item)}>
                        ADD +
                        </button>
                    </div>
                </li>
                ))}
                </ul>
            
                
            </div> 

            }
        
        </div>
    );
}

export default Cart;

