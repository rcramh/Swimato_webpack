import React,{useState,useEffect} from "react";
import { useParams } from "react-router-dom";
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
      // Dispatch an action (sending payload if required)
      dispatch(addItem(item));
    };
    const cartItems = useSelector((store) => store.cart.items);
    console.log(cartItems);
    useEffect(() => {
        fetchData();
      }, []);

      console.log(resId)
    
    const fetchData = async () => {
      // used proxy to resolve cors error, that's why initial swiggy.com is not in endpoint url in below fetch method
      const data = await fetch("/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=17.4107978&lng=78.341552&restaurantId=" + resId);
        
       const json = await data.json();
       console.log(json?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards[2]?.card?.card?.itemCards);
      
       setRestName(json?.data?.cards[0]?.card?.card?.info?.name);
       setRestDetail(json?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards[2]?.card?.card?.itemCards);
    };

    const image =  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/";   //new url


    if(restDetail === undefined || restDetail.length === 0){
      return (
        <h2>Loading ...</h2>
      )
    }
    return ( 
      <div >
        <div className="restaurant_menu_header">
          <div >
            <h1> {restName} </h1>
          </div>
          </div>
       
        {restDetail.map((item) => (
          <div key={item.card.info.id} className="food-container">
            <div className="food-details">
              <h2 className="food-name">{item.card.info.name}</h2>
              <p className="food-price">{"Rs "}{  (item.card.info.price / 100 || item.card.info.Price / 100 || item.card.info.defaultPrice / 100 )}</p>
            </div>
            <div className="food-image">
              <img src={(item.card.info.imageId === undefined) ? (image + "45900")  : (image + item.card.info.imageId)} alt="Food"/>
              <button 
                className="add-button"
                onClick = {() => handleAddItem(item)}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div> 
    );
}
export default RestaurantMenu;

