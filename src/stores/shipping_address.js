import { writable } from "svelte/store";

let saved_address = JSON.parse(sessionStorage.getItem("shipping_address"));
if (!saved_address) {
  saved_address = {
    oneline: ""
    // ,
    // address1: address["street_number"] + " " + address["route"],
    // city: address["locality"],
    // state: address["administrative_area_level_1"],
    // postalCode: address["postal_code"],
    // country: address["country"]
  };
}
// console.log("saved_address", saved_address);
export const shipping_address = writable(saved_address);

// Configure which formats from Google Maps object to use
const componentForm = {
  street_number: "short_name",
  route: "long_name",
  locality: "long_name",
  administrative_area_level_1: "short_name",
  country: "short_name",
  postal_code: "short_name"
};

export function set_shipping_address(place) {
  if (
    !place ||
    !Array.isArray(place.address_components) ||
    !place.address_components.length
  ) {
    return console.log("Could not set shipping address");
  }
  // Get the place details from the autocomplete object.
  const address = {};
  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  for (let i = 0; i < place.address_components.length; i++) {
    let addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      address[addressType] =
        place.address_components[i][componentForm[addressType]];
    }
  }
  shipping_address.set({
    oneline:
      address["street_number"] +
      " " +
      address["route"] +
      " " +
      address["locality"] +
      ", " +
      address["administrative_area_level_1"] +
      " " +
      address["postal_code"],
    address1: address["street_number"] + " " + address["route"],
    // address2, address3?
    city: address["locality"],
    state: address["administrative_area_level_1"],
    postalCode: address["postal_code"],
    country: address["country"]
  });
}

shipping_address.subscribe(function(o) {
  // const { oneline, ...oClean } = o;
  sessionStorage.setItem("shipping_address", JSON.stringify(o));
});
