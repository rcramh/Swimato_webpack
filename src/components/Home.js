import React,{useState,useEffect} from "react";
import { Link } from 'react-router-dom';
import RestaurantCard, {withPromotedLabel}  from "./RestaurantCard";
import Shimmer from "./Shimmer";
import useOnlineStatus from "../utils/useOnlineStatus";
// import swiggy_api_data_in_json from "../utils/Swiggy_api_data_in_json";
import swiggy_api_data_in_json from "../utils/HydAndGurgaon";

function Home(){

    const [listOfRestaurants, setListOfRestaurant] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchText, setSearchText] = useState("");

    const VegRestaurantCard = withPromotedLabel(RestaurantCard);

    useEffect(() => {
      setListOfRestaurant(swiggy_api_data_in_json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
      setFilteredRestaurants(swiggy_api_data_in_json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
      }, []);
    

    //swiggy website blocked the api data fetch ,so using loacal json data file that are fetched from api
    
    // const fetchData = async () => {
    //   const data = await fetch(
    //     "https://www.swiggy.com/dapi/restaurants/list/v5?lat=17.4107978&lng=78.341552&page_type=DESKTOP_WEB_LISTING"
    //   );
  
    //    const json = await data.json();

    //    setListOfRestaurant(json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
    //    setFilteredRestaurants(json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants);

    // };

       
    const onlineStatus = useOnlineStatus();

    //console.log(onlineStatus);
    if (onlineStatus === false)
    return (
      <h1>
        Looks like you're offline!! Please check your internet connection;
      </h1>
    );

    function filterRestaurant()
    {
      const searched_rest = listOfRestaurants.filter((res) =>
                res.info.name.toLowerCase().includes(searchText.toLowerCase())
              );
      setFilteredRestaurants(searched_rest);
      setSearchText("");
    }

    // function quickSearch(event){

    //   const input_text = event.target.value ;
    //   setSearchText(input_text);

    //   const searched_restro = listOfRestaurants.filter((res) =>
    //             res.info.name.toLowerCase().includes(input_text.toLowerCase())
    //           );
    //   setFilteredRestaurants(searched_restro);

    // }

    // it handles search on enter/return button click
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        filterRestaurant();
      }
    };

    // function topRatedRestuarants()
    // {
    //   const searched_rest = listOfRestaurants.filter((res) =>
    //           res.info.avgRating > 4
    //           );
    //   setFilteredRestaurants(searched_rest);
    // }

    return (listOfRestaurants.length === 0) ? <Shimmer /> :
    (
    <>
      <div className="search-container">

        <input 
          type="text"
          className="search-input"
          placeholder="Seach for restaurants" 
          name="restaurant" 
          value={searchText}
          // onChange={(event)=> quickSearch(event)}
          onKeyDown={handleKeyPress}
          onChange={(event)=> setSearchText(event.target.value)} 
        />
        <button onClick={filterRestaurant} className="search-button"><b>Search</b></button>
     
      </div>

    <div className = "all_card_container">
        {
          filteredRestaurants.map( (restaurantDoc) => (
            <Link 
            className="link"
            key={restaurantDoc.info.id}
            to={"/restaurants/" + restaurantDoc.info.id}
            >

            { (restaurantDoc.info.veg) ? (<VegRestaurantCard res_data = {restaurantDoc} />) :
                                            (<RestaurantCard res_data = {restaurantDoc} />)
            }

            </Link>
          ))
        }
      </div>

      </>
    );
}

export default Home;











