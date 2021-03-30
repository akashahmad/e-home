import React, { useState, useEffect } from "react";
import "./details.css";
import logo from "../../assets/images/eHomeoffer.png";
import { LineChart } from "./../../Components/LineChart";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import AdviserCards from "./AdviserCards";
import {
  searchProperty,
  toggleLoginModal,
  getAllAdverts,
} from "../../store/actions/Auth";
import moment from "moment";
import MapProperty from "../../Components/MapProperty";
import PropertyCard from "../../Components/PropertyCard";
import { apiUrl, publicToken } from "../../config";
import axios from "axios";
import Carousel from "react-multi-carousel";

const PropertyDetails = ({
  propertyId,
  propertyMarket,
  searchProperty,
  myProperty,
  propertyType,
  history,
  blogsData,
  onCardClick,
  isSearched,
  localData,
  modalLoader,
}) => {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [relatedResult, setRelatedResults] = useState(null);
  const [agentData, setAgnetData] = useState(null);
  const [lenderData, setLenderData] = useState(null);
  const [blogs, setblogs] = useState(null);
  const [provider, setProvider] = useState(null);
  const [jhootLoader, setJhootaLoder] = useState(true);

  // useEffect for calling related properties
  useEffect(() => {
    if (myProperty) {
      let config = {
        headers: {
          Authorization: "Bearer " + publicToken,
        },
      };

      axios
        .get(
          apiUrl +
            "ws/listings/search?market=gsmls&extended=true&listingtype=" +
            myProperty.listingType +
            "&details=true&listingDate=>6/1/2015&zip=" +
            myProperty.xf_postalcode,
          config
        )
        .then((res) => {
          if (res.data.result.listings && res.data.result.listings.length) {
            setRelatedResults(res.data.result.listings);
          }
        });
    }
  }, [myProperty]);

  // useEffect for getting agentData from local storage
  useEffect(() => {
    let agentDataLocal = localStorage.getItem("agentData");
    let lenderDataLocal = localStorage.getItem("lenderData");
    if (agentDataLocal) {
      setAgnetData(JSON.parse(agentDataLocal));
    }
    if (lenderDataLocal) {
      setLenderData(JSON.parse(lenderDataLocal));
    }
  }, []);

  //   method for formatiing price in US dollars
  let dollarUSLocale = Intl.NumberFormat("en-US");

  //   Setting data for displaying features
  const features = {
    type: myProperty && myProperty.xf_subproptype && myProperty.xf_subproptype,
    yearBuilt: myProperty && myProperty.yearBuilt && myProperty.yearBuilt,
    heating: myProperty && myProperty.xf_heating && myProperty.xf_heating,
    cooling: myProperty && myProperty.xf_cooling && myProperty.xf_cooling,
    lot: myProperty && myProperty.lotSize && myProperty.lotSize.sqft,
  };

  //   hide/show horizontal scroll arrow
  const scrollHandler = (scrollType) => {
    if (typeof window !== "undefined") {
      let navBar = document.getElementById("scrollNav");
      if (scrollType === "left") {
        navBar.scrollLeft -= 150;
      } else {
        navBar.scrollLeft += 150;
      }
    }
  };

  // For activating current menu item
  const activeMenuhandler = (text) => {
    if (text === activeMenu) {
      return "active";
    } else return "";
  };

  // Responsive setting for slider
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  // for getting blogs

  useEffect(() => {
    let localBlogs = [];
    Object.size = function (obj) {
      var size = 0,
        key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    };
    if (blogsData) {
      var size = Object.size(blogsData);
      if (size) {
        for (const [key, value] of Object.entries(blogsData)) {
          localBlogs.push(value);
        }
      }
      localBlogs = localBlogs.reverse();
      setblogs(localBlogs);
    }
  }, [blogsData]);

  // for getting data for provider
  useEffect(() => {
    let config = {
      headers: {
        Authorization: "Bearer " + publicToken,
      },
    };
    axios
      .get(
        "https://slipstream.homejunction.com/ws/markets/get?id=gsmls&details=true",
        config
      )
      .then((res) => {
        setProvider(res.data.result.markets[0]);
      });
  }, []);

  const cardClick = (state, city, zip, id, market) => {
    setActiveMenu("overview");
    onCardClick(state, city, zip, id, market);
  };
  return (
    <div
      className={`property-details-content ${
        modalLoader ? "d-flex justify-content-center align-items-center" : ""
      }`}
    >
      <section className="photos-container">
        {!modalLoader && myProperty && myProperty.images ? (
          myProperty.images.map((item) => {
            return (
              <img className="photo-tile-image" src={item} alt="tile-image" />
            );
          })
        ) : (
          <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
      </section>
      {!modalLoader && myProperty && (
        <section className="detail-content">
          <div className="detail-header">
            <Link to="/" className="logo">
              <img src={logo} />
            </Link>
            <ul className="sharing-actions">
              <li className="action">
                <svg viewBox="0 0 32 32" focusable="false" role="img">
                  <path
                    stroke="none"
                    d="M27.66 6.19a7.85 7.85 0 00-11 .13L16 7l-.65-.66a7.85 7.85 0 00-11-.13 8.23 8.23 0 00.09 11.59l.42.42L15.29 28.7a1 1 0 001.42 0l10.44-10.5.42-.42a8.23 8.23 0 00.09-11.59zm-1.42 10.06l-.52.52L16 26.55l-9.72-9.78-.52-.52A6.15 6.15 0 014 13.19a5.91 5.91 0 011.62-5.43 5.81 5.81 0 014.67-1.71 6 6 0 013.78 1.87l.5.5 1.08 1.08a.5.5 0 00.7 0l1.08-1.08.5-.5a6 6 0 013.78-1.87 5.81 5.81 0 014.67 1.71A5.91 5.91 0 0128 13.19a6.15 6.15 0 01-1.76 3.06z"
                  ></path>
                </svg>
                <span className="label"> Save </span>
              </li>
              <li className="action">
                <svg
                  version="1.1"
                  viewBox="0 0 23 18"
                  xmlns="http://www.w3.org/2000/svg"
                  focusable="false"
                >
                  <g fill-rule="evenodd">
                    <g
                      transform="translate(0)"
                      className="ds-action-bar-icon-fill"
                      fill-rule="nonzero"
                    >
                      <path d="m22.504 7.0047l-9.4663-6.7849c-0.2188-0.18177-0.53451-0.22356-0.79965-0.10586-0.26514 0.11771-0.42736 0.37168-0.41087 0.64327v3.4148c-2.9503 0.066134-5.77 1.1388-7.9168 3.0118-2.3605 2.2392-3.4984 5.3966-3.3895 9.5391 0.0061638 0.30779 0.2342 0.57373 0.55684 0.64938h0.18158c0.2629 2.775e-4 0.50471-0.13305 0.62947-0.34708 0.89579-1.5115 4.2005-6.2922 9.8174-6.2922h0.12105v3.2245l0.060526 0.44785 0.33895 0.15675c0.25053 0.11823 0.55234 0.092065 0.77474-0.067177l9.2242-6.6169 0.27842-0.25751v-0.61579zm-9.43 6.0571v-2.7431c4.845e-4 -0.35828-0.30312-0.65386-0.69-0.67177-5.3505-0.31349-8.8853 3.2021-10.604 5.4749 0.023449-2.6474 1.1158-5.1911 3.0626-7.132 2.0065-1.7327 4.6512-2.6935 7.3963-2.6871h0.14526c0.19332-1.3199e-4 0.37937-0.068163 0.52053-0.19033l0.21789-0.24632v-3.2021l7.9532 5.6989-8.0016 5.6989z"></path>
                    </g>
                  </g>
                </svg>
                <span className="label"> Share </span>
              </li>
              <li className="action">
                <svg viewBox="0 0 32 32" focusable="false" role="img">
                  <g stroke="none">
                    <path d="M16,14a2,2,0,1,1-2,2,2,2,0,0,1,2-2m0-2a4,4,0,1,0,4,4,4,4,0,0,0-4-4Z"></path>
                    <path d="M6,14a2,2,0,1,1-2,2,2,2,0,0,1,2-2m0-2a4,4,0,1,0,4,4,4,4,0,0,0-4-4Z"></path>
                    <path d="M26,14a2,2,0,1,1-2,2,2,2,0,0,1,2-2m0-2a4,4,0,1,0,4,4,4,4,0,0,0-4-4Z"></path>
                  </g>
                </svg>
                <span className="label"> More </span>
              </li>
            </ul>
          </div>
          {!modalLoader && myProperty ? (
            <div className="detail-intro">
              <div className="ds-summary-row-container">
                <div className="ds-summary-row-content">
                  <div className="d-flex align-items-center">
                    {myProperty.listPrice && (
                      <span className="cTBvcC">
                        <span>
                          <span>
                            ${dollarUSLocale.format(myProperty.listPrice)}
                          </span>
                        </span>
                      </span>
                    )}

                    <div className="ds-bed-bath-living-area-header">
                      <span className="ds-bed-bath-living-area-container">
                        <span className="ds-bed-bath-living-area">
                          <span>{myProperty.beds && myProperty.beds}</span>
                          <span className="ds-summary-row-label-secondary">
                            {" "}
                            bd
                          </span>
                        </span>
                        <span className="ds-vertical-divider"></span>
                        <button className="gPeOdD iQTawV">
                          <span className="ds-bed-bath-living-area">
                            <span>
                              {myProperty.baths && myProperty.baths.total}
                            </span>
                            <span className="ds-summary-row-label-secondary">
                              {" "}
                              ba
                            </span>
                          </span>
                        </button>
                        <span className="ds-vertical-divider"></span>
                        <span className="ds-bed-bath-living-area">
                          {/* <span>{myProperty.lotSize && myProperty.lotSize.sqft}</span> */}
                          <span>--</span>
                          <span className="ds-summary-row-label-secondary">
                            {" "}
                            sqft
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex">
                <div className="col-8">
                  <div className="hweBDL ds-price-change-address-row">
                    <div>
                      <h1 className="efSAZl">
                        {
                          <span>
                            {myProperty.address.street &&
                              myProperty.address.street}
                            ,{" "}
                          </span>
                        }
                        <span>
                          &nbsp;{" "}
                          {myProperty.address.city && myProperty.address.city},{" "}
                          {myProperty.address.state && myProperty.address.state}{" "}
                          {myProperty.address.zip && myProperty.address.zip}
                        </span>
                      </h1>
                    </div>
                  </div>
                  <div
                    className="sc-qXhiz cvmVKB ds-chip-removable-content"
                    style={{
                      visibility: "visible",
                      height: "26px",
                      opacity: 1,
                    }}
                  >
                    <p className="hHpaKQ">
                      <span className="sc-pkUbs bJnyvn ds-status-details">
                        <span className="ds-status-icon zsg-icon-for-sale"></span>
                        For {propertyType}
                      </span>
                      <span className="bDWFjp">
                        <span>
                          {/* <button id="dsChipZestimateTooltip" className="gPeOdD">Zestimate<sup>®</sup></button> */}
                          :&nbsp;
                          <span className="einFCw">
                            ${dollarUSLocale.format(myProperty.listPrice)}
                          </span>
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="ds-mortgage-row">
                    <div className="sc-pJurq cTjcEC">
                      <span className="sc-oTmZL kfNTWi">
                        Est. payment :&nbsp;
                      </span>
                      <span>$/mo</span>
                    </div>
                  </div>
                </div>
                <div className="col-4 d-flex flex-column justify-content-center align-items-center">
                  <b>Go Tour This Home</b>
                  <div>
                    {" "}
                    <img
                      src="https://i.ibb.co/hYHQmbD/calendar-512.webp"
                      style={{ width: "64px" }}
                    />
                      
                  </div>
                  <input type='date' className="w-100 px-2"/>
                  <button className="scheduleButton">Schedule Tour</button>
                </div>
              </div>
            </div>
          ) : (
            <div class="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
          <div className="gBFBii ds-buttons">
            <button className="offerMakeButton">Make An Instant Offer</button>
          </div>
          <div className="leYhyN position-relative">
            {/* left angle svg */}
            <svg
              onClick={() => scrollHandler("left")}
              viewBox="0 0 32 32"
              className="Icon-c11n-8-18-0__sc-13llmml-0 kUILak IconChevronRightOutline-c11n-8-18-0__sc-170wm20-0 iDMqEV leftArrowModalScroll"
              aria-hidden="true"
              focusable="false"
              role="img"
            >
              <title>Chevron Right</title>
              <path
                stroke="none"
                d="M29.7 8.8a1 1 0 00-1.4 0L16 21 3.7 8.8a1 1 0 00-1.4 0 1 1 0 000 1.4l13 13a1 1 0 001.4 0l13-13a1 1 0 000-1.4z"
              ></path>
            </svg>
            {/* right angle svg */}
            <svg
              onClick={() => scrollHandler("")}
              viewBox="0 0 32 32"
              className="Icon-c11n-8-18-0__sc-13llmml-0 kUILak IconChevronRightOutline-c11n-8-18-0__sc-170wm20-0 iDMqEV rightArrowModalScroll"
              aria-hidden="true"
              focusable="false"
              role="img"
            >
              <title>Chevron Right</title>
              <path
                stroke="none"
                d="M29.7 8.8a1 1 0 00-1.4 0L16 21 3.7 8.8a1 1 0 00-1.4 0 1 1 0 000 1.4l13 13a1 1 0 001.4 0l13-13a1 1 0 000-1.4z"
              ></path>
            </svg>
            <div className="yASsG">
              <nav
                aria-label="page"
                className="bMkZsT scrollNav position-relative"
                id="scrollNav"
              >
                <ul className="hJXnIl">
                  <li
                    className="eVYrJu"
                    onClick={() => setActiveMenu("overview")}
                  >
                    <a
                      href="#overview"
                      className={`bhJxVt ${activeMenuhandler("overview")}`}
                    >
                      Overview
                    </a>
                  </li>
                  <li className="eVYrJu" onClick={() => setActiveMenu("facts")}>
                    <a
                      href="#facts"
                      className={`bhJxVt ${activeMenuhandler("facts")}`}
                    >
                      Facts and features
                    </a>
                  </li>
                  <li
                    className="eVYrJu"
                    onClick={() => setActiveMenu("advisors")}
                  >
                    <a
                      href="#advisors"
                      className={`bhJxVt ${activeMenuhandler("advisors")}`}
                    >
                      Advisors
                    </a>
                  </li>
                  <li className="eVYrJu" onClick={() => setActiveMenu("cost")}>
                    <a
                      href="#cost"
                      className={`bhJxVt ${activeMenuhandler("cost")}`}
                    >
                      Monthly cost
                    </a>
                  </li>

                  <li
                    className="eVYrJu"
                    onClick={() => setActiveMenu("schools")}
                  >
                    <a
                      href="#schools"
                      className={`bhJxVt ${activeMenuhandler("schools")}`}
                    >
                      Nearby schools
                    </a>
                  </li>
                  {relatedResult && (
                    <li
                      className="eVYrJu"
                      onClick={() => setActiveMenu("similar")}
                    >
                      <a
                        href="#similar"
                        className={`bhJxVt ${activeMenuhandler("similar")}`}
                      >
                        Similar homes
                      </a>
                    </li>
                  )}
                  <li className="eVYrJu" onClick={() => setActiveMenu("blogs")}>
                    <a
                      href="#blogs"
                      className={`bhJxVt ${activeMenuhandler("blogs")}`}
                    >
                      Blogs
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div
            className="scroll-contant position-relative"
            id="modalScrollArea"
          >
            <div className="px-3">
              <div className="ibZOdk">
                {myProperty && (
                  <MapProperty
                    propertiesList={[myProperty]}
                    coordinates={myProperty && myProperty["coordinates"]}
                  />
                )}
              </div>
              <h5 className="bloUvX" id="overview">
                Overview
              </h5>

              <div className="ds-overview-section">
                <div className="gwtwTs">{myProperty.description}</div>
                <button className="kPatDd csGbhU">Read more</button>
              </div>
            </div>

            <div className="kkFAbf" id="facts">
              <h4 className="dTAnOx">Facts and features</h4>
              <div className="facts-card">
                <ul className="fact-list">
                  {Object.entries(features).map((item) => {
                    return (
                      <li className="fact-item">
                        <i className="sc-pktCe gUXGEs zsg-icon-buildings"></i>
                        <span className="cDEvWM">{item[0]}:</span>
                        <span className="eBiAkN">{item[1]}</span>
                      </li>
                    );
                  })}
                  <li className="fact-item">
                    <i className="sc-pktCe gUXGEs zsg-icon-parking"></i>
                    <span className="cDEvWM">Parking:</span>
                    <span className="eBiAkN">{myProperty.xf_garagedesc}</span>
                  </li>
                  <li className="fact-item">
                    <i className="sc-pktCe gUXGEs zsg-icon-hoa"></i>
                    <span className="cDEvWM">HOA:</span>
                    <span className="eBiAkN">$360 annually</span>
                  </li>
                  <li className="fact-item">
                    <i className="sc-pktCe gUXGEs zsg-icon-price-sqft"></i>
                    <span className="cDEvWM">Price/sqft:</span>
                    <span className="eBiAkN">$-</span>
                  </li>
                </ul>
              </div>
              <div className="ekDNZJ">
                <div className="kAvzkP">
                  <h5 className="gHAGDn">Interior details</h5>
                  <div className="wVdMu">
                    <div className="kYVsju">
                      <h6 className="einFCw">Bedrooms and bathrooms</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Bedrooms: {myProperty.beds}
                          </span>
                        </li>
                        <li>
                          <span className="foiYRz">
                            Bathrooms: {myProperty && myProperty.baths.total}
                          </span>
                        </li>
                        <li>
                          <span className="foiYRz">
                            Full bathrooms:{" "}
                            {myProperty && myProperty.baths.full}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Basement</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Basement: {myProperty && myProperty.xf_basement}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Flooring</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz"> </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Heating</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Heating features:
                            {myProperty.xf_heating &&
                              myProperty.xf_heating.length > 0 &&
                              myProperty.xf_heating.map((item) => {
                                return <span> {item} </span>;
                              })}
                            {myProperty.xf_heatsrc &&
                              myProperty.xf_heatsrc.length > 0 &&
                              myProperty.xf_heatsrc.map((item) => {
                                return <span> {item} </span>;
                              })}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Cooling</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Cooling features:
                            {myProperty.xf_cooling &&
                              myProperty.xf_cooling.length > 0 &&
                              myProperty.xf_cooling.map((item) => {
                                return <span> {item} </span>;
                              })}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Appliances</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Appliances included:
                            {myProperty.xf_appliances &&
                              myProperty.xf_appliances.length > 0 &&
                              myProperty.xf_appliances.map((item) => {
                                return <span> {item} </span>;
                              })}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Other interior features</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">Total structure area: </span>
                        </li>
                        <li>
                          <span className="foiYRz">
                            Total interior livable area: sqft
                          </span>
                        </li>
                        <li>
                          <span className="foiYRz">
                            Total number of fireplaces:{" "}
                            {myProperty.xf_fireplaces}
                          </span>
                        </li>
                        <li>
                          <span className="foiYRz">Fireplace features: </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="kAvzkP">
                  <h5 className="gHAGDn">Property details</h5>
                  <div className="wVdMu">
                    <div className="kYVsju">
                      <h6 className="einFCw">Parking</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Total spaces: {myProperty.xf_garage}
                          </span>
                        </li>
                        <li>
                          <span className="foiYRz">Parking features: </span>
                        </li>
                        <li>
                          <span className="foiYRz">Garage spaces: </span>
                        </li>
                        <li>
                          <span className="foiYRz">Covered spaces: </span>
                        </li>
                        <li>
                          <span className="foiYRz">Attached garage: </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Accessibility</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Accessibility features:{" "}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Property</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">Levels: </span>
                        </li>
                        <li>
                          <span className="foiYRz">Stories: </span>
                        </li>
                        <li>
                          <span className="foiYRz">
                            Exterior features:
                            {myProperty.xf_exterior &&
                              myProperty.xf_exterior.length > 0 &&
                              myProperty.xf_exterior.map((item) => {
                                return <span> {item} </span>;
                              })}
                          </span>
                        </li>
                        <li>
                          <span className="foiYRz">
                            Patio and porch details:{" "}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Lot</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Lot size:{" "}
                            {myProperty.lotSize && myProperty.lotSize.sqft} sqft
                          </span>
                        </li>
                        <li>
                          <span className="foiYRz">
                            Lot size dimensions: 100 x 200
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Other property information</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Parcel number: 3000224000000007
                          </span>
                        </li>
                        <li>
                          <span className="foiYRz">
                            Zoning description: Planned
                            Residential,Residential,Single Family
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="kAvzkP">
                  <h5 className="gHAGDn">Construction details</h5>
                  <div className="wVdMu">
                    <div className="kYVsju">
                      <h6 className="einFCw">Type and style</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Home type: {myProperty.xf_subproptype}
                          </span>
                        </li>
                        <li>
                          <span className="foiYRz">
                            Architectural style:
                            {myProperty.xf_style &&
                              myProperty.xf_style.length > 0 &&
                              myProperty.xf_style.map((item) => {
                                return <span> {item} </span>;
                              })}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Material information</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Construction materials:
                            {myProperty.xf_exterior &&
                              myProperty.xf_exterior.length > 0 &&
                              myProperty.xf_exterior.map((item) => {
                                return <span> {item} </span>;
                              })}
                          </span>
                        </li>
                        <li>
                          <span className="foiYRz">Foundation: </span>
                        </li>
                        <li>
                          <span className="foiYRz">
                            Roof:
                            {myProperty.xf_roof &&
                              myProperty.xf_roof.length > 0 &&
                              myProperty.xf_roof.map((item) => {
                                return <span> {item} </span>;
                              })}
                          </span>
                        </li>
                        <li>
                          <span className="foiYRz">Windows: </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Condition</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            New construction:
                            {myProperty.newConstruction ? (
                              <span>Yes</span>
                            ) : (
                              <span>No</span>
                            )}
                          </span>
                        </li>
                        <li>
                          <span className="foiYRz">
                            Year built: {myProperty.xf_yearbuilt}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Other construction</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Builder model: Custom Normandy
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="kAvzkP">
                  <h5 className="gHAGDn">Utilities / Green Energy Details</h5>
                  <div className="wVdMu">
                    <div className="kYVsju">
                      <h6 className="einFCw">Utility</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Sewer information: Public Sewer
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="kAvzkP">
                  <h5 className="gHAGDn">Community and Neighborhood Details</h5>
                  <div className="wVdMu">
                    <div className="kYVsju">
                      <h6 className="einFCw">Security</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Security features: Security System
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Community</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">
                            Community features: Association, Playground, Pool,
                            Swimming, Tennis Court(s)
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="kYVsju">
                      <h6 className="einFCw">Location</h6>
                      <ul className="gsEezU">
                        <li>
                          <span className="foiYRz">Region: Marlboro</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <ul className="jUMuUb">
                  <li className="ds-data-link"></li>
                </ul>
                <div className="fQkkzS"></div>
              </div>
              <div className="ivyodi" id="advisors">
                <p className="bpPStC" style={{ fontSize: "18px" }}>
                  <strong>Our eHomeoffer Advisors</strong>
                </p>
              </div>
            </div>
            <div className="jOzrMc">
              <AdviserCards agentData={agentData} lenderData={lenderData} />
              {/* <h6 className='cFKaVN einFCw'>Select an appointment type</h6>
                <div className='ehFvlJ'>
                  <button type='button' className='iLBhcz active'>
                    In-person
                  </button> */}
              {/* </div> */}
              <Link
                to={`/wizard/${myProperty.id}`}
                className="cDOGeN CWQMf mt-4"
              >
                <span className="hRBsWH">
                  <svg viewBox="0 0 50 50" height="20px" width="20px">
                    <g fill-rule="nonzero" fill="none">
                      <circle fill="#0074E4" cx="25" cy="25" r="25"></circle>
                      <path
                        d="M33.438 14.688l-1.876 3.124c-1.562-1.25-3.125-1.875-5-2.187v6.563c5.313 1.25 7.5 3.437 7.5 7.187 0 3.75-2.812 6.25-7.187 6.563v3.437H23.75v-3.438c-3.125-.312-5.938-1.562-8.125-3.437l2.188-3.125c1.875 1.563 3.75 2.5 5.937 3.125v-6.875c-5-1.25-7.5-3.125-7.5-7.188 0-3.75 2.813-6.25 7.188-6.562V10h3.125v2.188c2.5 0 5 .937 6.875 2.5zM30 29.374c0-1.563-.625-2.5-3.438-3.125v6.25c2.5-.313 3.438-1.25 3.438-3.125zm-9.375-11.25c0 1.563.625 2.5 3.438 3.125v-5.938c-2.188.313-3.438 1.25-3.438 2.813z"
                        fill="#FFF"
                      ></path>
                    </g>
                  </svg>
                </span>

                <span className="cNBYuL">Get pre-qualified</span>
              </Link>
              {/* <h6 className='cFKaVN einFCw gKaOfx'>Select a date</h6>
                <input type='date' className="w-100 p-2"/>
                <button type="button" className="iLBhcz active mt-2">Select</button> */}
            </div>

            <div className="dHtGQa" id="cost">
              <h5 className="dTAnOx dZuCmF">Monthly cost</h5>
              <div className="ePSpFA">
                <span className="foiYRz">Estimated monthly cost</span>
                <h5 className="dTAnOx">$3,229</h5>
              </div>
              <div className="fgVRFP">
                <div className="bnePEP">
                  <div className="iMXoIt">
                    <div className="cwZLoX">
                      <div className="gqqTSu">
                        <div className="jLwdhz">
                          <span className="iuVuVk">
                            Principal&amp; interest
                          </span>
                          <span className="cNBYuL">$2,014/mo</span>
                        </div>
                        <svg
                          viewBox="0 0 32 32"
                          aria-label="expand row"
                          className="kUILak loJJiJ"
                          focusable="false"
                          role="img"
                        >
                          <path
                            stroke="none"
                            d="M29.41 8.59a2 2 0 00-2.83 0L16 19.17 5.41 8.59a2 2 0 00-2.83 2.83l12 12a2 2 0 002.82 0l12-12a2 2 0 00.01-2.83z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bnePEP">
                  <div className="sc-pscky iMXoIt">
                    <div className="sc-pjHjD cwZLoX">
                      <div className="gqqTSu">
                        <div className="jLwdhz">
                          <span className="iuVuVk">Mortgage nsurance</span>
                          <span className="cNBYuL">$0/mo</span>
                        </div>
                        <svg
                          viewBox="0 0 32 32"
                          aria-label="expand row"
                          className="kUILak loJJiJ"
                          focusable="false"
                          role="img"
                        >
                          <path
                            stroke="none"
                            d="M29.41 8.59a2 2 0 00-2.83 0L16 19.17 5.41 8.59a2 2 0 00-2.83 2.83l12 12a2 2 0 002.82 0l12-12a2 2 0 00.01-2.83z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bnePEP">
                  <div className="sc-pscky iMXoIt">
                    <div className="sc-pjHjD cwZLoX">
                      <div className="gqqTSu">
                        <div className="jLwdhz">
                          <span className="iuVuVk">Property taxes</span>
                          <span className="cNBYuL">$975/mo</span>
                        </div>
                        <svg
                          viewBox="0 0 32 32"
                          aria-label="expand row"
                          className="kUILak loJJiJ"
                          focusable="false"
                          role="img"
                        >
                          <path
                            stroke="none"
                            d="M29.41 8.59a2 2 0 00-2.83 0L16 19.17 5.41 8.59a2 2 0 00-2.83 2.83l12 12a2 2 0 002.82 0l12-12a2 2 0 00.01-2.83z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bnePEP">
                  <div className="sc-pscky iMXoIt">
                    <div className="sc-pjHjD cwZLoX">
                      <div className="gqqTSu">
                        <div className="jLwdhz">
                          <span className="iuVuVk">Home insurance</span>
                          <span className="cNBYuL">$210/mo</span>
                        </div>
                        <svg
                          viewBox="0 0 32 32"
                          aria-label="expand row"
                          className="kUILak loJJiJ"
                          focusable="false"
                          role="img"
                        >
                          <path
                            stroke="none"
                            d="M29.41 8.59a2 2 0 00-2.83 0L16 19.17 5.41 8.59a2 2 0 00-2.83 2.83l12 12a2 2 0 002.82 0l12-12a2 2 0 00.01-2.83z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bnePEP">
                  <div className="sc-pscky iMXoIt">
                    <div className="sc-pjHjD cwZLoX">
                      <div className="gqqTSu">
                        <div className="jLwdhz">
                          <span className="iuVuVk">HOA fees</span>
                          <span className="cNBYuL">$30/mo</span>
                        </div>
                        <svg
                          viewBox="0 0 32 32"
                          aria-label="expand row"
                          className="kUILak loJJiJ"
                          focusable="false"
                          role="img"
                        >
                          <path
                            stroke="none"
                            d="M29.41 8.59a2 2 0 00-2.83 0L16 19.17 5.41 8.59a2 2 0 00-2.83 2.83l12 12a2 2 0 002.82 0l12-12a2 2 0 00.01-2.83z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bnePEP">
                  <div className="sc-pscky iMXoIt">
                    <div className="sc-pjHjD cwZLoX">
                      <div className="gqqTSu">
                        <div className="jLwdhz">
                          <span className="iuVuVk">Utilities</span>
                          <span className="cNBYuL">Not included</span>
                        </div>
                        <svg
                          viewBox="0 0 32 32"
                          aria-label="expand row"
                          className="kUILak loJJiJ"
                          focusable="false"
                          role="img"
                        >
                          <path
                            stroke="none"
                            d="M29.41 8.59a2 2 0 00-2.83 0L16 19.17 5.41 8.59a2 2 0 00-2.83 2.83l12 12a2 2 0 002.82 0l12-12a2 2 0 00.01-2.83z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="kbPcQZ">
                <span className="eUizBk">
                  All calculations are estimates and provided for informational
                  purposes only. Actual amounts may vary.
                </span>
              </div>
              <div className="hfaxmN">
                <div className="kxyWmW">
                  <span className="fNKWbY">
                    <span className="jfMcol">Don't miss out on this home,</span>{" "}
                    or any
                    <span className="jfMcol">other on your list.</span>
                  </span>
                  <a
                    className="hzltKX krKpbT"
                    href="https://www.zillow.com/pre-qualify/#/pre-qualify&amp;zipCode=07746&amp;propertyValue=599900&amp;propertyType=SingleFamilyHome&amp;source=FS_HDP_Mortgage_Module"
                  >
                    <span className="inbrfQ">
                      <svg viewBox="0 0 50 50" height="21px" width="21px">
                        <g fill-rule="nonzero" fill="none">
                          <circle
                            fill="#0074E4"
                            cx="25"
                            cy="25"
                            r="25"
                          ></circle>
                          <path
                            d="M33.438 14.688l-1.876 3.124c-1.562-1.25-3.125-1.875-5-2.187v6.563c5.313 1.25 7.5 3.437 7.5 7.187 0 3.75-2.812 6.25-7.187 6.563v3.437H23.75v-3.438c-3.125-.312-5.938-1.562-8.125-3.437l2.188-3.125c1.875 1.563 3.75 2.5 5.937 3.125v-6.875c-5-1.25-7.5-3.125-7.5-7.188 0-3.75 2.813-6.25 7.188-6.562V10h3.125v2.188c2.5 0 5 .937 6.875 2.5zM30 29.374c0-1.563-.625-2.5-3.438-3.125v6.25c2.5-.313 3.438-1.25 3.438-3.125zm-9.375-11.25c0 1.563.625 2.5 3.438 3.125v-5.938c-2.188.313-3.438 1.25-3.438 2.813z"
                            fill="#FFF"
                          ></path>
                        </g>
                      </svg>
                    </span>
                    <span className="cNBYuL">Get pre-qualified</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="dHtGQa" id="schools">
              <h4 className="dTAnOx dZuCmF">Nearby schools in Marlboro</h4>
              <div className="eUOzkf">
                <h5 className="bSxNCK">
                  Schools provided by the listing agent
                </h5>
                <div className="gtLCRl">
                  <div>Elementary: Marlboro</div>
                  <div>Middle: Marlboro</div>
                  <div>High: Marlboro,Christian Bros</div>
                </div>
                <p className="fhpxsu">
                  This data may not be complete. We recommend contacting the
                  local school district to confirm school assignments for this
                  home.
                </p>
                <span className="einFCw">
                  Source: <span className="foiYRz">MOMLS</span>
                </span>
              </div>
            </div>
            {relatedResult && (
              <div className="dHtGQa" id="similar">
                <h5 className="dTAnOx dZuCmF">Similar homes</h5>
                {relatedResult && (
                  <Carousel responsive={responsive}>
                    {relatedResult &&
                      relatedResult.map((singleRelated, index) => {
                        return (
                          <div
                            className="mx-1"
                            key={index}
                            style={{ paddingTop: "20px" }}
                          >
                            <PropertyCard
                              propertyValues={singleRelated}
                              history={history}
                              onCardClick={cardClick}
                            />
                          </div>
                        );
                      })}
                  </Carousel>
                )}
              </div>
            )}
            <div className="dHtGQa" id="blogs">
              <h5 className="dTAnOx dZuCmF">Blogs</h5>
              {blogs && (
                <Carousel responsive={responsive}>
                  {blogs.map((blog, index) => {
                    return (
                      <a href={blog.link} target="_blank" key={index}>
                        <div className="blogCard mx-2">
                          <div
                            className="imageArea"
                            style={{ backgroundImage: `url(${blog.image})` }}
                          />
                          <div className="blogBody">
                            <h1>{blog.name}</h1>
                            <p>
                              {blog.postcontent.length > 150
                                ? blog.postcontent
                                    .substring(0, 150)
                                    .concat("...")
                                : blog.postcontent.length}
                            </p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </Carousel>
              )}
            </div>
            {provider && (
              <div className="home-details-listing-provided-by">
                <div className="bUREIR">
                  <div className="inlRtt">
                    <img alt="" src={provider.assets.logo.url} />
                  </div>
                  <b>Copyrights:</b>
                  <p className="bDTsLB">
                    {provider.lexicon.en_US.copyright.replace(
                      "&copy; {current_date_year}",
                      "2021"
                    )}
                  </p>
                  <b>Disclaimer:</b>
                  <p className="bDTsLB">{provider.lexicon.en_US.disclaimer}</p>
                </div>
              </div>
            )}

            <div className="ds-breadcrumb-container">
              <ul className="ds-breadcrumbs">
                <li>
                  <a href="#">New Jersey</a>
                </li>
                <li>
                  <span></span>
                  <a href="#">Marlboro</a>
                </li>
                <li>
                  <span></span>
                  <a href="#">07746</a>
                </li>
                <li>
                  <span></span>
                  <a href="#">40 Girard St</a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    myProperties: state.myProperties,
    // myProperty: state.myProperty.listings ? state.myProperty.listings[0] : "",
    myPropertyInfo: state.myPropertyInfo,
    loginModal: state.loginModal,
  };
};

const mapDispatchToProps = { searchProperty, toggleLoginModal, getAllAdverts };

export default connect(mapStateToProps, mapDispatchToProps)(PropertyDetails);
