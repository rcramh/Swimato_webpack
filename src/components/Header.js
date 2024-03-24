import React, {useState} from "react";
import { Link } from 'react-router-dom';
import App_logo from "../Assets/app_logo.png";
import useOnlineStatus from "../utils/useOnlineStatus";
import { useSelector } from "react-redux";



function Header(){

    const [loginButton, setLoginButton] = useState("Login");

    function setStatus(){
        if(loginButton === "Login")
            setLoginButton("Logout");
        else
            setLoginButton("Login");

    }

    const onlineSatus = useOnlineStatus();

    const cartItems = useSelector((store) => store.cart.items);
    console.log(cartItems);

    return (
        <div className = "navbar">
            <Link to="/" className="link"><img className = "logo" src={App_logo} alt="swimato_logo"></img></Link>
            <Link to="/" className="link"><h2>Home</h2></Link>
            <Link to="/about" className="link"><h2>About</h2></Link>
            <Link to="/contact" className="link"><h2>Contact</h2></Link>
            <Link to="/cart" className="link">  <h2>  Cart [{cartItems.length}] </h2></Link>
            {onlineSatus ? <h2>Online ✅</h2> : <h2>Offline 🔴</h2>}
            <button onClick={setStatus} className="login-button" >{loginButton}</button>
        </div>
        
    );
}

export default Header;