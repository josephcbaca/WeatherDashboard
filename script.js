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
            }).then(function (response2) {

                new Date($.now());
                let current = new Date();
                let day = current.getDate();
                let month = current.getMonth();
                let year = current.getFullYear();

                for (let i = 0; i < 5; i++) {

                    let colm = $("<div>");
                    let smallDate = $("<h5>");
                    // let smallIcon = $("#small-icon");
                    let smallTemp = $("<h7>");
                    let smallHumi = $("<h7>");

                    colm.addClass("card col-md-2 p-1");
                    colm.attr("id", "cardSort-" + i);
                    smallDate.addClass("sDate-" + i);
                    smallDate.text(day + "/" + month + "/" + year);
                    smallTemp.addClass("sTemp-" + i);
                    smallTemp.text("Temp: " + response2.daily[i].temp.day);
                    smallHumi.addClass("sHumi-" + i);
                    smallHumi.text("Humidity: " + response2.daily[i].humidity + "%");
                    
                    $(".small-row").append(colm);
                    $("#cardSort-" + i).append(smallDate);
                    $("#cardSort-" + i).append(smallTemp);
                    $("#cardSort-" + i).append(smallHumi);
                };

                // Calculate the temperature (converted from Kelvin)
                let temp = response.main.temp
                let f = (temp - 273.15) * 1.80 + 32;
                $(".tempMain").text("Temperature(Fahrenheit): " + f + " F");
                $(".windMain").text("Wind Speeds: " + response.wind.speed + " MPH");
                $(".humidity").text("Humdity: " + response.main.humidity);
                $(".UVMain").text("UV Index: " + response2.current.uvi)

            });


        });
    };
});