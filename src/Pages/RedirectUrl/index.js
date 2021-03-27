import React, { useEffect } from "react";

function RedirectUri (props){

    useEffect(() => {
        let {  } = props.match.params;
        let url = getParameterByName('redirecturi');
        let uid = getParameterByName('uid');
        if(uid !== "00"){
            localStorage.setItem("uid", uid);
        } else {
            localStorage.removeItem("uid");
        }
        if(url){
            props.history.push(url);
        }
    }, [props.match.params]);

    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    return(
        <div className="d-flex align-items-center justify-content-center" style={{height: "400px", width: "100%"}}>
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default RedirectUri;