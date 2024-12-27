import React from "react";
import { Link } from 'react-router-dom';
import App_logo from "../Assets/app_logo.png";
import useOnlineStatus from "../utils/useOnlineStatus";
import { useSelector } from "react-redux";


function Header(){
    const onlineSatus = useOnlineStatus();

    const cartItems = useSelector((store) => store.cart.items);

    return (
        <div className = "navbar">
            <div className="app_logo">
                <Link to="/" className="link"><img src={App_logo} alt="swimato_logo"></img></Link>
            </div>
            <div className="nav_items_parent_container">
                <div className="nav_items">
                    <div>
                        <Link to="/" className="link">Home</Link>
                    </div>
                    <div>
                        <Link to="/about" className="link">About</Link>
                    </div>
                    <div>
                        <Link to="/cart" className="link"> Cart [{cartItems.length}] </Link>
                    </div>
                    <div> {onlineSatus ? "Online"  : "Offline" } </div>
                </div>
                <div className="login_logout">
                    <Link to="/login" className="link">Sign In</Link>
                </div>    
            </div>
        </div>
        
    );
}

export default Header;