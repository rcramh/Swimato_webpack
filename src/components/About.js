import React, { useState, useEffect } from "react";

function About(){
    const [userData, setUserData] = useState(null);
    const url = "https://api.github.com/users/rcramh";

    useEffect( () => { 
        fetchData();
    }, [])

    
    const fetchData = async () => {
        const response = await fetch(url)
        const data = await response.json();

        setUserData(data);
    }

    if(userData === null){
        return(
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div>
            <h1>{userData.name}</h1>
            <img src={userData.avatar_url} alt="user_photo" />
        </div>
    

    );
}

export default About;

