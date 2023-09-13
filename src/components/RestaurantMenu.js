import React,{useState,useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import { addItem } from "../utils/cartSlice";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";


function RestaurantMenu(){

    const [restName , setRestName] = useState("");
    const [restDetail , setRestDetail] = useState([]);

    //get the dynamic resId (route param)
    const { resId } = useParams();

    //updating to the slice of the store
    const dispatch = useDispatch();

    const handleAddItem = (item) => {
      // Dispatch an action
      dispatch(addItem(item));
    };

    const cartItems = useSelector((store) => store.cart.items);
    console.log(cartItems);

    useEffect(() => {
        fetchData();
      }, []);
    
    const fetchData = async () => {
      const data = await fetch(
        "https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=17.4107978&lng=78.341552&restaurantId=" + resId
      );
  
       const json = await data.json();
        
       setRestName(json?.data?.cards[0]?.card?.card?.info?.name);
       setRestDetail(json?.data?.cards[2]?.groupedCard?.cardGroupMap?.REGULAR?.cards[1]?.card?.card?.itemCards);

    };
    //json?.data?.cards[2]?.groupedCard?.cardGroupMap?.REGULAR?.cards[9]?.card?.card?.name
    //console.log(restDetail);


    return (
      <div className="resMenu">
        <h1> {restName} </h1>
        <h2>Menu</h2>
        <ul>
        {restDetail.map((item) => (
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
    );
}

export default RestaurantMenu;