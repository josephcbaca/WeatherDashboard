$(document).ready(function () {

    $("#search-button").on("click", function () {
        let cityValue = $("#city-search").val().trim()
        searchCity(cityValue)
    });
    function searchCity(cityValue) {


        let APIKey = "080a1e9a91e6a33fe6bb46a959d9a7de";
        // URL to query the database
        let queryURL1 = "https://api.openweathermap.org/data/2.5/weather?q=" + cityValue + "&appid=" + APIKey;



        // We then created an AJAX call
        $.ajax({
            url: queryURL1,
            method: "GET"
        }).then(function (response) {

            let latitude = response.coord.lat
            let longitude = response.coord.lon

            let queryURLLatLon = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude={part}&appid=" + APIKey;
            
            //second AJAX to GET UV Index
            $.ajax({
                url: queryURLLatLon,
                method: "GET"
            }).then(function (responseIV) {
                $(".UVMain").text("UV Index: " + responseIV.current.uvi)
                console.log(responseIV)
            });

            // Calculate the temperature (converted from Kelvin)
            let temp = response.main.temp
            let f = (temp - 273.15) * 1.80 + 32;
            $(".tempMain").text("Temperature(Fahrenheit): " + f + " F");

            $(".windMain").text("Wind Speeds: " + response.wind.speed + " MPH");
            $(".humidity").text("Humdity: " + response.main.humidity);


            var current = new Date();
            let day = current.getDate();
            console.log(day);

        });
    };
});