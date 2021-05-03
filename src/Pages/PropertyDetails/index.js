import React, { useState, useEffect } from "react";
import "./details.css";
import logo from "../../assets/images/eHomeoffer.png";
import { LineChart } from "./../../Components/LineChart";
import { Link, useLocation } from "react-router-dom";
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
import MonthlyCost from "../../Components/MonthlyCost";
import { apiUrl, publicToken } from "../../config";
import axios from "axios";
import Carousel from "react-multi-carousel";
import { Modal, ModalBody } from "reactstrap";
import OutsideClick from "@alphasquad/outside-click";
import OutsideClickHandler from "react-outside-click-handler";
import LocationIcon from "../../assets/images/location_icon.png";
import BedIcon from "../../assets/images/bed_icon.png";
import BathIcon from "../../assets/images/bath_icon.png";
import FtIcon from "../../assets/images/ft_icon.png";
import ScheduleCard from "./schduleCard";
import { bePath } from "../../apiPaths";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
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
  const [showSocial, setShowSocial] = useState(false);

  // for tabs

  const [modalDates, setModalDates] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [similarHomes, setSimilarHomes] = useState(null);
  console.log(myProperty, "check my property");

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

  useEffect(() => {
    let allDates = [new Date()];
    let today = new Date();
    for (let i = 0; i <= 5; i++) {
      let nextDay = new Date(allDates[i]);
      nextDay.setDate(nextDay.getDate() + 1);
      allDates.push(nextDay);
    }
    setModalDates(allDates);
    // for calling related properties
    if (myProperty) {
      axios
        .get(
          bePath +
          "/searchProperties?market=" +
          myProperty.market +
          "&extended=true&listingtype=" +
          myProperty.listingType +
          "&details=true&listingDate=>6/1/2015&zip=" +
          myProperty.xf_postalcode
        )
        .then((res) => {
          if (res.data.result.listing && res.data.result.listing.length) {
            setRelatedResults(res.data.result.listing);
          }
        });
      // for getting similar homes
      axios
        .get(
          bePath +
          "/searchProperties?market=" +
          myProperty.market +
          "&extended=true&baths=" +
          myProperty.baths.total +
          "&details=true&listingDate=>6/1/2015&beds=" +
          myProperty.beds
        )
        .then((res) => {
          if (res.data.result.listing && res.data.result.listing.length) {
            setSimilarHomes(res.data.result.listing);
          }
        });
      let config = {
        headers: {
          Authorization: "Bearer " + publicToken,
        },
      };
      // for getting data for provider
      axios
        .get(
          "https://slipstream.homejunction.com/ws/markets/get?id=" +
          myProperty.market +
          "&details=true",
          config
        )
        .then((res) => {
          setProvider(res.data.result.markets[0]);
        });
    }
  }, [myProperty]);

  // useEffect for getting agentData from local storage
  let agentDataLocal = localStorage.getItem("agentData");
  let lenderDataLocal = localStorage.getItem("lenderData");
  useEffect(() => {
    if (agentDataLocal) {
      setAgnetData(JSON.parse(agentDataLocal));
    }
    if (lenderDataLocal) {
      setLenderData(JSON.parse(lenderDataLocal));
    }
  }, [agentDataLocal, lenderDataLocal]);

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
      items: 1,
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
  // Responsive setting for slider dates
  const responsiveDates = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const cardClick = (state, city, zip, id, market) => {
    setActiveMenu("overview");
    onCardClick(state, city, zip, id, market);
  };
  let location = typeof window !== "undefined" && window.location;
  return (
    <div
      className={`property-details-content ${modalLoader ? "d-flex justify-content-center align-items-center" : ""
        }`}
    >
      {/* The absolute div of status */}
      {!modalLoader && (
        <div className="sc-pJurq cTjcEC detailTypetTag">
          <div
            style={{
              minWidth: "20px",
              minHeight: "20px",
              borderRadius: "20px",
              backgroundColor: "#336699",
            }}
            className="d-flex justify-content-center align-items-center mr-1"
          >
            <i
              class="fa fa-info"
              style={{
                color: "white",
                fontSize: "10px",
              }}
            ></i>
          </div>
          <span className="sc-oTmZL kfNTWi">Status :&nbsp;</span>
          <span>For {propertyType}</span>
        </div>
      )}
      {/* The absolute div of status */}
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
              <li
                className="action shareList"
                onClick={() => setShowSocial(!showSocial)}
              >
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
                {showSocial && (
                  <OutsideClickHandler
                    onOutsideClick={() => setShowSocial(false)}
                  >
                    <div className="socialSharingDiv">
                      <FacebookShareButton url={location && location}>
                        <div onClick={() => setShowSocial(false)}>
                          <FacebookIcon round={true} />
                        </div>
                      </FacebookShareButton>
                      <LinkedinShareButton url={location && location}>
                        <div onClick={() => setShowSocial(false)}>
                          <LinkedinIcon round={true} />
                        </div>
                      </LinkedinShareButton>

                      <TwitterShareButton url={location && location}>
                        <div onClick={() => setShowSocial(false)}>
                          <TwitterIcon round={true} />
                        </div>
                      </TwitterShareButton>
                    </div>
                  </OutsideClickHandler>
                )}
              </li>
            </ul>
          </div>
          {!modalLoader && myProperty ? (
            <div className="detail-intro">
              <div className="ds-summary-row-container">
                <div className="ds-summary-row-content">
                  <div className="d-flex align-items-center justify-content-between">
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
                        <span className="ds-bed-bath-living-area mr-3">
                          <img
                            src={BedIcon}
                            alt="Bed Icon"
                            style={{ width: "20px" }}
                            className="mr-1"
                          />
                          <span>{myProperty.beds && myProperty.beds}</span>
                          <span className="ds-summary-row-label-secondary">
                            {" "}
                            Beds
                          </span>
                        </span>
                        <span className="ds-bed-bath-living-area mr-3">
                          <img
                            src={BathIcon}
                            alt="Bed Icon"
                            style={{ width: "20px" }}
                            className="mr-1"
                          />
                          <span>
                            {" "}
                            {myProperty.baths && myProperty.baths.total}
                          </span>
                          <span className="ds-summary-row-label-secondary">
                            {" "}
                            Baths
                          </span>
                        </span>
                        <span className="ds-bed-bath-living-area">
                          <img
                            src={FtIcon}
                            alt="Bed Icon"
                            style={{ width: "20px" }}
                            className="mr-1"
                          />
                          {myProperty.attomData &&
                            myProperty.attomData.building ? (
                            <span>
                              {myProperty.attomData &&
                                myProperty.attomData.building.size.bldgSize +
                                " " +
                                "sqft"}
                            </span>
                          ) : (
                            <>
                              {" "}
                              <span>--</span>
                              <span className="ds-summary-row-label-secondary">
                                {" "}
                                sqft
                              </span>
                            </>
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-end">
                <div className="col-6">
                  <div className="hweBDL ds-price-change-address-row">
                    <img src={LocationIcon} />
                    <div>
                      <h1 className="efSAZl" style={{ fontSize: "10px" }}>
                        {/* {
                          <span>
                            {myProperty.address.street &&
                              myProperty.address.street}
                            ,
                          </span>
                        }
                        <span>
                          &nbsp;
                          {myProperty.address.city &&
                          myProperty.address.city.indexOf("Twp") !== -1
                            ? myProperty.address.city.split("Twp.").join("")
                            : myProperty.address.city}
                          ,{" "}
                          {myProperty.address.state && myProperty.address.state}{" "}
                          {myProperty.address.zip && myProperty.address.zip}
                        </span> */}
                        {myProperty.address.street}
                        {myProperty.address.street && <br />}
                        {myProperty.address.city &&
                          myProperty.address.city.indexOf("Twp") !== -1
                          ? myProperty.address.city.split("Twp.").join("")
                          : myProperty.address.city}{" "}
                        , {myProperty.address.state}
                        &nbsp;{myProperty.address.zip}
                      </h1>
                    </div>
                  </div>

                  {/* <div
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
                          <button id="dsChipZestimateTooltip" className="gPeOdD">Zestimate<sup>®</sup></button>
                          :&nbsp;
                          <span className="einFCw">
                            ${dollarUSLocale.format(myProperty.listPrice)}
                          </span>
                        </span>
                      </span>
                    </p>
                  
                  </div> */}

                  <div className="ds-mortgage-row">
                    <div className="sc-pJurq cTjcEC mb-2">
                      <div
                        style={{
                          minWidth: "20px",
                          minHeight: "20px",
                          borderRadius: "20px",
                          backgroundColor: "#336699",
                        }}
                        className="d-flex justify-content-center align-items-center mr-1"
                      >
                        <i
                          class="fa fa-chart-area"
                          style={{
                            color: "white",
                            fontSize: "10px",
                          }}
                        ></i>
                      </div>
                      <span className="sc-oTmZL kfNTWi">MLS# &nbsp;</span>
                      <span>12354556</span>
                    </div>
                    <div className="sc-pJurq cTjcEC">
                      <div
                        style={{
                          minWidth: "20px",
                          minHeight: "20px",
                          borderRadius: "20px",
                          backgroundColor: "#336699",
                        }}
                        className="d-flex justify-content-center align-items-center mr-1"
                      >
                        <i
                          class="fa fa-money-bill-wave"
                          style={{
                            color: "white",
                            fontSize: "10px",
                          }}
                        ></i>
                      </div>
                      <span className="sc-oTmZL kfNTWi">Est Paymt :&nbsp;</span>
                      <span>$ per/mo</span>
                    </div>
                  </div>
                </div>

                <div className="col-6 d-flex flex-column justify-content-center">
                  <div className="sc-pJurq cTjcEC mb-2">
                    <div
                      style={{
                        minWidth: "20px",
                        minHeight: "20px",
                        borderRadius: "20px",
                        backgroundColor: "#336699",
                      }}
                      className="d-flex justify-content-center align-items-center mr-1"
                    >
                      <i
                        class="fa fa-calendar-day"
                        style={{
                          color: "white",
                          fontSize: "10px",
                        }}
                      ></i>
                    </div>
                    <span className="sc-oTmZL kfNTWi">
                      Days On Market :&nbsp;
                    </span>
                    <span>
                      {myProperty.daysOnHJI ? myProperty.daysOnHJI : "N/A"}
                    </span>
                  </div>
                  <div className="sc-pJurq cTjcEC">
                    <span className="sc-oTmZL kfNTWi">
                      <Link
                        to={`/wizard/${myProperty.id}?market=${myProperty.market}`}
                        className="w-100 d-flex align-items-center"
                      >
                        <div
                          style={{
                            minWidth: "20px",
                            minHeight: "20px",
                            borderRadius: "20px",
                            backgroundColor: "#336699",
                          }}
                          className="d-flex justify-content-center align-items-center mr-1"
                        >
                          <i
                            class="fa fa-dollar-sign"
                            style={{
                              color: "white",
                              fontSize: "10px",
                              marginLeft: "3px",
                            }}
                          ></i>
                        </div>{" "}
                        Get Pre-Qualified Today
                      </Link>
                    </span>
                  </div>
                  {/* <b>Go Tour This Home</b>
                  <div>
                    {" "}
                    <img
                      src="https://i.ibb.co/hYHQmbD/calendar-512.webp"
                      style={{ width: "64px" }}
                    />
                  </div>
                  <input type="date" className="w-100 px-2" />
                  <button className="scheduleButton">Schedule Tour</button> */}
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
          <div className="gBFBii ds-buttons ">
            <div className="col-6">
              <button
                onClick={() => setShowDateModal(true)}
                className="offerMakeButton"
                style={{ backgroundColor: "#336699" }}
              >
                Schedule a Showing
              </button>
            </div>
            <div className="col-6">
              <Link
                to={`/wizard/${myProperty.id}?market=${myProperty.market}`}
                className="w-100"
              >
                <button className="offerMakeButton">Instant Offer</button>
              </Link>
            </div>
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
                      Facts & Features
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
                      Contact Advisors
                    </a>
                  </li>
                  {/* <li
                    className="eVYrJu"
                    onClick={() => setActiveMenu("financing")}
                  >
                    <a
                      href="#overview"
                      className={`bhJxVt ${activeMenuhandler("financing")}`}
                    >
                      Get Financing
                    </a>
                  </li> */}
                  <li
                    className="eVYrJu"
                    onClick={() => setActiveMenu("showing")}
                  >
                    <a
                      href="#schedule"
                      className={`bhJxVt ${activeMenuhandler("showing")}`}
                    >
                      Schdule a Showing
                    </a>
                  </li>
                  {/* <li
                    className="eVYrJu"
                    onClick={() => setActiveMenu("makeOffer")}
                  >
                    <a
                      href="#overview"
                      className={`bhJxVt ${activeMenuhandler("makeOffer")}`}
                    >
                      Make an Offer
                    </a>
                  </li> */}
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
                    onClick={() => setActiveMenu("taxAndPrice")}
                  >
                    <a
                      href="#taxAndPrice"
                      className={`bhJxVt ${activeMenuhandler("taxAndPrice")}`}
                    >
                      Price & Tax History
                    </a>
                  </li>
                  {myProperty.schools && (
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
                  )}
                  {relatedResult && (
                    <li
                      className="eVYrJu"
                      onClick={() => setActiveMenu("neighborhood")}
                    >
                      <a
                        href="#neighborhood"
                        className={`bhJxVt ${activeMenuhandler(
                          "neighborhood"
                        )}`}
                      >
                        Neighborhood
                      </a>
                    </li>
                  )}
                  {similarHomes && (
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
            <MonthlyCost myProperty={myProperty} />
          </div>
          <Modal
            modalClassName="date-details"
            toggle={() => setShowDateModal(false)}
            isOpen={showDateModal}
          >
            <ModalBody>
              <div className="mx-auto  p-2 card">
                <ScheduleCard
                  modalDates={modalDates}
                  myProperty={myProperty}
                  setShowDateModal={setShowDateModal}
                />
              </div>
            </ModalBody>
          </Modal>
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
