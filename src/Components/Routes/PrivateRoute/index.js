import React from "react";
import { Redirect, Route } from "react-router-dom";
const PrivateRoute = (props) => {
    // if (localStorage.getItem("token")) {
    //     var token = JSON.parse(localStorage.getItem("token"));
    // }
    var token = localStorage.getItem('jwt');
    return (
        <Route
            render={() =>
                token !== null ? (
                    <>
                        <Route {...props} />
                    </>
                ) : (
                    <>
                        <Redirect to="/" />
                    </>
                )
            }
        />
    );
};
export default PrivateRoute;
