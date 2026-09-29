import React, {lazy, Suspense} from "react";
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
import RequireAuth from "./components/RequireAuth";
import { PageShimmer } from "./components/Shimmer";

import { createBrowserRouter, Outlet} from "react-router-dom";

//Lazy loading : On demand loading of the components
const About = lazy( () => import("./components/About.js") );
const Cart = lazy( () => import("./components/Cart.js") );


// The Redux Provider sits in index.js, above the router, and the signed-in
// user comes from the auth slice (restored from the session on startup).
const AppLayout = () => {
    return (
        <div>
            <Header/ >
            <RouteTransition>
                <Outlet />
            </RouteTransition>
            <Footer />
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
                    element : (<RequireAuth> <Checkout /> </RequireAuth>),
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