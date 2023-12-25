import React,{useState,useEffect} from "react";
import { Link } from 'react-router-dom';
import RestaurantCard, {withPromotedLabel}  from "./RestaurantCard";
import Shimmer from "./Shimmer";
import useOnlineStatus from "../utils/useOnlineStatus";
import swiggy_api_data_in_json from "../utils/Swiggy_api_data_in_json";



function Home(){

    const [listOfRestaurants, setListOfRestaurant] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchText, setSearchText] = useState("");

    const VegRestaurantCard = withPromotedLabel(RestaurantCard);

    useEffect(() => {
        setListOfRestaurant(json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
       setFilteredRestaurants(json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
      }, []);

    //To fetch live api data , commented here so that if swiggy api changes then no need to maintain code again and again.
    //-------------------------------------------
  //   useEffect(() => {
  //       fetchData();
  //     }, []);
    
  //   const fetchData = async () => {
  //     const data = await fetch(
  //       "https://corsproxy.io/?https://www.swiggy.com/dapi/restaurants/list/v5?lat=17.4107978&lng=78.341552&page_type=DESKTOP_WEB_LISTING"
  //     );
  // //cors prefix is added to allow 
  //      const json = await data.json();

  //      setListOfRestaurant(json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
  //      setFilteredRestaurants(json?.data?.cards[2]?.card?.card?.gridElements?.infoWithStyle?.restaurants);
  //   };
    //-------------------------------------------

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
    }

    function topRatedRestuarants()
    {
      const searched_rest = listOfRestaurants.filter((res) =>
              res.info.avgRating > 4
              );
      setFilteredRestaurants(searched_rest);
    }

    return (listOfRestaurants.length === 0) ? <Shimmer /> :
    (<div className = "Home">
        <div className="search">

            <div>
              <input 
                type="text"
                className="filter"
                placeholder="Seach for restaurants" 
                name="restaurant" 
                value={searchText}
                onChange={(event)=> setSearchText(event.target.value)} 
              />
              <button onClick={filterRestaurant}><b>Search</b></button>
            </div>

            <div>
                <button onClick={topRatedRestuarants}>Top Rated Restaurants</button>
            </div>
        </div>

        
        

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
    );
}

export default Home;



