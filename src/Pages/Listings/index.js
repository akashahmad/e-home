import React, { Component } from "react";
import "./Listings.css";
import PropertyCard from "../../Components/PropertyCard";
import MyHeader from "../../Components/MyHeader";
import MapProperty from "../../Components/MapProperty";
import PropertyDetails from "./../PropertyDetails";
import image16 from "../../assets/images/16.png";
import { Modal, ModalBody } from "reactstrap";
import { bePath, wpPath } from "../../apiPaths";
import axios from "axios";
import ReactPaginate from "react-paginate";
import CardLoader from "../../Components/mapCardPlaceHolder";
import {
  getAllAdverts,
  searchByMarket,
  getAllRental,
} from "../../store/actions/Auth";
import { connect } from "react-redux";
import { apiUrl, publicToken, privateToken } from "../../config";
import {
  rentMaxPriceValues,
  rentMinPriceValues,
  saleMaxPriceValues,
  bedsList,
  saleMinPriceValues,
} from "../../usageValues";
import { map } from "jquery";
import mapPlaceHolder from "../../assets/images/mapPlaceHolder.png";
class Listings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      activePropertyType: "sale",
      mapView: true,
      listView: false,
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      propertyModal: false,
      type: "Sale",
      myProperties: [],
      isLoader: false,
      beds: "",
      maxPrice: "",
      minPrice: "",
      baths: "",
      blogs: null,
      localData: null,
      error: false,
      isSearched: false,
      modalActive: null,
      modalLoader: false,
      showPriceModal: false,
      showBedModal: false,
      homeFilterValues: null,
      showHomeFilter: false,
      selectedHomeTypes: [],
      minSqft: "",
      maxSqft: "",
      showSqftModal: false,
      activeMls: "gsmls",
      newActiveType: "Residential",
      listingPageNumber: 1,
      listingSidedata: null,
      listingAllPages: 0,
      mapData: null,
    };
    window.scrollTo(0, 0);
  }

  componentWillReceiveProps(nextProps) {
    let { myProperties, mainLoader } = nextProps;
    let homeTypeFilter = [];
    if (!mainLoader && myProperties) {
      this.setState({ localData: myProperties });
    }
  }
  togglePropertyModal = () => {
    if (this.state.propertyModal) {
      this.props.history.replace(`/`);
      this.setState({ propertyModal: false, modalActive: null });
    }
  };

  // for settingData from map
  setDataFromMap = (data) => {
    this.setState({ listingSidedata: data });
  };

  // new function for loading left side listing
  loadListingsCard = (activeMLS, activeType, pageNumber) => {
    this.setState({ isLoader: true, listingSidedata: null });
    axios
      .get(
        bePath +
          `/propertiesListing?market=${activeMLS}&listingType=${activeType}&pageNumber=${pageNumber}`
      )
      .then((res) => {
        this.setState({
          listingSidedata: res.data.result.listing,
          listingPageNumber: parseInt(res.data.result.currentPage),
          listingAllPages: res.data.result.totalPages,
        });
        this.setState({ isLoader: false });
        if (!this.state.mapData) {
          this.setState({ mapData: res.data.result.listing });
        }
      })
      .catch((err) => {
        this.setState({ isLoader: false });
      });
  };
  loadMapHandler = (activeMLS, activeType) => {
    this.setState({ mapData: null });
    axios
      .get(
        bePath +
          "/mapLocations?market=" +
          activeMLS +
          "&listingtype=" +
          activeType +
          "&details=true&listingDate=>6/1/2015&images=true&pageNumber=1&pageSize=1000"
      )
      .then((res) => {
        this.setState({ mapData: res.data.result.listing });
      });
  };

  componentDidMount() {
    // new logic for paginated call
    this.loadListingsCard("gsmls", "Residential", 1);
    // new logic for paginated call ends

    // logic for loading mapData
    this.loadMapHandler(this.state.activeMls, this.state.newActiveType);
    // logic for loading mapData

    const path = this.props.history.location.pathname.split("/");
    if (
      this.props.history.location.state &&
      this.props.history.location.state.market != "" &&
      this.props.history.location.state.market != undefined
    ) {
      this.props.searchByMarket(this.props.history.location.state.market);
      this.setState({ market: this.props.history.location.state.market });
    }
    // else this.onChangeTypes(this.state.newActiveType);
    if (path[3]) {
      this.onCardClick("", "", "", path[3], "", "external");
    }
    let search = this.props.history.location.search;
    if (search) {
      if (search.indexOf("agentId") !== -1) {
        let agentId = search.split("=")[1];
        if (agentId) {
          axios
            .get(wpPath + "/advisors/get/agents/uid=" + agentId)
            .then((res) => {
              localStorage.setItem("agentData", JSON.stringify(res.data));
            });
        }
      } else if (search.indexOf("lenderId") !== -1) {
        let lenderId = search.split("=")[1];
        if (lenderId) {
          axios
            .get(wpPath + "/advisors/get/lenders/uid=" + lenderId)
            .then((res) => {
              localStorage.setItem("lenderData", JSON.stringify(res.data));
            });
        }
      }
    }
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault();
        localStorage.removeItem("agentData");
        localStorage.removeItem("lenderData");
      });
    }
    // call for blogs
    axios.get(wpPath + "/ehomesearch/get/posts").then((res) => {
      this.setState({ blogs: res.data });
    });
  }

  handleFormChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onCardClick = (state, city, zip, id, market, type) => {
    if (!type) {
      let url =
        (state ? state.split(" ").join("_") : "") +
        "-" +
        (city ? city.split(" ").join("_") : "") +
        "-" +
        zip.split(" ").join("_") +
        `/${id}`;
      this.props.history.replace(`/homedetails/${url}`, {
        propertyId: id,
        market,
      });
    }
    let config = {
      headers: {
        Authorization: "Bearer " + publicToken,
      },
    };
    this.setState({ modalLoader: true });
    axios
      .get(
        bePath +
          "/singleProperty?id=" +
          id +
          "&market=" +
          this.state.activeMls +
          "&details=true&extended=true&images=true",
        config
      )
      .then((res) => {
        this.setState({ modalActive: res.data.result.listing[0] });
        setTimeout(() => {
          this.setState({ modalLoader: false });
        }, 1000);
      });
    this.setState({ propertyModal: true });
  };

  filterHandler = (pageNumber) => {
    let {
      beds,
      minPrice,
      maxPrice,
      searchText,
      baths,
      maxSqft,
      minSqft,
      newActiveType,
    } = this.state;
    if (
      searchText ||
      minPrice ||
      maxPrice ||
      beds ||
      baths ||
      maxSqft ||
      minSqft
    ) {
      if (minPrice && maxPrice) {
        if (minPrice >= maxPrice) {
          window.confirm("Please add valid Max Price");
          return;
        }
      }
      this.setState({ isSearched: true, listingSidedata: null, mapData: null });
      let config = {
        headers: {
          Authorization: "Bearer " + privateToken,
        },
      };
      this.setState({ isLoader: true, error: false });
      axios
        .get(
          bePath +
            "/searchProperties?market=" +
            this.state.activeMls +
            "&listingtype=" +
            newActiveType +
            "&beds=" +
            beds +
            "&listPrice=" +
            `${minPrice ? minPrice : 0}:${
              maxPrice ? maxPrice : 999999999999999999
            }` +
            "&size=" +
            `${minSqft ? minSqft : 0}:${
              maxSqft ? maxSqft : 999999999999999999
            }` +
            "&baths=" +
            baths +
            "&keyword=" +
            searchText +
            "&extended=true&detils=true&listingDate=>6/1/2015&pageNumber=" +
            pageNumber,
          config
        )
        .then((res) => {
          if (res.data.result.listing.length) {
            this.setState({
              listingSidedata: res.data.result.listing,
              listingPageNumber: parseInt(res.data.result.currentPage),
              listingAllPages: res.data.result.totalPages,
              isLoader: false,
              mapData: res.data.result.listing,
            });
          }
        })
        .catch((err) => {
          this.setState({ isLoader: false, error: true });
        });
    }
  };

  serchSubmitHandler = (e) => {
    e.preventDefault();
    this.filterHandler(1);
  };
  resetSearchFilters = () => {
    this.setState({
      searchText: "",
      minPrice: "",
      maxPrice: "",
      beds: "",
      baths: "",
      error: false,
      isSearched: false,
    });
    window.location.reload();
  };
  // on pagination Change
  pageChangeHandler = (value) => {
    let newPage = value.selected + 1;
    this.setState({ listingPageNumber: newPage });
    if (this.state.isSearched) {
      this.filterHandler(newPage);
      return;
    }
    this.loadListingsCard(
      this.state.activeMls,
      this.state.newActiveType,
      newPage
    );
  };
  // on market change Handler
  changeMarketHandler = (value) => {
    this.setState({ activeMls: value }, function () {
      this.loadListingsCard(value, this.state.newActiveType, 1);
      this.loadMapHandler(value, this.state.newActiveType);
    });
  };
  // on change types
  onChangeTypes = (value) => {
    this.setState(
      {
        newActiveType: value,
        minPrice: "",
        maxPrice: "",
        searchText: "",
        beds: "",
        baths: "",
        maxSqft: "",
        maxSqft: "",
      },
      function () {
        this.loadListingsCard(this.state.activeMls, value, 1);
        this.loadMapHandler(this.state.activeMls, value);
      }
    );
  };
  render() {
    const {
      onCardClick,
      togglePropertyModal,

      handleFormChange,
      closePropertyModal,
    } = this;
    const { history } = this.props;
    let {
      activeProperty,
      mapView,
      propertyModal,
      activePropertyType,
      searchText,
      beds,
      baths,
      minPrice,
      maxPrice,
      type,
      isLoader,
      localData,
      modalLoader,
      showMinPrice,
      showMaxPrice,
      showPriceModal,
      showBedModal,
      homeFilterValues,
      showHomeFilter,
      selectedHomeTypes,
      minSqft,
      maxSqft,
      showMinSqft,
      showMaxSqft,
      showSqftModal,
      listingSidedata,
      newActiveType,
      mapData,
    } = this.state;
    const propertyId = this.props.location.state
      ? this.props.location.state.propertyId
      : "";
    const propertyMarket = this.props.location.state
      ? this.props.location.state.market
      : "";
    let myProperties = localData && localData.listings;

    //   method for formatiing price in US dollars
    let dollarUSLocale = Intl.NumberFormat("en-US");

    return (
      <>
        <MyHeader
          heading="Looking For A New Home"
          subHeading="Don’t worry eHomeoffer has you covered with many options"
        />
        <section className="search-form-area">
          <div className="container-fluid">
            <div className="right-button">
              <a
                href="#"
                className={newActiveType == "Residential" && "sale"}
                onClick={() => this.onChangeTypes("Residential")}
              >
                For Sale
              </a>
              <a
                href="#"
                className={newActiveType == "Rental" && "rent"}
                onClick={() => this.onChangeTypes("Rental")}
              >
                For Rent
              </a>
            </div>
            <div className="form-search">
              <form onSubmit={(e) => this.serchSubmitHandler(e)}>
                <div className="group-form search-form big-search">
                  <input
                    type="text"
                    onChange={handleFormChange}
                    defaultValue={searchText}
                    name="searchText"
                    placeholder="Property ID, Name, Delivery address, City, Zip, Sub division, Area"
                    id="searchText"
                  />
                </div>
                {/* <div className='group-form baths-form'>
                  <select id='locations' name='locations'>
                    <option value=''>Locations</option>
                    <option value='2'>All NJ</option>
                    <option value='5'>North NJ</option>
                    <option value='7'>Central NJ</option>
                    <option value='5'>South NJ</option>
                    <option value='7'>The Shore NJ</option>
                  </select>
                </div> */}
                <div className="group-form zillow-button-div position-relative">
                  <div
                    onClick={() =>
                      this.setState({
                        showPriceModal: !showPriceModal,
                        showBedModal: false,
                        showHomeFilter: false,
                        showSqftModal: false,
                      })
                    }
                    className="zillowButton"
                  >
                    {maxPrice || minPrice
                      ? (minPrice
                          ? `$${dollarUSLocale.format(minPrice)}`
                          : "Upto") +
                        "-" +
                        (maxPrice
                          ? `$${dollarUSLocale.format(maxPrice)}`
                          : " Any")
                      : "Price"}
                  </div>
                  {showPriceModal && (
                    <div className="priceModal">
                      <p className="title">Price Range</p>
                      <div className="d-flex col-12 px-0">
                        <div className="col-6 pl-0">
                          <input
                            type="number"
                            value={minPrice ? minPrice : null}
                            onChange={handleFormChange}
                            name="minPrice"
                            placeholder="Min"
                            min="100"
                            id="minPrice"
                            onFocus={() =>
                              this.setState({
                                showMinPrice: true,
                                showMaxPrice: false,
                              })
                            }
                          />
                          {showMinPrice && (
                            <div>
                              {activePropertyType === "sale" ? (
                                <ul className="priceFilterList">
                                  {saleMinPriceValues.map((price, index) => {
                                    return (
                                      <li
                                        key={index}
                                        onClick={() =>
                                          this.setState({
                                            minPrice: price.value,
                                          })
                                        }
                                      >
                                        {price.text}
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : (
                                <ul className="priceFilterList">
                                  {rentMinPriceValues.map((price, index) => {
                                    return (
                                      <li
                                        key={index}
                                        onClick={() =>
                                          this.setState({
                                            minPrice: price.value,
                                          })
                                        }
                                      >
                                        {price.text}
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="col-6 pr-0">
                          <input
                            type="number"
                            value={maxPrice ? maxPrice : null}
                            onChange={handleFormChange}
                            name="maxPrice"
                            placeholder="Max"
                            min="100"
                            id="maxPrice"
                            onFocus={() =>
                              this.setState({
                                showMinPrice: false,
                                showMaxPrice: true,
                              })
                            }
                          />
                          {showMaxPrice && (
                            <div>
                              {activePropertyType === "sale" ? (
                                <ul className="priceFilterList">
                                  {saleMaxPriceValues.map((price, index) => {
                                    return (
                                      <li
                                        key={index}
                                        onClick={() =>
                                          this.setState({
                                            maxPrice: price.value,
                                          })
                                        }
                                      >
                                        {price.text}
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : (
                                <ul className="priceFilterList">
                                  {rentMaxPriceValues.map((price, index) => {
                                    return (
                                      <li
                                        key={index}
                                        onClick={() =>
                                          this.setState({
                                            maxPrice: price.value,
                                          })
                                        }
                                      >
                                        {price.text}
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="filterBottomStrip d-flex justify-content-end">
                        <div
                          className="doneButton"
                          onClick={() =>
                            this.setState({
                              showPriceModal: !showPriceModal,
                              showMaxPrice: false,
                              showMinPrice: false,
                            })
                          }
                        >
                          Done
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="group-form zillow-button-div position-relative">
                  <div
                    className="zillowButton"
                    onClick={() =>
                      this.setState({
                        showBedModal: !showBedModal,
                        showPriceModal: false,
                        showHomeFilter: false,
                        showSqftModal: false,
                      })
                    }
                  >
                    {beds || baths
                      ? (beds ? `${beds}Bd` : "0bd") +
                        "," +
                        (baths ? `${baths}Ba` : " 0ba")
                      : "Beds & Baths"}
                  </div>

                  {showBedModal && (
                    <div className="priceModal">
                      <p className="title mb-0">Bedrooms</p>
                      <div className="bedsSelectRow d-flex">
                        {bedsList &&
                          bedsList.map((bed, index) => {
                            let isSelected = beds === bed.value;
                            return (
                              <div
                                style={{
                                  backgroundColor: isSelected ? "#336699" : "",
                                  color: isSelected ? "white" : "",
                                }}
                                onClick={() =>
                                  this.setState({ beds: bed.value })
                                }
                                className="bedSelectButtn"
                                key={index}
                              >
                                {bed.text}
                              </div>
                            );
                          })}
                      </div>
                      <p className="title mt-4 mb-0">Bedrooms</p>
                      <div className="bedsSelectRow d-flex">
                        {bedsList &&
                          bedsList.map((bed, index) => {
                            let isSelected = baths === bed.value;
                            return (
                              <div
                                style={{
                                  backgroundColor: isSelected ? "#336699" : "",
                                  color: isSelected ? "white" : "",
                                }}
                                onClick={() =>
                                  this.setState({ baths: bed.value })
                                }
                                className="bedSelectButtn"
                                key={index}
                              >
                                {bed.text}
                              </div>
                            );
                          })}
                      </div>
                      <div className="filterBottomStrip d-flex justify-content-end">
                        <div
                          className="doneButton"
                          onClick={() =>
                            this.setState({
                              showBedModal: false,
                            })
                          }
                        >
                          Done
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="group-form zillow-button-div position-relative">
                  <div
                    className="zillowButton"
                    onClick={() =>
                      this.setState({
                        showSqftModal: !showSqftModal,
                        showPriceModal: false,
                        showBedModal: false,
                        showHomeFilter: false,
                      })
                    }
                  >
                    {minSqft || maxSqft
                      ? (minSqft ? `${minSqft}sq.ft` : "Upto") +
                        "-" +
                        (maxSqft ? `${maxSqft}sq.ft` : " Any")
                      : "sq.ft"}
                  </div>
                  {showSqftModal && (
                    <div className="priceModal">
                      <p className="title">SQFT</p>
                      <div className="d-flex col-12 px-0">
                        <div className="col-6 pl-0">
                          <input
                            type="number"
                            defaultValue={minSqft ? minSqft : null}
                            onChange={handleFormChange}
                            name="minSqft"
                            placeholder="Min"
                            min="100"
                            id="minSqft"
                            onFocus={() =>
                              this.setState({
                                showMinSqft: true,
                                showMaxSqft: false,
                              })
                            }
                          />
                          {showMinSqft && (
                            <ul className="priceFilterList">
                              <li
                                onClick={() => this.setState({ minSqft: "" })}
                              >
                                Any
                              </li>
                              <li
                                onClick={() => this.setState({ minSqft: 320 })}
                              >
                                320 sq.ft
                              </li>
                              <li
                                onClick={() => this.setState({ minSqft: 500 })}
                              >
                                500 sq.ft
                              </li>
                            </ul>
                          )}
                        </div>

                        <div className="col-6 pr-0">
                          <input
                            type="number"
                            defaultValue={maxSqft ? maxSqft : null}
                            onChange={handleFormChange}
                            name="maxSqft"
                            placeholder="Max"
                            min="100"
                            id="maxSqft"
                            onFocus={() =>
                              this.setState({
                                showMinSqft: false,
                                showMaxSqft: true,
                              })
                            }
                          />
                          {showMaxSqft && (
                            <ul className="priceFilterList">
                              <li
                                onClick={() => this.setState({ maxSqft: 1200 })}
                              >
                                1200 sq.ft
                              </li>
                              <li
                                onClick={() => this.setState({ maxSqft: 1500 })}
                              >
                                1500 sq.ft
                              </li>
                              <li
                                onClick={() => this.setState({ maxSqft: 2000 })}
                              >
                                2000 sq.ft
                              </li>
                              <li
                                onClick={() => this.setState({ maxSqft: 2500 })}
                              >
                                2500 sq.ft
                              </li>
                              <li
                                onClick={() => this.setState({ maxSqft: "" })}
                              >
                                Any
                              </li>
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="filterBottomStrip d-flex justify-content-end">
                        <div
                          className="doneButton"
                          onClick={() =>
                            this.setState({
                              showSqftModal: !showSqftModal,
                              showMinSqft: false,
                              showMaxSqft: false,
                            })
                          }
                        >
                          Done
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="group-form submit-button">
                  <button type="submit">Search</button>
                </div>
              </form>
              {this.state.isSearched && (
                <button
                  onClick={() => this.resetSearchFilters()}
                  className="ml-2 resetButton"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {mapView ? (
          <section className="listing-sec-area">
            <div className="container-fluid">
              <div className="row">
                <div class="col-lg-6 col-md-12 col-sm-12 listing-column">
                  <div class="listing-inner">
                    <div class="title-area">
                      {/* <h3>{this.state.market ? this.state.market : 'Garden State'}, 57701</h3> */}
                      {/* {listingSidedata && listingSidedata.length ? (
                        <h3>{listingSidedata.length}</h3>
                      ) : (
                        <h3>...</h3>
                      )} */}
                      <div class="right-area">
                        <p>Select Market</p>
                        <select
                          onChange={(e) =>
                            this.changeMarketHandler(e.target.value)
                          }
                          defaultValue={this.state.activeMls}
                        >
                          <option value="cjmls">Central Jersey</option>
                          <option value="gsmls">Garden State</option>
                          <option value="mormls">
                            Monmouth Ocean Regional
                          </option>
                          <option value="njmls">New Jersey</option>
                        </select>
                      </div>
                    </div>

                    <div className="listing-box">
                      {listingSidedata && (
                        <ReactPaginate
                          previousLabel={"Prev"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          pageCount={this.state.listingAllPages}
                          activeClassName={"paginationActive"}
                          disabledClassName={"paginationDisabled"}
                          breakClassName={"paginationBreak"}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          containerClassName={"listingPagination"}
                          onPageChange={this.pageChangeHandler}
                          disableInitialCallback={true}
                          initialPage={this.state.listingPageNumber - 1}
                        />
                      )}
                      {this.state.error && (
                        <p className="searchError">
                          Unable to find results! Please modify your search.
                        </p>
                      )}
                      {isLoader ? (
                        <div className="row clearfix m-0">
                          <CardLoader />
                          <CardLoader />
                          <CardLoader />
                          <CardLoader />
                          <CardLoader />
                          <CardLoader />
                        </div>
                      ) : (
                        <div className="row clearfix m-0">
                          {activeProperty ? (
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 px-2">
                              <PropertyCard
                                propertyValues={activeProperty}
                                history={history}
                              />
                            </div>
                          ) : (
                            <>
                              {!isLoader ? (
                                listingSidedata &&
                                listingSidedata.map((item, x, idx) => {
                                  return (
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 px-2">
                                      <PropertyCard
                                        onCardClick={onCardClick}
                                        propertyValues={item}
                                        history={history}
                                      />
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="row clearfix m-0">
                                  <CardLoader />
                                  <CardLoader />
                                  <CardLoader />
                                  <CardLoader />
                                  <CardLoader />
                                  <CardLoader />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12 map-column">
                  {!isLoader ? (
                    <div className="map-area">
                      {mapData && !this.state.modalActive && (
                        <div className="map-box">
                          <MapProperty
                            setDataFromMap={this.setDataFromMap}
                            propertiesList={mapData && mapData ? mapData : []}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mapPlaceHolder">
                      <img src={mapPlaceHolder} className="w-100" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="listing-sec-area">
            <div className="container-fluid">
              <div className="col-lg-12 col-md-12 col-sm-12 listing-column">
                <div className="listing-inner">
                  <div className="title-area">
                    <h3>Rapid City, 57701</h3>
                    <div className="right-area">
                      <p>10 Homes</p>
                      <p>
                        Sort by{" "}
                        <a href="#">
                          Relevant Listing{" "}
                          <span>
                            <img src={image16} alt="" />
                          </span>
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="listing-box">
                    <div className="row clearfix">
                      {myProperties ? (
                        myProperties.map((item, x, idx) => {
                          if (x < 100) {
                            return (
                              <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                                <PropertyCard
                                  propertyValues={item}
                                  history={history}
                                />
                              </div>
                            );
                          }
                        })
                      ) : (
                        <div class="lds-ring">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {
          <Modal
            modalClassName="property-details"
            toggle={togglePropertyModal}
            isOpen={propertyModal}
          >
            <ModalBody>
              <PropertyDetails
                blogsData={this.state.blogs}
                history={history}
                propertyId={propertyId}
                propertyMarket={propertyMarket}
                propertyType={type}
                myProperty={this.state.modalActive}
                onCardClick={onCardClick}
                localData={localData}
                isSearched={this.state.isSearched}
                modalLoader={modalLoader}
              />
            </ModalBody>
          </Modal>
        }
      </>
    );
  }
}

// export default GoogleApiWrapper({
//     apiKey: "AIzaSyBhTlkgDDH8kNV8Aj0G65C-n8RN-TlXxy4 "
// })(Listings);

const mapStateToProps = (state) => {
  return {
    myProperties: state.myProperties,
    mainLoader: state.loader,
  };
};

const mapDispatchToProps = { getAllAdverts, searchByMarket, getAllRental };

export default connect(mapStateToProps, mapDispatchToProps)(Listings);
