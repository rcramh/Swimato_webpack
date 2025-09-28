import React,{useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import { addItem } from "../utils/cartSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Rest_menu_api_data from "../utils/Rest_menu_api_data";

function RestaurantMenu(){
    const [restName , setRestName] = useState("");
    const [restDetail , setRestDetail] = useState([]);
    const [itemCategory , setItemCategory] = useState([]);
    const [controller, setController] = useState(
      [
        false, false, false,true,false,false,false,
        false, false, false,false,false,false,false
      ]
      );
    const tempor = [false,false,false,false,false,false,false,false,false,false,false,false,false,false];

    //get the dynamic resId (route param)
    const { resId } = useParams();

    //updating to the slice of the store
    const dispatch = useDispatch();
    const handleAddItem = (item) => {
      // Dispatch an action (sending payload if required)
      dispatch(addItem(item));
    };


    console.log(resId)

    const handleClick = (event, i) => {
        let temp = tempor;
        if(controller[i] === true){
          temp[i] = false;
        }
        else{
          temp[i] = true;
        }
        setController(temp);
    }

    useEffect(() => {
        fetchData();
      }, []);

    const fetchData = async () => {
      //  const data = await fetch("https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=17.4107978&lng=78.341552&restaurantId=" + resId);
      //  const json = await data.json();
      //  console.log(json?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards[2]?.card?.card?.itemCards);
      
      //  setRestName(json?.data?.cards[0]?.card?.card?.info?.name);
      //  setRestDetail(json?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards[2]?.card?.card?.itemCards);
                          // data.cards[4].groupedCard.cardGroupMap.REGULAR.cards[3].card.card.itemCards[0].card.info.name

        setRestName(Rest_menu_api_data[0]?.data?.cards[0]?.card?.card?.info?.name); 
        setRestDetail(Rest_menu_api_data[0]?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards[2]?.card?.card?.itemCards);
        setItemCategory(Rest_menu_api_data[0]?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards);           
                         
    };
   
  //  console.log(`total catogory is ${itemCategory.length}`);
    
  const image =  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/";   //new url


    if(restDetail === undefined || restDetail.length === 0){
      return (
        <h2>Loading ...</h2>
      )
    }
    return ( 
      <div >
        <div className="restaurant_menu_header">
            <h1> {restName} Restaurant </h1>
        </div>

        <div className="search-container">
          <input type="text" placeholder="Search for dishes" className="search-input" />
          <button className="search-button ">Search</button>
        </div>

        <div className="menu_item_container">
          {itemCategory.map( (category,index1) => (
            <div key={index1}>
              <div className="dish_category" onClick={ ( event,index=index1) => handleClick(event, index)}>
                  { (index1>2 && index1<=7) && 
                  <div className="div_category_box">
                    <div> {category?.card?.card?.title} ({category?.card?.card?.itemCards?.length})</div> 
                    <div className="donwArrow" > &#9013; </div>
                  </div>
                  }
              </div>
              

              {(controller[index1]) && (index1>2 && index1<=7) &&  category?.card?.card?.itemCards.map((item, i) => (
                    <div>
                      {
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
                      }
                    
                    </div>
                    ))
              }
            </div>
          ))
          }  
        </div>
                   
      </div> 
    );
}
export default RestaurantMenu;

