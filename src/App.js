import React, {useState, useEffect , lazy, Suspense} from "react";
// import ReactDOM from "react-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Login/Signup";
import Error from "./components/Error";
import RestaurantMenu from "./components/RestaurantMenu";
import Checkout from "./components/Checkout";
import RouteTransition from "./components/RouteTransition";
import { PageShimmer } from "./components/Shimmer";
import UserContext from "./utils/UserContext";
import appStore from "./utils/appStore";
import {Provider} from "react-redux";

import { createBrowserRouter, Outlet} from "react-router-dom";

//Lazy loading : On demand loading of the components
const About = lazy( () => import("./components/About.js") );
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
                <UserContext.Provider value={{ userName }}>
                    <Header/ >
                    <RouteTransition>
                        <Outlet />
                    </RouteTransition>
                    <Footer />
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
                    element : (<Suspense fallback={<PageShimmer />} > <About /> </Suspense>),
                },
                {
                    path : "/cart",
                    element : (<Suspense fallback={<PageShimmer />} > <Cart /></Suspense>),
                },
                {
                    path : "/checkout",
                    element : <Checkout />,
                },
                {
                    path : "/login",
                    element : <Login />,
                },
                {
                    path : "/signup",
                    element : <Signup />,
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