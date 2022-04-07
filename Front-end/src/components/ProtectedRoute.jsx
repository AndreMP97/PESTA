import React from 'react'
import { Route, Redirect, withRouter } from "react-router-dom";

function ProtectedRoute({ 
  component: Component,
  ...rest
}) {

    return (
        <Route
            {...rest}
            render={props => {
            if(localStorage.getItem("sessionID")) {
                return (
                    <Component {...props} />
                );
            } 
            else {
                return (
                    <Redirect to="/404" />
                );
            }
            }}
        />
    );
};

export default withRouter(ProtectedRoute);