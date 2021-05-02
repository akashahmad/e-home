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
  const [showPrincipal, setShowPrincipal] = useState(false);
  const [showMortage, setShowMortage] = useState(false);
  const [showTax, setShowtax] = useState(false);
  const [showInsurance, setShowInsurance] = useState(false);
  const [showHOA, setShowHOA] = useState(false);

  // for tabs values
  const [interestvalues, setInterestValues] = useState(null);
  const [estimatedMonthlyCost, setEstimatedMonthlyCost] = useState(null);
  const [homeInsurance, setHomeInsurance] = useState(null);
  const [taxRate, setTaxRate] = useState(null);
  const [modalDates, setModalDates] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  console.log(myProperty, "check my property");
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
    // Now calculating propertytax
    let yearTaxRate = parseInt(myProperty?.listPrice) * 0.0248;
    let monthTaxRate = yearTaxRate / 12;
    setTaxRate({
      percentage: 2.48,
      yearTaxRate,
      monthTaxRate,
    });
    // Now calulating home insurance
    let perYearInsurance = parseInt(myProperty?.listPrice) * 0.0042;
    let perMonthInsurance = perYearInsurance / 12;
    setHomeInsurance({
      perYearInsurance,
      perMonthInsurance,
    });

    let _copy = {
      homePrice: myProperty?.listPrice,
      downPayment: 0,
      downPaymentPercentAge: 20,
      loanProgram: "Fixed30Year",
      interestRate: 2.875,
    };
    _copy.downPayment = parseInt(myProperty?.listPrice) * 0.2;
    let remainingCost =
      parseInt(myProperty?.listPrice) - parseInt(myProperty?.listPrice) * 0.2;
    let interestPerYear = remainingCost * 0.02875;
    let principleInterest = interestPerYear * 17.23;
    let principleInterestPerMonth = (remainingCost + principleInterest) / 360;
    _copy.principleInterestPerMonth = principleInterestPerMonth;
    let estimatedMonthlyCost =
      (remainingCost +
        principleInterest +
        perYearInsurance * 30 +
        yearTaxRate * 30) /
      360;
    _copy.estimatedMonthlyCost = estimatedMonthlyCost;
    setInterestValues(_copy);
    // for calling related properties
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
      className={`property-details-content ${
        modalLoader ? "d-flex justify-content-center align-items-center" : ""
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
                          {myProperty.size ? (
                            <span>
                              {myProperty.size &&
                                myProperty.size
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                                  " sqft"}
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
                    onClick={() => setActiveMenu("priceTax")}
                  >
                    <a
                      href="#overview"
                      className={`bhJxVt ${activeMenuhandler("priceTax")}`}
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
                  <li
                    className="eVYrJu"
                    onClick={() => setActiveMenu("neighboorhood")}
                  >
                    <a
                      href="#overview"
                      className={`bhJxVt ${activeMenuhandler("neighboorhood")}`}
                    >
                      Neighborhood
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
              <AdviserCards agentData={agentData} lenderData={lenderData} myProperty={myProperty}/>
            </div>

            <ScheduleCard modalDates={modalDates} myProperty={myProperty}/>

            <div className="dHtGQa" id="cost">
              <h5 className="dTAnOx dZuCmF">Monthly cost</h5>
              <div className="ePSpFA">
                <span className="foiYRz">Estimated monthly cost</span>
                <h5 className="dTAnOx">
                  ${interestvalues?.estimatedMonthlyCost?.toFixed(2)}
                </h5>
              </div>
              <div className="fgVRFP">
                <div className="bnePEP">
                  <div className="iMXoIt">
                    <div
                      className="cwZLoX"
                      onClick={() => setShowPrincipal(!showPrincipal)}
                    >
                      <div className="gqqTSu">
                        <div className="jLwdhz">
                          <span className="iuVuVk">
                            Principal&amp; interest
                          </span>
                          <span className="cNBYuL">
                            $
                            {interestvalues?.principleInterestPerMonth?.toFixed(
                              2
                            )}
                            /mo
                          </span>
                        </div>
                        {/* switch icon */}
                        <div className="dropdownIcon">
                          {showPrincipal ? (
                            <i class="fa fa-angle-up"></i>
                          ) : (
                            <i class="fa fa-angle-down"></i>
                          )}
                        </div>
                        {/* switch icon */}
                      </div>
                    </div>
                  </div>
                  {showPrincipal && (
                    <div className="calculatorDetailDiv">
                      {/* Home Price */}
                      <div className="mb-4">
                        <label>Home price</label>
                        <div className="position-relative inputWithLogo leftInput">
                          <input
                            type="number"
                            className="w-100 "
                            min="10000"
                            defaultValue={interestvalues?.homePrice}
                          />
                          <span>$</span>
                        </div>
                      </div>
                      {/* Home Price */}
                      {/* Down Payment */}
                      <div className="mb-4 d-flex align-items-center">
                        <div className="col-7 pl-0">
                          <label>Down Payment</label>
                          <div className="position-relative leftInput">
                            <input
                              type="number"
                              className="w-100 leftInput"
                              defaultValue={interestvalues?.downPayment}
                            />
                            <span>$</span>
                          </div>
                        </div>
                        <div className="col-5 pl-0 pr-0">
                          <label className="opac-0">Percentage</label>
                          <div className="position-relative rightInput">
                            <input
                              type="number"
                              className="w-100 leftInput"
                              defaultValue={
                                interestvalues?.downPaymentPercentAge
                              }
                            />
                            <span>%</span>
                          </div>
                        </div>
                      </div>
                      {/* Down Payment */}
                      {/* Loan Program */}
                      <div className="mb-4 d-flex align-items-center">
                        <div className="col-7 pl-0">
                          <label>Loan program</label>
                          <div>
                            <select value={interestvalues?.loanProgram}>
                              <option value="Fixed30Year">30-year fixed</option>
                              <option value="Fixed15Year">15-year fixed</option>
                              <option value="ARM5">5/1 ARM</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-5 pl-0 pr-0">
                          <label>Interest rate</label>
                          <div className="position-relative rightInput">
                            <input
                              type="number"
                              className="w-100 leftInput"
                              defaultValue={interestvalues?.interestRate}
                            />
                            <span>%</span>
                          </div>
                        </div>
                      </div>
                      {/* Loan Program */}
                    </div>
                  )}
                </div>
                <div className="bnePEP">
                  <div className="sc-pscky iMXoIt">
                    <div
                      className="sc-pjHjD cwZLoX"
                      onClick={() => setShowMortage(!showMortage)}
                    >
                      <div className="gqqTSu">
                        <div className="jLwdhz">
                          <span className="iuVuVk">Mortgage nsurance</span>
                          <span className="cNBYuL">$0/mo</span>
                        </div>
                        {/* switch icon */}
                        <div className="dropdownIcon">
                          {showMortage ? (
                            <i class="fa fa-angle-up"></i>
                          ) : (
                            <i class="fa fa-angle-down"></i>
                          )}
                        </div>
                        {/* switch icon */}
                      </div>
                    </div>
                    {showMortage && (
                      <div className="calculatorDetailDiv">
                        <div className="d-flex align-items-center">
                          <input type="checkbox" />
                          <label className="mb-0 ml-2">
                            Include mortgage insurance
                          </label>
                        </div>
                        <span className="minorDetail">
                          Mortgage insurance is usually required for down
                          payments below 20%.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bnePEP">
                  <div className="sc-pscky iMXoIt">
                    <div
                      className="sc-pjHjD cwZLoX"
                      onClick={() => setShowtax(!showTax)}
                    >
                      <div className="gqqTSu">
                        <div className="jLwdhz">
                          <span className="iuVuVk">Property taxes</span>
                          <span className="cNBYuL">
                            ${taxRate?.monthTaxRate?.toFixed(2)}/mo
                          </span>
                        </div>
                        {/* switch icon */}
                        <div className="dropdownIcon">
                          {showTax ? (
                            <i class="fa fa-angle-up"></i>
                          ) : (
                            <i class="fa fa-angle-down"></i>
                          )}
                        </div>
                        {/* switch icon */}
                      </div>
                    </div>
                    {showTax && (
                      <div className="calculatorDetailDiv">
                        <span className="minorDetail">
                          This estimate is based on the home value and an
                          estimated local tax rate. Actual rate may vary.
                        </span>
                        <div className="d-flex align-items-end mt-4">
                          <div className="col-3">
                            <label>Home price</label>
                            <p>{myProperty?.listPrice}</p>
                          </div>
                          <div className="col-5">
                            <label>Tax rate</label>
                            <div className="position-relative rightInput">
                              <input
                                type="number"
                                className="w-100 leftInput"
                                defaultValue={taxRate?.percentage}
                              />
                              <span>%</span>
                            </div>
                          </div>
                          <div className="col-4">
                            <p className="mb-0">
                              = ${taxRate?.yearTaxRate?.toFixed(2)} /year
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bnePEP">
                  <div className="sc-pscky iMXoIt">
                    <div className="sc-pjHjD cwZLoX">
                      <div
                        className="gqqTSu"
                        onClick={() => setShowInsurance(!showInsurance)}
                      >
                        <div className="jLwdhz">
                          <span className="iuVuVk">Home insurance</span>
                          <span className="cNBYuL">
                            ${homeInsurance?.perMonthInsurance?.toFixed(2)}/mo
                          </span>
                        </div>
                        {/* switch icon */}
                        <div className="dropdownIcon">
                          {showInsurance ? (
                            <i class="fa fa-angle-up"></i>
                          ) : (
                            <i class="fa fa-angle-down"></i>
                          )}
                        </div>
                        {/* switch icon */}
                      </div>
                      {showInsurance && (
                        <div className="calculatorDetailDiv">
                          <div>
                            <div className="position-relative rightInput">
                              <input
                                type="number"
                                defaultValue={homeInsurance?.perYearInsurance?.toFixed(
                                  2
                                )}
                                className="w-100 leftInput"
                                style={{ paddingLeft: "30px" }}
                              />
                              <span>/ year</span>
                              <span style={{ left: "10px", right: "unset" }}>
                                $
                              </span>
                            </div>
                            <span className="minorDetail">
                              Some properties require monthly HOA dues to cover
                              common amenities or services.
                            </span>
                          </div>
                        </div>
                      )}
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
            </div>
            {myProperty.schools && (
              <div className="dHtGQa" id="schools">
                <h4 className="dTAnOx dZuCmF">Nearby schools in Marlboro</h4>
                <div className="eUOzkf">
                  <h5 className="bSxNCK">
                    Schools provided by the listing agent
                  </h5>
                  <div className="gtLCRl">
                    {myProperty.schools.elementary && (
                      <div>Elementary: {myProperty.schools.elementary}</div>
                    )}
                    {myProperty.schools.middle && (
                      <div>Middle: {myProperty.schools.middle}</div>
                    )}
                    {myProperty.schools.high && (
                      <div>High: {myProperty.schools.high}</div>
                    )}
                  </div>
                  <p className="fhpxsu">
                    This data may not be complete. We recommend contacting the
                    local school district to confirm school assignments for this
                    home.
                  </p>
                </div>
              </div>
            )}

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
                            {blog.postcontent ? (
                              <p>
                                {blog.postcontent.length > 150
                                  ? blog.postcontent
                                      .substring(0, 150)
                                      .concat("...")
                                  : blog.postcontent.length}
                              </p>
                            ) : (
                              <p></p>
                            )}
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
          <Modal
            modalClassName="date-details"
            toggle={() => setShowDateModal(false)}
            isOpen={showDateModal}
          >
            <ModalBody>
              <div className="mx-auto  p-2 card">
                <ScheduleCard modalDates={modalDates} myProperty={myProperty} setShowDateModal={setShowDateModal}/>
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
