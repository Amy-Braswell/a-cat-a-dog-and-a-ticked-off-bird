'use strict';

//////////////////API Keys/////////////////

const googleGeocodingAPI = "AIzaSyBF855waFb_88pD3B4BJB42JNuvSk05x34";

const AccuWeatherAPI = "pU3saOZ250CYJ2bcc3CCzkQZSYTn7xO9";
const openWeatherAPI = "a6015cfb7b1a11caec9fbb1bb5150329";
const weatherBitAPI = "0a906bc695244645a034fa4c4baf11e3";
const darkSkyAPI = "05cb46aa19287b7b9c1a235035e4c45f";
 

//////////////////Base URLs///////////////

const googleGeocodingBase ="https://maps.googleapis.com/maps/api/geocode/json?address=";

const openWeatherBase = "http://api.openweathermap.org/data/2.5/weather?";
const weatherBitBase = "https://api.weatherbit.io/v2.0/current?";
const darkSkyBase = "https://api.darksky.net/forecast/";
//const accuWeatherBaseLocation = "http://dataservice.accuweather.com/locations/v1/postalcodes/search.json?q=60607,us&apikey=pU3saOZ250CYJ2bcc3CCzkQZSYTn7xO9";
         //above to get Location_Key  then:
//const accuWeatherBase = "http://dataservice.accuweather.com/currentconditions/v1/" + Location_Key;

const accuWeatherWorkingURL = "https://cors-anywhere.herokuapp.com/http://dataservice.accuweather.com/currentconditions/v1/26463_PC?apikey=pU3saOZ250CYJ2bcc3CCzkQZSYTn7xO9&language=en-us&details=false HTTP/1.1";




 //////////////// Render Weather Report ////////////////
 /*
 function renderResult(latitude, longitude) {
  $('#results-list').append(
    `
      <div class="returned-park">
          <h3>${latitude}, ${longitude}</br></br> 
          <div class="text">
              <p>${latitude}, ${longitude}</br></p>
          </div>
      </div> 
    `
  );
}
*/


//////////////// Watch User Form //////////////////////

function watchUserForm() {
    $('form').submit(event => {
        event.preventDefault(); 
        const fromZipInput = $('#js-zip-code').val();
        const fromCountryInput = $('#js-country-code').val();
        getLatLngByZipcode(fromZipInput);

        /////////// Get Lat / Long From Zip //////////

        function getLatLngByZipcode() 
        {
            const googleGeocoder = googleGeocodingBase  + fromZipInput +  "&key=" + googleGeocodingAPI;

            fetch(googleGeocoder)
            .then(response => {
              if (response.ok) {
              return response.json();
              }
              throw new Error(response.statusText);
            })
            .then((myJson => {
              constructURL(myJson.results[0].geometry.location.lat, myJson.results[0].geometry.location.lng);
              console.log("Google API call to: " + googleGeocoder);
              //console.log(myJson.results[0]);
              let latitude = myJson.results[0].geometry.location.lat;
              let longitude = myJson.results[0].geometry.location.lng;
              console.log ("inside Fetch call: " + latitude + ", " + longitude);
            }))
            .catch(err => {
              $('#js-error-message').text(`Something went wrong: ${err.message}`);
              }
            );
        }
        
        function constructURL(latitude, longitude) {
          const darkSkyURL = darkSkyBase + darkSkyAPI + "/" + latitude + "," + longitude;
          console.log(darkSkyURL);



        
        //pass weather api url into fetch command
        fetch(accuWeatherWorkingURL)
        .then(response => {
          if (response.ok) {
          return response.json();
          }
          throw new Error(response.statusText);
        })
        .then((myJson => {
          //renderResult(myJson);
          console.log(myJson);
        }))
        .catch(err => {
          $('#js-error-message').text(`Something went wrong: ${err.message}`);
            }
          ); 
        } 


      });
}


    $(watchUserForm);








