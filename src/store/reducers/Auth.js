// import { setToken } from '../axios';
// import { PURGE } from "redux-persist";

var initialState = {
  myUser:{},
  myProperties:{},
  auth: localStorage.getItem('jwt'),
  getFavourites:{},
  myProperty:{},
  loginModal: false,
  myCount:{},
  myPropertyInfo:{}
}

const Auth = (state = initialState, { type, payload }) => {
  switch (type) {

    case 'LOGOUT':
    localStorage.clear();
    window.location.reload()
    return {
    }

    case 'MY_USER':
    console.log('payload', payload);
    return {
      ...state,
      myUser: payload
    };

    case 'LOGIN_MODAL':
    console.log('loginModal payload', payload);
    return {
      ...state,
      loginModal: payload
    };

    case 'MY_PROPERTIES':
    console.log('payload', payload);
    return {
      ...state,
      myProperties: payload
    };

    case 'MY_COUNT':
    console.log('payload', payload);
    return {
      ...state,
      myCount: payload
    };

    case 'MY_FAVOURITES':
    console.log('payload', payload);
    return {
      ...state,
      getFavourites: payload
    };

    case 'MY_SINGLE_PROPERTY':
    console.log('payload', payload);
    return {
      ...state,
      myProperty: payload.result,
      myPropertyInfo: payload.market
    };

    default:
    return state;
  }
};
export default Auth;
