import React, {useState} from "react";
import { Link } from 'react-router-dom';
import App_logo from "../Assets/app_logo.png";
import useOnlineStatus from "../utils/useOnlineStatus";
import { useSelector } from "react-redux";


function Header(){
    const onlineSatus = useOnlineStatus();

    const cartItems = useSelector((store) => store.cart.items);
    console.log(cartItems);

    return (
        <div className = "navbar">
            <div className="app_logo">
                <Link to="/" className="link"><img src={App_logo} alt="swimato_logo"></img></Link>
            </div>
            <div className="nav_items">
                <Link to="/" className="link"><h2>Home</h2></Link>
                <Link to="/about" className="link"><h2>About</h2></Link>
                <Link to="/contact" className="link"><h2>Contact</h2></Link>
                <Link to="/cart" className="link">  <h2>  Cart [{cartItems.length}] </h2></Link>
                {onlineSatus ? <h2>Online ✅</h2> : <h2>Offline 🔴</h2>}
            </div>
            <div className="login_logout">
            <Link to="/login" className="link"><h2>Login</h2></Link>
            </div>    
        </div>
        
    );
}

export default Header;