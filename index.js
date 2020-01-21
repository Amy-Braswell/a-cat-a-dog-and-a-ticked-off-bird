'use strict'

$(watchUserForm)

/*************** Global  ***************/

const proxy = 'https://cors-anywhere.herokuapp.com/'

/********* Watch Form and Make API Calls ***********/

function watchUserForm() {

  $('form').submit(event => {
    event.preventDefault()
    const fromZipInput = $('#js-zip-code').val()
    getLatLngByZipcode(fromZipInput)

    function getLatLngByZipcode(latitude, longitude) {
      const googleGeocodingAPI = 'AIzaSyBF855waFb_88pD3B4BJB42JNuvSk05x34'
      const googleGeocodingBase = 'https://maps.googleapis.com/maps/api/geocode/json?address='
      const googleGeocoder = googleGeocodingBase + fromZipInput + '&key=' + googleGeocodingAPI

      fetch(googleGeocoder)
        .then(response => {
          if(response.ok) {
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
          $('.js-popup-overlay, .js-popup-content').addClass('active')
          $('#close-button').removeClass('hidden')
          closeResults()
         
          function closeResults() {
            $('#close-button').click(event => {
              $('.js-popup-overlay, .js-popup-content').removeClass('active')
              $('.result').empty()
            })
          }
        }
        )

      function catCall(latitude, longitude) {
        const darkSkyAPI = '05cb46aa19287b7b9c1a235035e4c45f'
        const darkSkyBase = 'https://api.darksky.net/forecast/'
        const darkSkyURL = darkSkyBase + darkSkyAPI + '/' + latitude + ',' + longitude

        /********* Call 1st Weather API - Cat *********/
        /********* AJAX Call to Proxy as Work Around for CORS Policy **********/
        const catApiLinkDS = darkSkyURL

        $.ajax({
          url: proxy + catApiLinkDS,
          success: function(data) {
            const catSummary = 'The current condition is ' + data.currently.summary.toLowerCase() + '.'
            const catTemp = 'The current temperature is ' + data.currently.temperature + ' degrees F.'
            const catApparent = 'It feels like ' + data.currently.apparentTemperature + ' degrees F.'
            renderCatResult(catSummary, catTemp, catApparent)
          }
        })
      }
    }

    /********* Call 2nd Weather API - Dog ***********/
    /********* AJAX Call to Proxy as Work Around for HTTP / GitHub Issue ***********/
    const accuWeatherAPI = 'pU3saOZ250CYJ2bcc3CCzkQZSYTn7xO9'
    const accuWeatherBaseLocation = 'http://dataservice.accuweather.com/locations/v1/postalcodes/search.json?q='
    const accuWeatherBase = 'http://dataservice.accuweather.com/currentconditions/v1/'
    const dogApiLocation = accuWeatherBaseLocation + fromZipInput + ',us&apikey=' + accuWeatherAPI

    $.ajax({
      url: proxy + dogApiLocation,
      success: function(data) {
        const dogLocation = data[0].Key
        const dogApiLinkDS = accuWeatherBase + dogLocation + '?apikey=' + accuWeatherAPI + '&language=en-us&details=false HTTP/1.1'
        secondDogCall(dogApiLinkDS)
      }
    })

    function secondDogCall(dogApiLinkDS) {
      $.ajax({
        url: proxy + dogApiLinkDS,
        success: function(data) {
          const dogSummary = 'The current condition is ' + data[0].WeatherText.toLowerCase() + '.'
          const dogTemp = 'The current temperature is ' + data[0].Temperature.Imperial.Value
          const dogTempUnit = data[0].Temperature.Imperial.Unit + '.'
          const dogPlaceholder = 'placeholder'
          renderDogResult(dogSummary, dogTemp, dogTempUnit, dogPlaceholder)
        }
      })
    }

    /********* Call 3rd Weather API - Bird ***********/
    const weatherBitAPI = '0a906bc695244645a034fa4c4baf11e3'
    const weatherBitBase = 'https://api.weatherbit.io/v2.0/current?'
    const weatherBitURL = weatherBitBase + 'postal_code=' + fromZipInput + '&country=US&units=I&key=' + weatherBitAPI

    fetch(weatherBitURL)
      .then(response => {
        if(response.ok) {
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

function renderCatResult(catSummary, catTemp, catApparent) {
  $('.js-popup-overlay, .js-popup-content').addClass('active')
  $('#js-close-button').prepend(
    `
    <button id="close-button" class="close hidden"><i class="fa fa-times"></i></button>
    `
  )
  $('#js-cat-results').prepend(
    `
        <img src="images/cat.png" alt="cat pix">
        <div id="js-cat-results-p">
        <p>${catSummary}</p>
        <p>${catTemp}</p>
        <p>${catApparent}</p>
      </div> 
    `
  )
  
  $('#close-button').removeClass('hidden')
  closeResults()
  showSource()

 
  function closeResults() {
    $('#close-button').click(event => {
      $('.js-popup-overlay, .js-popup-content').removeClass('active')
      $('.result').empty()
      $('#js-zip-code').val(" ")
    })
  }

}

function renderDogResult(dogSummary, dogTemp, dogTempUnit, dogPlaceholder) {
  $('#js-dog-results').append(
    `
      <div class="accuweather">
        <img src="images/dog.png" alt="dog pix">
        <p>${dogSummary}</p>
        <p>${dogTemp} ${dogTempUnit}</p>
        <p style="color: white;">${dogPlaceholder}</p>
      </div> 
    `
  )
}

function renderbirdResult(birdSummary, birdTemp, birdApparent) {
  $('#js-bird-results').append(
    `
      <div class="weatherbit">
        <img src="images/bird.png" alt="bird pix">
        <p>${birdSummary}</p>
        <p>${birdTemp}</p>
        <p>${birdApparent}</p>
      </div> 
    `
  )
}

/********* Show Weather Source ***********/

function showSource() {
  $('#js-cat-results').on("click", function() {
    $('#js-cat-results').empty()
  
    $('#js-cat-results').append(
      `
        <button id="close-button" class="close hidden"><i class="fa fa-times"></i></button>
        <div class="dark-sky">
          <img src="images/cat.png" alt="cat pix">
          <p>Go Team Dark Sky!</p>
        </div> 
      `
      )
  });

  $('#js-dog-results').on("click", function() {
    $('#js-dog-results').empty()

    $('#js-dog-results').append(
      `
        <div class="weatherbit">
          <img src="images/dog.png" alt="dog pix">
          <p>Go Team AccuWeather!</p>
        </div> 
      `
    )
  });

  $('#js-bird-results').on("click", function() {
    $('#js-bird-results').empty()

    $('#js-bird-results').append(
      `
        <div class="weatherbit">
          <img src="images/bird.png" alt="bird pix">
          <p>Go Team Weatherbit!</p>
        </div> 
      `
    )
  });
}

