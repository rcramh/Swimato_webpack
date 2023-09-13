import React ,{useContext} from "react";
import UserContext from "../utils/UserContext"
import {addItem} from "../utils/cartSlice";

function Contact(){

    const loggedInUser = useContext(UserContext);
    const userName = loggedInUser.userName;

    // const dispatch = useDispatch();


    return (
        <div>
            <h1>Welcome to Contact us page</h1>
            <h2>loggedin user is {userName}</h2>
            
        </div>
    );
}

export default Contact;

