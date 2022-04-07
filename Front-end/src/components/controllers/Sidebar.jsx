import React from 'react';
import Auth from '../Sidebar_auth';
import NotAuth from '../Sidebar_notauth';


function Sidebar() {

    if(localStorage.getItem("sessionID")) {
        return (
            <Auth />
        );
    }
    else {
        return (
            <NotAuth />
        );
    }
}

export default Sidebar;