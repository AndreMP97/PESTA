import React from 'react'
import { Redirect } from 'react-router-dom';

function Home(){
    if(localStorage.getItem("sessionID")) {
        return( 
            <Redirect to="/dashboard" />
        )
    }

    else {
        return (
            <Redirect to="/login" />
        )
    }
}

export default Home;