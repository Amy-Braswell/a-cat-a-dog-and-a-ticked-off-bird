'use strict'

$(watchUserForm)

/********** Global - API Keys ************/

const googleGeocodingAPI = 'AIzaSyBF855waFb_88pD3B4BJB42JNuvSk05x34'

const accuWeatherAPI = 'pU3saOZ250CYJ2bcc3CCzkQZSYTn7xO9'
const weatherBitAPI = '0a906bc695244645a034fa4c4baf11e3'
const darkSkyAPI = '05cb46aa19287b7b9c1a235035e4c45f'

/********* Global - Base URLs ***********/

const googleGeocodingBase = 'https://maps.googleapis.com/maps/api/geocode/json?address='

const proxy = 'https://cors-anywhere.herokuapp.com/'

const weatherBitBase = 'https://api.weatherbit.io/v2.0/current?'
const darkSkyBase = 'https://api.darksky.net/forecast/'
const accuWeatherBaseLocation = 'http://dataservice.accuweather.com/locations/v1/postalcodes/search.json?q='
const accuWeatherBase = 'http://dataservice.accuweather.com/currentconditions/v1/'

/********* Watch Form and Make API Calls ***********/

function watchUserForm () {

  $('form').submit(event => {
    event.preventDefault()
    const fromZipInput = $('#js-zip-code').val()
    getLatLngByZipcode(fromZipInput)

    function getLatLngByZipcode (latitude, longitude) {
      const googleGeocoder = googleGeocodingBase + fromZipInput + '&key=' + googleGeocodingAPI

      fetch(googleGeocoder)
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error(response.statusText)
        })
        .then((myJson => {
          catCall(myJson.results[0].geometry.location.lat, myJson.results[0].geometry.location.lng)
          const latitude = myJson.results[0].geometry.location.lat
          const longitude = myJson.results[0].geometry.location.lng
        }))
        .catch(err => {
          $('#js-error-message').text(`Something went wrong: ${err.message}`)
        }
        )

      function catCall (latitude, longitude) {
        const darkSkyURL = darkSkyBase + darkSkyAPI + '/' + latitude + ',' + longitude

        /********* Call 1st Weather API *********/
        /********* AJAX Call to Proxy as Work Around for CORS Policy **********/
        const catApiLinkDS = darkSkyURL

        $.ajax({
          url: proxy + catApiLinkDS,
          success: function (data) {
            const catSummary = 'The current condition is ' + data.currently.summary.toLowerCase() + '.'
            const catTemp = 'The current temperature is ' + data.currently.temperature + ' degrees F.'
            const catApparent = 'It feels like ' + data.currently.apparentTemperature + ' degrees F.'
            renderCatResult(catSummary, catTemp, catApparent)
          }
        })
      }
    }

    /********* Call 2nd Weather API (Dog) ***********/
    /********* AJAX Call to Proxy as Work Around for HTTP / GitHub Issue ***********/
    const dogApiLocation = accuWeatherBaseLocation + fromZipInput + ',us&apikey=' + accuWeatherAPI

    $.ajax({
      url: proxy + dogApiLocation,
      success: function (data) {
        const dogLocation = data[0].Key
        const dogApiLinkDS = accuWeatherBase + dogLocation + '?apikey=' + accuWeatherAPI + '&language=en-us&details=false HTTP/1.1'
        secondDogCall(dogApiLinkDS)
      }
    })

    function secondDogCall (dogApiLinkDS) {
      $.ajax({
        url: proxy + dogApiLinkDS,
        success: function (data) {
          const dogSummary = 'The current condition is ' + data[0].WeatherText.toLowerCase() + '.'
          const dogTemp = 'The current temperature is ' + data[0].Temperature.Imperial.Value
          const dogTempUnit = data[0].Temperature.Imperial.Unit + '.'
          renderDogResult(dogSummary, dogTemp, dogTempUnit)
        }
      })
    }

    /********* Call 3rd Weather API (Bird) ***********/
    const weatherBitURL = weatherBitBase + 'postal_code=' + fromZipInput + '&country=US&units=I&key=' + weatherBitAPI

    fetch(weatherBitURL)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(response.statusText)
      })
      .then((myJson => {
        const birdSummary = 'The current condition is ' + myJson.data['0'].weather.description.toLowerCase() + '.'
        const birdTemp = 'The current temperature is ' + myJson.data['0'].temp + ' degrees F.'
        const birdApparent = 'It feels like ' + myJson.data['0'].app_temp + ' degrees F.'
        renderbirdResult(birdSummary, birdTemp, birdApparent)
      }))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`)
      }
      )
  })
}

/********* Render Weather Report ***********/

function renderCatResult (catSummary, catTemp, catApparent) {
  $('#js-cat-results').prepend(
    `
      <div class="js-dark-sky">
        <h2>The cat says:</h2>
        <p>${catSummary}</p>
        <p>${catTemp}</p>
        <p>${catApparent}</p>
      </div> 
    `
  )
}

function renderDogResult (dogSummary, dogTemp, dogTempUnit) {
  $('#js-dog-results').append(
    `
      <div class="js-accuweather">
        <h2>The dog says:</h2>
        <p>${dogSummary}</p>
        <p>${dogTemp} ${dogTempUnit}</p>
      </div> 
    `
  )
}

function renderbirdResult (birdSummary, birdTemp, birdApparent) {
  $('#js-bird-results').append(
    `
      <div class="js-weatherbit">
        <h2>The bird says:</h2>
        <p>${birdSummary}</p>
        <p>${birdTemp}</p>
        <p>${birdApparent}</p>
      </div> 
    `
  )
}