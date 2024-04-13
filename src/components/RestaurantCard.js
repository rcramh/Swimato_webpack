import React from "react";

function RestaurantCard(props){
    
    const {name, cloudinaryImageId, avgRating , costForTwo }= props?.res_data?.info;
    
    const resImg = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/"+cloudinaryImageId;

    // const resImg = "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_508,h_320,c_fill/"+cloudinaryImageId;
    
    return (
        <div className="card_container">
            <div className="restImage_container">
                <img src={resImg} alt="Res_logo" ></img>
            </div> 
            <div className="restName"> {name}</div>
            <div className="restRating"> {avgRating}★</div>
            <div className="costForTwo"> RS.{costForTwo} </div>
            
        </div>
    );
}

export function withPromotedLabel(RestaurantCard){

    return (props) => {
        return (
        <div className="card">
            <label><h3>Veg</h3></label>
            <RestaurantCard {...props}/>
        </div>
    );
    };
}

export default RestaurantCard;

