export const urlReturn = (property) => {
  let currentLocation = typeof window !== "undefined" && window.location.origin;
  let state = property.address.state ? property.address.state : null;
  let city = property.address.city ? property.address.city : null;
  let zip = property.address.zip ? property.address.zip : null;
  let id = property.id;
  let market = property.market;
  let url =
    currentLocation +
    "/homedetails/" +
    (state ? state.split(" ").join("_") : "") +
    "-" +
    (city ? city.split(" ").join("_") : "") +
    "-" +
    zip.split(" ").join("_") +
    `/${id}/${market}`;
  return url;
};
