import React, {useState, useEffect , lazy, Suspense} from "react";
// import ReactDOM from "react-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Error from "./components/Error";
import RestaurantMenu from "./components/RestaurantMenu";
import UserContext from "./utils/UserContext";
import appStore from "./utils/appStore";
import {Provider} from "react-redux";

import { createBrowserRouter, Outlet} from "react-router-dom";

//Lazy loading : On demand loading of the components
const About = lazy( () => import("./components/About.js") );
const Contact = lazy( () => import("./components/Contact.js") );
const Cart = lazy( () => import("./components/Cart.js") );


const AppLayout = () => {

    const [userName,setUserName] = useState("");

    //For Authentication
    useEffect(()=>{
    //Make an API call to send userName and password
        const data = {
        name : "Rahul Chaubey",
        };
        setUserName(data.name);
    },[]);

    return (
        <div>
            <Provider store = {appStore}>
                <UserContext.Provider value={{userName : "rc cr"}}>
                    <Header/ >
                    <Outlet />
                </UserContext.Provider >
            </Provider>
        </div>
    );
}

const router = createBrowserRouter(
    [
        {
            path : "/",
            element : <AppLayout />,
            children : 
            [
                {
                    path : "/",
                    element : <Home />,
                },
                {
                    path : "/about",
                    element : (<Suspense fallback={<h1>Loading...</h1>} > <About /> </Suspense>),
                },
                {
                    path : "/contact",
                    element : (<Suspense fallback={<h1>Loading...</h1>} > <Contact /></Suspense>),
                },
                {
                    path : "/cart",
                    element : (<Suspense fallback={<h1>Loading...</h1>} > <Cart /></Suspense>),
                },
                {
                    path : "/login",
                    element : <Login />,
                },
                {
                    path : "/restaurants/:resId",
                    element : <RestaurantMenu />,
                },

            ],
            errorElement: <Error />,
        },
    ]
);

export default router;