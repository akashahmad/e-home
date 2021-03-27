import React, { useEffect, useState }  from "react";
import logo from '../../../assets/images/LogoeHome.png';

import "./index.css";
import axios from "axios";

function AdviserCards(){

    const [data, setData] = useState(null);
    useEffect( () => {
        let id = localStorage.getItem("uid");
        if(id){
            axios.get("https://ehomeoffer.wpengine.com/index.php?rest_route=/advisors/get/agents/uid="+id).then(res => {
                setData(res.data);
            });
        }
    }, []);
    return (
        <div className="d-flex flex-column mt-2">
            <div className="ecard card p-1 w-50">
                <div className="d-flex justify-content-center py-2 top ">
                    <div>
                        <img src={logo} className="elogo" alt=""/>
                    </div>
                    <p>eHomeoffer: Advisor</p>
                </div>
                {
                    data &&
                    <div className="d-flex align-items-center pl-2">
                        <img src={data.agentImage} className="customImage" alt=""/>
                        <div className="info">
                            <p><b>{data.agentName}</b></p>
                            {/*<p>Branch Manager</p>*/}
                            {/*<p><small>Branch Address goes here</small></p>*/}
                            {/*<a href="">Visit My Site</a>*/}

                        </div>
                    </div>
                }
                <div className="eform">
                    <input type="text" placeholder="First Name"/>
                    <input type="text" placeholder="Email"/>
                    <input type="text" placeholder="Phone"/>
                    <div className="d-flex checkbox align-items-center">
                        <input type="checkbox" name="militry"/>
                        <label htmlFor="militry">I served in U.S. Military</label>
                    </div>
                    <div className="d-flex checkbox align-items-center">
                        <input type="checkbox" name="militry"/>
                        <label htmlFor="militry">Get pre-approved by a lender</label>
                    </div>
                    <div className="pt-2 d-flex w-100 justify-content-center">
                        <button>Email Realtor</button>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default AdviserCards;