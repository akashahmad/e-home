/* -- set app title --*/
const AppTitle = 'Ehome';
const { REACT_APP_SERVER } = process['env'];
/* -- set app mode -- */
// const AppMode = [''];
const AppMode = ['development'];

/* -- set API URLs --*/
const development = 'https://cell-point.herokuapp.com';
const prototype = '';
const staging = '';
const production = '';

let SocketUrl;
switch (AppMode[0]) {
  case 'development':
    SocketUrl = development;
    break;
  case 'prototype':
    SocketUrl = prototype;
    break;
  case 'staging':
    SocketUrl = staging;
    break;
  case 'production':
    SocketUrl = production;
    break;
  default:
    SocketUrl = 'http://192.168.1.167:4000';
}

let ApiUrl = `${SocketUrl}/api`;
let envoirnment = AppMode[0] ? AppMode[0] : 'development';

export { AppTitle, ApiUrl, SocketUrl, envoirnment };
