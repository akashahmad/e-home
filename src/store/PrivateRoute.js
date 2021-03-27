import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, auth, path, ...rest }) => (
  <Route
    {...rest}
    render= {props=> auth || localStorage.getItem('jwt') ? ( (( localStorage.getItem('jwt')) && (path == '/dashboard/survey' || path == '/dashboard/surveyinner')) ? <Redirect to="/dashboard" /> : <Component {...props} /> ) : ( <Redirect to="/login" /> )}
  />
);

PrivateRoute.propTypes = {auth: PropTypes.string.isRequired};

const mapStateToProps = state => (
{
  auth: state.Reservation
});

export default connect(mapStateToProps)(PrivateRoute);
