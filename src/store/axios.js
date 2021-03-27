import axios from 'axios';
import { ApiUrl } from './config';
import jwt_decode from 'jwt-decode';
import EventBus from 'eventing-bus';

checkToken();
setInterval(() => checkToken(), 5000);
function checkToken() {
  let token = localStorage.getItem('jswt');
  if (token) {
    let decoded = jwt_decode(token);
    let expiry = decoded['exp'] * 1000;
    let timeNow = (new Date()).getTime();
    if (expiry <= timeNow) EventBus.publish('tokenExpired', true);
  }
}

// setTimeout(() => {
//   (async () => {
//     const browser = await detect();
//     if (browser) axios.defaults.headers.common['agent'] = `${browser.name[0].toUpperCase() + browser.name.slice(1)} V${browser.version} (${browser.os})`;
//     let agent = axios.defaults.headers.common['agent'];
//     let url = new URL("https://api.ipstack.com/check"),
//     params = {access_key:'d62575e0bca41db85969420858fadf99'}
//     Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
//     fetch(url)
//     let response = await fetch(url)
//       .then((response) => {
//         if (response['status'] == 200) return response.json()
//       })
//       .then((data) => {
//         localStorage.setItem('IP', data['ip'])
//         axios.defaults.headers.common['city'] = data['city'];
//         axios.defaults.headers.common['zipcode'] = data['zip'];
//         axios.defaults.headers.common['ipaddress'] = data['ip'];
//         axios.defaults.headers.common['countryname'] = data['country_name'];
//         axios.defaults.headers.common['countrycode'] = data['country_code'];
//         axios.defaults.headers.common['internet'] = data['connection']['isp'];
//         axios.defaults.headers.common['continentcode'] = data['continent_code'];
//         axios.defaults.headers.common['continentname'] = data['continent_name'];
//         axios.defaults.headers.common['callcode'] = data['location']['calling_code'];
//       })
//       .catch(err => {
//       })
//
//     axios.defaults.headers.common['agent'] = agent;
//   })();
// }, 5000)

console.log('ApiUrl', ApiUrl);
axios.defaults.baseURL = 'https://services.censubledev.com';

let token = localStorage.getItem('token');
if (token) axios.defaults.headers.common['Authorization'] = `bearer ${token}`;

export const setToken = token => {
  if (token) axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
  else delete axios.defaults.headers.common['Authorization'];
};
