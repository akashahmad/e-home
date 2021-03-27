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
      searchText: '',
      myProperties: [],
      isLoader: false,
      beds: '',
      price: '',
      baths: '',
    };
    window.scrollTo(0, 0);
  }

  togglePropertyModal = () => {
    if (this.state.propertyModal) {
      this.props.history.replace(`/listings`);
    }
    this.setState({ propertyModal: !this.state.propertyModal });
  };

  componentDidMount() {
    const path = this.props.history.location.pathname.split('/');
    if (this.props.history.location.state && this.props.history.location.state.market != '' && this.props.history.location.state.market != undefined) {
      this.props.searchByMarket(this.props.history.location.state.market);
      this.setState({ market: this.props.history.location.state.market });
    } else this.handelPropertyType(this.state.activePropertyType);
    if (path[3]) {
      this.togglePropertyModal();
    }
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
    // if(this.props.history.location.state && this.props.history.location.state.market != "" && this.props.history.location.state.market != undefined){
    //   this.props.searchByMarket(this.props.history.location.state.market)
    //   this.setState({market:this.props.history.location.state.market})
    // } else
    this.props.getAllRental();
  };

  handelPropertyType = (type) => {
    if (type == 'sale') {
      this.props.getAllAdverts();
      this.setState({ activePropertyType: 'sale', isLoader: true });
      setTimeout(() => {
        this.setState({ isLoader: false });
      }, 6000);
    } else {
      this.props.getAllRental();
      this.setState({ activePropertyType: 'rent', isLoader: true });
      setTimeout(() => {
        this.setState({ isLoader: false });
      }, 4000);
    }
  };

  handleFormChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onCardClick = (state, city, zip, id, market) => {
    let url = (state ? state.split(' ').join('_') : '') + '-' + (city ? city.split(' ').join('_') : '') + '-' + zip.split(' ').join('_') + `/${id}`;
    this.props.history.replace(`/listings/${url}`, { propertyId: id, market });
    this.togglePropertyModal();
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

  render() {
    const { onCardClick, togglePropertyModal, handelPropertyType, handleFormChange } = this;
    const { history } = this.props;
    let { activeProperty, mapView, propertyModal, activePropertyType, searchText, beds, baths, price, type, isLoader } = this.state;
    const propertyId = this.props.location.state ? this.props.location.state.propertyId : '';
    const propertyMarket = this.props.location.state ? this.props.location.state.market : '';
    let myProperties = this.props.myProperties.listings && this.props.myProperties.listings;
    myProperties =
      myProperties &&
      myProperties.filter((item) => {
        if (item.address.street) {
          return item.address.street.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1;
        }
      });

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
              <div className='group-form search-form'>
                <input type='text' value={searchText} onChange={handleFormChange} name='searchText' placeholder='Search property, Adress, city, MLS#' />
                <button>Search</button>
              </div>
              <form>
                <div className='group-form price-form'>
                  <select value={price} onChange={handleFormChange} name='price'>
                    <option value=''>Price</option>
                    <option value='55000'>$5,5000</option>
                    <option value='65000'>$6,5000</option>
                    <option value='75000'>$7,5000</option>
                  </select>
                </div>
                <div className='group-form beds-form'>
                  <select value={beds} onChange={handleFormChange} name='beds'>
                    <option value=''>Beds</option>
                    <option value='2'>2</option>
                    <option value='5'>5</option>
                    <option value='7'>7</option>
                  </select>
                </div>

                <div className='group-form baths-form'>
                  <select value={baths} onChange={handleFormChange} name='baths'>
                    <option value=''>Baths</option>
                    <option value='2'>2</option>
                    <option value='5'>5</option>
                    <option value='7'>7</option>
                  </select>
                </div>

                <div className='group-form listing-status-form'>
                  <select>
                    <option>Listing Status</option>
                    <option>Pending</option>
                    <option>5</option>
                    <option>7</option>
                  </select>
                </div>
                <div className='group-form submit-button'>
                  <button>Save Search</button>
                </div>
              </form>
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
                      <h3>{this.state.market ? this.state.market : 'Garden State'}, 57701</h3>
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
                      <div className='row clearfix m-0'>
                        {activeProperty ? (
                          <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12 px-2'>
                            <PropertyCard propertyValues={activeProperty} history={history} />
                          </div>
                        ) : (
                          <>
                            {myProperties && !isLoader ? (
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
                    <div className='map-box'>
                      <MapProperty propertiesList={this.props.myProperties.listings ? this.props.myProperties.listings : []} />
                    </div>
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
              <PropertyDetails history={history} propertyId={propertyId} propertyMarket={propertyMarket} propertyType={type} />
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
  };
};

const mapDispatchToProps = { getAllAdverts, searchByMarket, getAllRental };

export default connect(mapStateToProps, mapDispatchToProps)(Listings);
