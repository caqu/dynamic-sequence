<script>
  import { onMount } from "svelte";
  export let placeholder = "123";
  export let value = "";
  let input;
  export let fillInAddress = place => {
    console.log('Implement this reducer on the parent component');
  };

  onMount(function() {
    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.places ||
      !window.google.maps.places.Autocomplete
    ) {
      const s = document.createElement("script");
      s.src = `//maps.googleapis.com/maps/api/js?key=AIzaSyDiG0YGqQbnCGxnKGn7MQMOSfckHWU12_Q&libraries=places`;
      s.onload = instantiateAddressAutocomplete;
      document.head.appendChild(s);
    } else {
      instantiateAddressAutocomplete();
    }
    return function cleanup() {
      // console.log('Cleanup goes here');
    };
  });
  function instantiateAddressAutocomplete() {
    if (!input) return console.warn("Unable to start AddressAutocomplete");
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ["geocode"]
    });
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(["address_component"]);
    // https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-multiple-countries
    autocomplete.setComponentRestrictions({
      // USA, Puerto Rico, U.S. Virgin Islands, Guam, Northern Mariana Islands
      country: ["us", "pr", "vi", "gu", "mp"]
    });
    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener("place_changed", function() {
      fillInAddress(autocomplete.getPlace());
    });
  }
</script>

<input {value} {placeholder} bind:this={input} />
