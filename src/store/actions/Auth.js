export const loginUser = ({ data, history }) => ({
  type: 'LOGIN_USER',
  payload: data,
  history
});

export const getProfile = () => ({
  type: 'GET_USER',
});

export const logout = () => ({
  type: 'LOGOUT',
});

export const fetchByMap = ({data}) => ({
  type: 'FETCHBYMAP',
  payload: data,

});

export const login = ({data}) => ({
  type: 'LOGIN',
  payload: data,

});

export const getFavourites = () => ({
  type: 'GET_FAVOURITES',
});


export const register = ({data}) => ({
  type: 'REGISTER',
  payload: data,
});

export const getAllAdverts = () => ({
  type: 'GET_ALL_ADVERTS',
});

export const fetchAddCount = () => ({
  type: 'FETCH_ADD_COUNT',
});

export const getSingleProperty = ({data}) => ({
  type: 'GET_SINGLE_PROPERTY',
  payload: data,
});

export const addFavourite = ({data}) => ({
  type: 'ADD_FAVOURITE',
  payload: data,
});

export const searchProperty = ({data}) => ({
  type: 'SEARCH_PROPERTY',
  payload: data,
});

export const searchByMarket = (data) => ({

  type: 'SEARCH_MARKET',
  payload: data,
});

export const getAllRental = () => ({
  type: 'GET_RENTAL'
});

export const toggleLoginModal = (data) => ({
  type: 'LOGIN_MODAL',
  payload: data,
});
