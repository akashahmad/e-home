import React, { Component } from 'react';
import './Listings.css';
import PropertyCard from '../../Components/PropertyCard';
import MyHeader from '../../Components/MyHeader';
import MapProperty from '../../Components/MapProperty';
import PropertyDetails from './../PropertyDetails';
import image16 from '../../assets/images/16.png';
import { Modal, ModalBody } from 'reactstrap';
import axios from 'axios';
import { getAllAdverts, searchByMarket, getAllRental } from '../../store/actions/Auth';
import { connect } from 'react-redux';
import { apiUrl, publicToken,privateToken } from '../../config';
class Listings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      activePropertyType: 'sale',
      mapView: true,
      listView: false,
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      propertyModal: false,
      type: 'Sale',
      myProperties: [],
      isLoader: false,
      beds: '',
      maxPrice: '',
      minPrice: '',
      baths: '',
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
      minSqft: '',
      maxSqft: '',
      showSqftModal: false,
    };
    window.scrollTo(0, 0);
  }
  onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  componentWillReceiveProps(nextProps) {
    let { myProperties,mainLoader} = nextProps;
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
  onHomeSelect = (value) => {
    let arr = [...this.state.selectedHomeTypes];
    if (arr.indexOf(value) === -1) {
      arr.push(value);
    } else {
      arr = arr.filter((item) => item !== value);
    }
    this.setState({ selectedHomeTypes: arr });
  };
  componentDidMount() {
    const path = this.props.history.location.pathname.split('/');
    if (this.props.history.location.state && this.props.history.location.state.market != '' && this.props.history.location.state.market != undefined) {
      this.props.searchByMarket(this.props.history.location.state.market);
      this.setState({ market: this.props.history.location.state.market });
    } else this.handelPropertyType(this.state.activePropertyType);
    if (path[3]) {
      this.onCardClick('', '', '', path[3], '', 'external');
    }
    let search = this.props.history.location.search;
    if (search) {
      if (search.indexOf('agentId') !== -1) {
        let agentId = search.split('=')[1];
        if (agentId) {
          axios.get('https://ehomeoffer.wpengine.com/index.php?rest_route=/advisors/get/agents/uid=' + agentId).then((res) => {
            localStorage.setItem('agentData', JSON.stringify(res.data));
          });
        }
      } else if (search.indexOf('lenderId') !== -1) {
        let lenderId = search.split('=')[1];
        if (lenderId) {
          axios.get('https://ehomefunding.wpengine.com/index.php?rest_route=/advisors/get/lenders/uid=' + lenderId).then((res) => {
            localStorage.setItem('lenderData', JSON.stringify(res.data));
          });
        }
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', (ev) => {
        ev.preventDefault();
        localStorage.removeItem('agentData');
        localStorage.removeItem('lenderData');
      });
    }
    // call for blogs
    axios.get('https://ehomeoffer.wpengine.com/index.php?rest_route=/ehomesearch/get/posts').then((res) => {
      this.setState({ blogs: res.data });
    });

    // this.props.getAllAdverts()
  }
  onSaleProperties = () => {
    this.setState({ type: 'Sale' });
    if (this.props.history.location.state && this.props.history.location.state.market != '' && this.props.history.location.state.market != undefined) {
      this.props.searchByMarket(this.props.history.location.state.market);
      this.setState({ market: this.props.history.location.state.market });
    } else this.props.getAllAdverts();
  };

  onRentProperties = () => {
    this.setState({ type: 'Rent' });
    this.props.getAllRental();
  };

  handelPropertyType = (type) => {
    if (type === 'sale') {
      this.props.getAllAdverts();
      this.setState({ activePropertyType: 'sale', isLoader: true, minPrice: '', maxPrice: '', searchText: '', beds: '', baths: '', maxSqft: '', maxSqft: '' });
     
    } else {
      this.props.getAllRental();
      this.setState({ activePropertyType: 'rent', isLoader: true, minPrice: '', maxPrice: '', searchText: '', beds: '', baths: '', maxSqft: '', maxSqft: '' });
     
    }
  };

  handleFormChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onCardClick = (state, city, zip, id, market, type) => {
    if (!type) {
      let url = (state ? state.split(' ').join('_') : '') + '-' + (city ? city.split(' ').join('_') : '') + '-' + zip.split(' ').join('_') + `/${id}`;
      this.props.history.replace(`/homedetails/${url}`, {
        propertyId: id,
        market,
      });
    }
    let config = {
      headers: {
        Authorization: 'Bearer ' + publicToken,
      },
    };
    this.setState({ modalLoader: true });
    axios.get(apiUrl + 'ws/listings/get?id=' + id + '&market=gsmls&details=true&extended=true&images=true', config).then((res) => {
      this.setState({ modalActive: res.data.result.listings[0] });
      setTimeout(() => {
        this.setState({ modalLoader: false });
      }, 2500);
    });
    this.setState({ propertyModal: true });
  };

  onMarkerClick = (props, marker, e) => {
    let activeProperty = '';
    let properties = this.state.propertiesData.map((x) => {
      if (props.id == x.id) activeProperty = x;
    });
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      activeProperty: activeProperty,
    });
  };
  clearFilter = () => {
    this.setState({ activeProperty: '' });
  };
  onListPress = () => {
    this.setState({ listView: true, mapView: false });
  };

  onMapPress = () => {
    this.setState({ mapView: true, listView: false });
  };
  serchSubmitHandler = (e) => {
    e.preventDefault();
    let { beds, minPrice, maxPrice, searchText, baths, activePropertyType, maxSqft, minSqft } = this.state;
    if (searchText || minPrice || maxPrice || beds || baths || maxSqft || minSqft) {
      if (minPrice && maxPrice) {
        if (minPrice >= maxPrice) {
          window.confirm('Please add valid Max Price');
          return;
        }
      }
      this.setState({ isSearched: true });
      let config = {
        headers: {
          Authorization: 'Bearer ' + privateToken,
        },
      };
      this.setState({ isLoader: true, error: false });
      axios
        .get(
          apiUrl +
            'ws/listings/search?market=gsmls&listingtype=' +
            (activePropertyType === 'sale' ? 'Residential' : 'Rental') +
            '&beds=' +
            beds +
            '&listPrice=' +
            `${minPrice ? minPrice : 0}:${maxPrice ? maxPrice : 999999999999999999}` +
            '&size=' +
            `${minSqft ? minSqft : 0}:${maxSqft ? maxSqft : 999999999999999999}` +
            '&baths=' +
            baths +
            '&keyword=' +
            searchText +
            '&extended=true&detils=true&listingDate=>6/1/2015',
          config,
        )
        .then((res) => {
          if (res.data.result.listings.length) {
            this.setState({ localData: res.data.result });
            this.setState({ isLoader: false });
            return;
          }
          this.setState({ error: true, isLoader: false, localData: null });
        })
        .catch((err) => {
          this.setState({ isLoader: false, error: true });
        });
    }
  };
  resetSearchFilters = () => {
    this.setState({
      searchText: '',
      minPrice: '',
      maxPrice: '',
      beds: '',
      baths: '',
      error: false,
      isSearched: false,
    });
    window.location.reload();
    this.handelPropertyType(this.state.activePropertyType);
  };
  singleFilterHandler = () => {};
  render() {
    const { onCardClick, togglePropertyModal, handelPropertyType, handleFormChange, closePropertyModal } = this;
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
    } = this.state;
    const propertyId = this.props.location.state ? this.props.location.state.propertyId : '';
    const propertyMarket = this.props.location.state ? this.props.location.state.market : '';
    let myProperties = localData && localData.listings;
    // bed and bath list values
    const bedsList = [
      {
        text: 'Any',
        value: '',
      },
      {
        text: '1',
        value: '1',
      },
      {
        text: '2',
        value: '2',
      },
      {
        text: '3',
        value: '3',
      },
      {
        text: '4',
        value: '4',
      },
      {
        text: '5',
        value: '5',
      },
    ];
    //  Price sale values
    const saleMinPriceValues = [
      {
        text: '$0+',
        value: '',
      },
      {
        text: '$100,000+',
        value: 100000,
      },
      {
        text: '$200,000+',
        value: 200000,
      },
    ];
    const saleMaxPriceValues = [
      {
        text: '$500,000',
        value: 500000,
      },
      {
        text: '$600,000',
        value: 600000,
      },
      {
        text: '$700,000',
        value: 700000,
      },
      {
        text: '$800,000',
        value: 800000,
      },
      {
        text: '$900,000',
        value: 900000,
      },
      {
        text: '$1M',
        value: 1000000,
      },
      {
        text: '$1.25M',
        value: 1250000,
      },
      {
        text: '$1.5M',
        value: 1500000,
      },
      {
        text: '$1.75M',
        value: 1750000,
      },
      {
        text: 'Any Price',
        value: '',
      },
    ];
    //  Price Rent values
    const rentMinPriceValues = [
      {
        text: '$0+',
        value: '',
      },
      {
        text: '$200+',
        value: 200,
      },
      {
        text: '$400+',
        value: 400,
      },
      {
        text: '$600++',
        value: 600,
      },
    ];

    const rentMaxPriceValues = [
      {
        text: '$400',
        value: 400,
      },
      {
        text: '$600',
        value: 600,
      },
      {
        text: '$800',
        value: 800,
      },
      {
        text: '$1,000',
        value: 1000,
      },
      {
        text: '$1,200',
        value: 1200,
      },
      {
        text: '$1,400',
        value: 1400,
      },
      {
        text: '$1,600',
        value: 1600,
      },
      {
        text: '$1,800',
        value: 1800,
      },
      {
        text: '$2,000',
        value: 1800,
      },
      {
        text: 'Any Price',
        value: '',
      },
    ];
    //   method for formatiing price in US dollars
    let dollarUSLocale = Intl.NumberFormat('en-US');

    return (
      <>
        <MyHeader heading='Looking For A New Home' subHeading='Don’t worry eHomeoffer has you covered with many options' />
        <section className='search-form-area'>
          <div className='container-fluid'>
            <div className='right-button'>
              <a
                href='#'
                className={activePropertyType == 'sale' && activePropertyType}
                onClick={(e) => {
                  e.preventDefault();
                  handelPropertyType('sale');
                }}
              >
                For Sale
              </a>
              <a
                href='#'
                className={activePropertyType == 'rent' && activePropertyType}
                onClick={(e) => {
                  e.preventDefault();
                  handelPropertyType('rent');
                }}
              >
                For Rent
              </a>
            </div>
            <div className='form-search'>
              <form onSubmit={(e) => this.serchSubmitHandler(e)}>
                <div className='group-form search-form big-search'>
                  <input type='text'  onChange={handleFormChange} defaultValue={searchText} name='searchText' placeholder='Property ID, Name, Delivery address, City, Zip, Sub division, Area' id='searchText' />
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
                <div className='group-form zillow-button-div position-relative'>
                  <div
                    onClick={() =>
                      this.setState({
                        showPriceModal: !showPriceModal,
                        showBedModal: false,
                        showHomeFilter: false,
                        showSqftModal: false,
                      })
                    }
                    className='zillowButton'
                  >
                    {maxPrice || minPrice ? (minPrice ? `$${dollarUSLocale.format(minPrice)}` : 'Upto') + '-' + (maxPrice ? `$${dollarUSLocale.format(maxPrice)}` : ' Any') : 'Price'}
                  </div>
                  {showPriceModal && (
                    <div className='priceModal'>
                      <p className='title'>Price Range</p>
                      <div className='d-flex col-12 px-0'>
                        <div className='col-6 pl-0'>
                          <input
                            type='number'
                            value={minPrice ? minPrice : null}
                            onChange={handleFormChange}
                            name='minPrice'
                            placeholder='Min'
                            min='100'
                            id='minPrice'
                            onFocus={() =>
                              this.setState({
                                showMinPrice: true,
                                showMaxPrice: false,
                              })
                            }
                          />
                          {showMinPrice && (
                            <div>
                              {activePropertyType === 'sale' ? (
                                <ul className='priceFilterList'>
                                  {saleMinPriceValues.map((price, index) => {
                                    return (
                                      <li key={index} onClick={() => this.setState({ minPrice: price.value })}>
                                        {price.text}
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : (
                                <ul className='priceFilterList'>
                                  {rentMinPriceValues.map((price, index) => {
                                    return (
                                      <li key={index} onClick={() => this.setState({ minPrice: price.value })}>
                                        {price.text}
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>

                        <div className='col-6 pr-0'>
                          <input
                            type='number'
                            value={maxPrice ? maxPrice : null}
                            onChange={handleFormChange}
                            name='maxPrice'
                            placeholder='Max'
                            min='100'
                            id='maxPrice'
                            onFocus={() =>
                              this.setState({
                                showMinPrice: false,
                                showMaxPrice: true,
                              })
                            }
                          />
                          {showMaxPrice && (
                            <div>
                              {activePropertyType === 'sale' ? (
                                <ul className='priceFilterList'>
                                  {saleMaxPriceValues.map((price, index) => {
                                    return (
                                      <li key={index} onClick={() => this.setState({ maxPrice: price.value })}>
                                        {price.text}
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : (
                                <ul className='priceFilterList'>
                                  {rentMaxPriceValues.map((price, index) => {
                                    return (
                                      <li key={index} onClick={() => this.setState({ maxPrice: price.value })}>
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
                      <div className='filterBottomStrip d-flex justify-content-end'>
                        <div
                          className='doneButton'
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
                <div className='group-form zillow-button-div position-relative'>
                  <div
                    className='zillowButton'
                    onClick={() =>
                      this.setState({
                        showBedModal: !showBedModal,
                        showPriceModal: false,
                        showHomeFilter: false,
                        showSqftModal: false,
                      })
                    }
                  >
                    {beds || baths ? (beds ? `${beds}Bd` : '0bd') + ',' + (baths ? `${baths}Ba` : ' 0ba') : 'Beds & Baths'}
                  </div>

                  {showBedModal && (
                    <div className='priceModal'>
                      <p className='title mb-0'>Bedrooms</p>
                      <div className='bedsSelectRow d-flex'>
                        {bedsList &&
                          bedsList.map((bed, index) => {
                            let isSelected = beds === bed.value;
                            return (
                              <div
                                style={{
                                  backgroundColor: isSelected ? '#336699' : '',
                                  color: isSelected ? 'white' : '',
                                }}
                                onClick={() => this.setState({ beds: bed.value })}
                                className='bedSelectButtn'
                                key={index}
                              >
                                {bed.text}
                              </div>
                            );
                          })}
                      </div>
                      <p className='title mt-4 mb-0'>Bedrooms</p>
                      <div className='bedsSelectRow d-flex'>
                        {bedsList &&
                          bedsList.map((bed, index) => {
                            let isSelected = baths === bed.value;
                            return (
                              <div
                                style={{
                                  backgroundColor: isSelected ? '#336699' : '',
                                  color: isSelected ? 'white' : '',
                                }}
                                onClick={() => this.setState({ baths: bed.value })}
                                className='bedSelectButtn'
                                key={index}
                              >
                                {bed.text}
                              </div>
                            );
                          })}
                      </div>
                      <div className='filterBottomStrip d-flex justify-content-end'>
                        <div
                          className='doneButton'
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
                {/* <div className='group-form zillow-button-div position-relative'>
                  <div className='zillowButton' onClick={() => this.setState({ showHomeFilter: !showHomeFilter, showPriceModal: false, showBedModal: false, showSqftModal: false })}>
                    Home Type
                  </div>
                  {showHomeFilter && (
                    <div className='priceModal'>
                      <p className='title'>Home Type</p>
                      {homeFilterValues &&
                        homeFilterValues.map((item, index) => {
                          return (
                            <div className='d-flex align-items-center mb-4' key={index}>
                              <input onClick={() => this.onHomeSelect(item)} type='radio' checked={selectedHomeTypes.indexOf(item) !== -1} />
                              <lable className='ml-2'>{item}</lable>
                            </div>
                          );
                        })}
                      <div className='filterBottomStrip d-flex justify-content-end'>
                        <div
                          className='doneButton'
                          onClick={() =>
                            this.setState({
                              showHomeFilter: false,
                            })
                          }
                        >
                          Done
                        </div>
                      </div>
                    </div>
                  )}
                </div>
               */}
              
              
                <div className='group-form zillow-button-div position-relative'>
                  <div className='zillowButton' onClick={() => this.setState({ showSqftModal: !showSqftModal, showPriceModal: false, showBedModal: false, showHomeFilter: false })}>
                    {minSqft || maxSqft ? (minSqft ? `${minSqft}sq.ft` : 'Upto') + '-' + (maxSqft ? `${maxSqft}sq.ft` : ' Any') : 'sq.ft'}
                  </div>
                  {showSqftModal && (
                    <div className='priceModal'>
                      <p className='title'>SQFT</p>
                      <div className='d-flex col-12 px-0'>
                        <div className='col-6 pl-0'>
                          <input
                            type='number'
                            defaultValue={minSqft ? minSqft : null}
                            onChange={handleFormChange}
                            name='minSqft'
                            placeholder='Min'
                            min='100'
                            id='minSqft'
                            onFocus={() =>
                              this.setState({
                                showMinSqft: true,
                                showMaxSqft: false,
                              })
                            }
                          />
                          {showMinSqft && (
                            <ul className='priceFilterList'>
                              <li onClick={() => this.setState({ minSqft: '' })}>Any</li>
                              <li onClick={() => this.setState({ minSqft: 320 })}>320 sq.ft</li>
                              <li onClick={() => this.setState({ minSqft: 500 })}>500 sq.ft</li>
                            </ul>
                          )}
                        </div>

                        <div className='col-6 pr-0'>
                          <input
                            type='number'
                            defaultValue={maxSqft ? maxSqft : null}
                            onChange={handleFormChange}
                            name='maxSqft'
                            placeholder='Max'
                            min='100'
                            id='maxSqft'
                            onFocus={() =>
                              this.setState({
                                showMinSqft: false,
                                showMaxSqft: true,
                              })
                            }
                          />
                          {showMaxSqft && (
                            <ul className='priceFilterList'>
                              <li onClick={() => this.setState({ maxSqft: 1200 })}>1200 sq.ft</li>
                              <li onClick={() => this.setState({ maxSqft: 1500 })}>1500 sq.ft</li>
                              <li onClick={() => this.setState({ maxSqft: 2000 })}>2000 sq.ft</li>
                              <li onClick={() => this.setState({ maxSqft: 2500 })}>2500 sq.ft</li>
                              <li onClick={() => this.setState({ maxSqft: '' })}>Any</li>
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className='filterBottomStrip d-flex justify-content-end'>
                        <div
                          className='doneButton'
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

                <div className='group-form submit-button'>
                  <button type='submit'>Search</button>
                </div>
              </form>
              {this.state.isSearched && (
                <button onClick={() => this.resetSearchFilters()} className='ml-2 resetButton'>
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {mapView ? (
          <section className='listing-sec-area'>
            <div className='container-fluid'>
              <div className='row'>
                <div class='col-lg-6 col-md-12 col-sm-12 listing-column'>
                  <div class='listing-inner'>
                    <div class='title-area'>
                      {/* <h3>{this.state.market ? this.state.market : 'Garden State'}, 57701</h3> */}
                      {myProperties && myProperties.length ? <h3>{myProperties.length}</h3> : <h3>0</h3>}
                      <div class='right-area'>
                        {/* <p>{this.props.myProperties} Homes</p> */}
                        <p>
                          Sort by{' '}
                          <a href='#'>
                            Relevant Listing{' '}
                            <span>
                              <img src={image16} alt='' />
                            </span>
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className='listing-box'>
                      {this.state.error && <p className='searchError'>Unable to find results! Please modify your search.</p>}

                      <div className='row clearfix m-0'>
                        {activeProperty ? (
                          <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12 px-2'>
                            <PropertyCard propertyValues={activeProperty} history={history} />
                          </div>
                        ) : (
                          <>
                            {!this.props.mainLoader ? (
                              myProperties &&
                              myProperties.map((item, x, idx) => {
                                if (x < 100) {
                                  return (
                                    <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12 px-2'>
                                      <PropertyCard onCardClick={onCardClick} propertyValues={item} history={history} />
                                    </div>
                                  );
                                }
                              })
                            ) : (
                              <div class='lds-ring'>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-lg-6 col-md-12 col-sm-12 map-column'>
                  <div className='map-area'>
                    {myProperties && !this.state.modalActive && (
                      <div className='map-box'>
                        <MapProperty propertiesList={myProperties && myProperties.length ? myProperties : []} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className='listing-sec-area'>
            <div className='container-fluid'>
              <div className='col-lg-12 col-md-12 col-sm-12 listing-column'>
                <div className='listing-inner'>
                  <div className='title-area'>
                    <h3>Rapid City, 57701</h3>
                    <div className='right-area'>
                      <p>10 Homes</p>
                      <p>
                        Sort by{' '}
                        <a href='#'>
                          Relevant Listing{' '}
                          <span>
                            <img src={image16} alt='' />
                          </span>
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className='listing-box'>
                    <div className='row clearfix'>
                      {myProperties ? (
                        myProperties.map((item, x, idx) => {
                          if (x < 100) {
                            return (
                              <div className='col-lg-3 col-md-3 col-sm-12 col-xs-12'>
                                <PropertyCard propertyValues={item} history={history} />
                              </div>
                            );
                          }
                        })
                      ) : (
                        <div class='lds-ring'>
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
          <Modal modalClassName='property-details' toggle={togglePropertyModal} isOpen={propertyModal}>
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
  console.log(state,"check stateeee")
  return {
    myProperties: state.myProperties,
    mainLoader:state.loader
    
  };
};

const mapDispatchToProps = { getAllAdverts, searchByMarket, getAllRental };

export default connect(mapStateToProps, mapDispatchToProps)(Listings);
