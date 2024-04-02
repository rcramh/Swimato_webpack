import React, { useContext, useState } from "react";
//import UserContext from "../utils/UserContext";
import { removeItem,clearCart } from "../utils/cartSlice";
import { useSelector, useDispatch } from "react-redux";


function Cart(){

    // const loggedInUser = useContext(UserContext);
    // const userName = loggedInUser.userName;

    //subscribing to the part of the store
    const cartItems = useSelector((store) => store.cart.items);
    // console.log(cartItems);

    const dispatch = useDispatch();

    //no need remove it, instead add remove item from cart
    const handleRemoveItem = () => {
        dispatch(removeItem());
    }

    const handleClearCart = () => {
        dispatch(clearCart());
    }
    

    const image =  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1024/";

    return (
        <div>
            {(cartItems.length === 0) ? <div>
                <h2> Please add items into the cart ...</h2>
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

                {cartItems.map((item) => (
                    <div key={item.card.info.id} className="food-container">

                        <div className="food-details">
                        <h2 className="food-name">{item.card.info.name}</h2>
                        <p className="food-price">{"Rs "}{  (item.card.info.price / 100 || item.card.info.Price / 100 || item.card.info.defaultPrice / 100)}</p>
                        </div>

                        <div className="food-image">
                            <img src={(item.card.info.imageId === undefined) ? (image + "45900")  : (image + item.card.info.imageId)} alt="Food"/>
                            <button 
                            className="add-button"
                            onClick = {() => handleRemoveItem(item)}
                            >
                                Remove
                            </button>
                        </div>


                    </div>

                    ))
                }
            
                
            </div> 

            }
        
        </div>
    );
}

export default Cart;
