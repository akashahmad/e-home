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
import { apiUrl, publicToken } from '../../config';
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
      modalLoader:false,
    };
    window.scrollTo(0, 0);
  }

  componentWillReceiveProps(nextProps) {
    
    let { myProperties } = nextProps;
    if (myProperties) {
      this.setState({ localData: myProperties });
    }
  }
  togglePropertyModal = ( ) => {
    if(this.state.propertyModal) {
      this.props.history.replace(`/`);
      this.setState({propertyModal:false,modalActive:null})
    }
}

 
  componentDidMount() {
    const path = this.props.history.location.pathname.split('/');
    if (this.props.history.location.state && this.props.history.location.state.market != '' && this.props.history.location.state.market != undefined) {
      this.props.searchByMarket(this.props.history.location.state.market);
      this.setState({ market: this.props.history.location.state.market });
    } else this.handelPropertyType(this.state.activePropertyType);
    if (path[3]) {
      this.onCardClick('','','',path[3],'','external'); 
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
      }
      else if(search.indexOf('lenderId') !== -1){
        let lenderId = search.split('=')[1];
        if (lenderId) {
          axios.get('http://ehomefunding.wpengine.com/index.php?rest_route=/advisors/get/lenders/uid=' + lenderId).then((res) => {
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

  onCardClick = (state, city, zip, id, market,type) => {
    if(!type){
    let url = (state ? state.split(' ').join('_') : "") + "-" + (city ? city.split(' ').join('_') : "") + "-" + zip.split(' ').join('_') + `/${id}`
    this.props.history.replace(`/homedetails/${url}`,{propertyId:id, market});
    }
    let config = {
      headers: {
        Authorization: 'Bearer ' + publicToken,
      },
    };
    this.setState({modalLoader:true})
    axios.get(apiUrl+'ws/listings/get?id='+id+'&market=gsmls&details=true&extended=true&images=true',config).then(res=>{
      this.setState({modalActive:res.data.result.listings[0]});
      setTimeout(()=>{
       this.setState({modalLoader:false}) 
      },2500)
    })
    this.setState({propertyModal:true})

  
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
    let { beds, minPrice, maxPrice, searchText, baths, activePropertyType } = this.state;
    if (searchText || minPrice || maxPrice || beds || baths) {
      if (minPrice && maxPrice) {
        if (minPrice >= maxPrice) {
          window.confirm('Please add valid Max Price');
          return;
        }
      }
      this.setState({ isSearched: true });
      let config = {
        headers: {
          Authorization: 'Bearer ' + publicToken,
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
            (minPrice ? `<=${minPrice}` : '') +
            '&listPrice=' +
            (maxPrice ? `<=${maxPrice}` : '') +
            '&baths=' +
            baths +
            '&address.city=' +
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

          this.setState({ error: true, isLoader: false });
        })
        .catch((err) => {
          this.setState({ isLoader: false, error: true });
        });
    }
  };
  resetSearchFilters = () => {
    this.setState({ searchText: '', minPrice: '', maxPrice: '', beds: '', baths: '', error: false, isSearched: false });
    document.getElementById('searchText').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('beds').value = '';
    document.getElementById('baths').value = '';
    this.handelPropertyType(this.state.activePropertyType);
  };
  singleFilterHandler = () => {};
  render() {
    const { onCardClick, togglePropertyModal, handelPropertyType, handleFormChange, closePropertyModal } = this;
    const { history } = this.props;
    let { activeProperty, mapView, propertyModal, activePropertyType, searchText, beds, baths, minPrice, maxPrice, type, isLoader, localData,modalLoader} = this.state;
    const propertyId = this.props.location.state ? this.props.location.state.propertyId : '';
    const propertyMarket = this.props.location.state ? this.props.location.state.market : '';
    let myProperties = localData && localData;
    myProperties =
      myProperties &&
      myProperties.listings.filter((item) => {
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
              <form onSubmit={(e) => this.serchSubmitHandler(e)}>
                <div className='group-form search-form'>
                  <input type='text' defaultValue={searchText} onChange={handleFormChange} name='searchText' placeholder='City' id='searchText' />
                </div>
                <div className='group-form price-form'>
                  <input type='number' defaultValue={minPrice ? minPrice : null} onChange={handleFormChange} name='minPrice' placeholder='Min Price in $' min='100' id='minPrice' />
                </div>
                <div className='group-form price-form'>
                  <input type='number' defaultValue={maxPrice ? maxPrice : null} onChange={handleFormChange} name='maxPrice' placeholder='Max Price in $' min='100' id='maxPrice' />
                </div>
                <div className='group-form beds-form'>
                  <select defaultValue={beds} onChange={handleFormChange} name='beds' id='beds'>
                    <option value=''>Beds</option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                    <option value='6'>6</option>
                  </select>
                </div>

                <div className='group-form baths-form'>
                  <select defaultValue={baths} onChange={handleFormChange} name='baths' id='baths'>
                    <option value=''>Baths</option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                    <option value='6'>6</option>
                  </select>
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
                      {this.state.error && <p className='searchError'>Unable to find results! Please modify your search.</p>}

                      <div className='row clearfix m-0'>
                        {activeProperty ? (
                          <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12 px-2'>
                            <PropertyCard propertyValues={activeProperty} history={history} />
                          </div>
                        ) : (
                          <>
                            {!isLoader ? (
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
                    {localData && (
                      <div className='map-box'>
                        <MapProperty propertiesList={localData && localData.listings && localData.listings.length ? localData.listings : []} />
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
          <Modal modalClassName='property-details' toggle={togglePropertyModal}
          isOpen={propertyModal}>
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
  };
};

const mapDispatchToProps = { getAllAdverts, searchByMarket, getAllRental };

export default connect(mapStateToProps, mapDispatchToProps)(Listings);
