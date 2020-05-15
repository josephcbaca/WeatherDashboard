// Cities Array
let cities = [];
console.log(cities)

// First time user if no local storage then show instruction text, if not pull from local storage
if (localStorage.length === 0) {
    let cardHead = $("<h5>")
    cardHead.text("Type City in Search Field!");
    $(".rightMainDiv").append(cardHead);
} else {
    let cityValue = cities[0]

    searchCity(cityValue);
};


// On-click runs searchCity with cityValue entered in input field
$("#search-button").on("click", function (event) {
    event.preventDefault();
    $(".rightMainDiv").empty();
    $(".smallh3").empty();
    $(".small-row").empty();

    let cityValue = $("#city-search").val().trim();


    cities.push(cityValue)
    localStorage.setItem("cityNums", cities);

    searchCity(cityValue)
});


// Create city buttons
function renderButtons() {
    // Why do this?  Maybe pull from local storage every time?
    $("buttons-view").empty();
    
    for (var i = 0; i < cities.length; i++) {

    let cityButton = $("<button>")
    let cityCap = cityValue.charAt(0).toUpperCase() + cityValue.slice(1)
    cityButton.addClass("col-md-12 btn btn-light btn-outline-dark cityBtn");
    cityButton.text(cityCap);
    cityButton.attr("src", "button");
    // cityButton.attr("id", "cityBtn");
    // cityButton.attr("data-city", cityValue);
    $("#cityBtnDiv").append(cityButton);
    }
};

// On-click runs searhCity with cityValue from data attribute data-city
function cityButtons() {
    event.preventDefault();
    $(".rightMainDiv").empty();
    $(".smallh3").empty();
    $(".small-row").empty();

    let cityValue = $(this).attr("data-city");

    searchCity(cityValue)
};

// $(document).on("click", ".cityBtn", cityButtons);


//Look at Week 4 Activity 23

function searchCity(cityValue) {

    let APIKey = "080a1e9a91e6a33fe6bb46a959d9a7de";
    // URL to query the database
    let queryURL1 = "https://api.openweathermap.org/data/2.5/weather?q=" + cityValue + "&appid=" + APIKey;

    // AJAX calls most data + latitude and longitude for second AJAX call
    $.ajax({
        url: queryURL1,
        method: "GET"
    }).then(function (response) {

        let latitude = response.coord.lat
        let longitude = response.coord.lon

        let queryURLLatLon = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude={part}&appid=" + APIKey;

        // Second AJAX to GET UV Index
        $.ajax({
            url: queryURLLatLon,
            method: "GET"
        }).then(function (response2) {

            new Date($.now());
            let current = new Date();
            let day = current.getDate();
            let month = current.getMonth();
            let year = current.getFullYear();

            let forecast = $("<h3>");
            forecast.text("5-Day Forecast");
            $(".smallh3").append(forecast);

            for (let i = 1; i < 6; i++) {

                let colm = $("<div>");
                let smallDate = $("<h5>");
                let smallIcon = $("<img>");
                let smallTemp = $("<h7>");
                let smallHumi = $("<h7>");
                let temp2 = response2.daily[i].temp.day
                let faren2 = (temp2 - 273.15) * 1.80 + 32;

                colm.addClass("card col-md-2 p-1 small-box mr-2");
                colm.attr("id", "cardSort-" + i);
                $(".small-row").append(colm);

                smallDate.addClass("sDate-" + i);
                smallDate.text((month + 1) + "/" + (day + i) + "/" + year);
                $("#cardSort-" + i).append(smallDate);

                smallIcon.addClass("sIcon");
                smallIcon.attr("src", "http://openweathermap.org/img/wn/" + response2.daily[i].weather[0].icon + "@2x.png");
                $("#cardSort-" + i).append(smallIcon);

                smallTemp.addClass("sTemp-" + i);
                smallTemp.text("Temp: " + Math.trunc(faren2) + "° F");
                $("#cardSort-" + i).append(smallTemp);

                smallHumi.addClass("sHumi-" + i);
                smallHumi.text("Humidity: " + response2.daily[i].humidity + "%");
                $("#cardSort-" + i).append(smallHumi);
            };

            // Calculate the temperature (converted from Kelvin)
            let temp = response.main.temp
            let faren = (temp - 273.15) * 1.80 + 32;
            let cardHead = $("<h5>");
            let bigIcon = $("<img>");
            let bigTemp = $("<p>");
            let bigWind = $("<p>");
            let bigHumi = $("<p>");
            let bigUV = $("<p>");
            let uvLow = $("<button>");

            cardHead.addClass("headCity");
            cardHead.text(response.name + " " + ((month + 1) + "/" + day + "/" + year));
            $(".rightMainDiv").append(cardHead);

            bigIcon.addClass("headIcon");
            bigIcon.attr("src", "http://openweathermap.org/img/wn/" + response2.daily[0].weather[0].icon + "@2x.png");
            $(".rightMainDiv").append(bigIcon);

            bigTemp.text("Temperature(Fahrenheit): " + Math.trunc(faren) + "° F");
            $(".rightMainDiv").append(bigTemp);

            bigWind.text("Wind Speeds: " + response.wind.speed + " MPH");
            $(".rightMainDiv").append(bigWind);

            bigHumi.text("Humdity: " + response.main.humidity);
            $(".rightMainDiv").append(bigHumi);

            // If statements to set severity level for UV Index
            bigUV.addClass("uvText");
            bigUV.text("UV Index: ");
            $(".rightMainDiv").append(bigUV);

            if (response2.current.uvi < 5) {
                uvLow.addClass("btn btn-success");
                uvLow.text(response2.current.uvi);
                $(".uvText").append(uvLow);
            }
            if (response2.current.uvi >= 5 && response2.current.uvi <= 7) {
                uvLow.addClass("btn btn-warning");
                uvLow.text(response2.current.uvi);
                $(".uvText").append(uvLow);
            }
            if (response2.current.uvi > 7) {
                uvLow.addClass("btn btn-danger");
                uvLow.text(response2.current.uvi);
                $(".uvText").append(uvLow);
            }

            // Calling the renderButtons function to display city buttons
            // renderButtons();

            // Clear input field
            $("#city-search").val("");

        });
    });
};