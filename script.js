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

            cardHead.text(response.name + " " + ((month + 1) + "/" + day + "/" + year));
            bigIcon.attr("src", "http://openweathermap.org/img/wn/" + response2.daily[0].weather[0].icon + "@2x.png");
            $(".card-title").append(cardHead);
            $(".card-title").append(bigIcon);

            $(".tempMain").text("Temperature(Fahrenheit): " + Math.trunc(faren) + "° F");
            $(".windMain").text("Wind Speeds: " + response.wind.speed + " MPH");
            $(".humidity").text("Humdity: " + response.main.humidity);

            // If statements to set severity level for UV Index
            if (response2.current.uvi < 5) {
                let uvLow = $("<button>");
                uvLow.addClass("btn btn-success");
                uvLow.text(response2.current.uvi);
                $(".UVMain").append(uvLow);
            }
            if (response2.current.uvi >= 5 && response2.current.uvi <= 7) {
                let uvLow = $("<button>");
                uvLow.addClass("btn btn-warning");
                uvLow.text(response2.current.uvi);
                $(".UVMain").append(uvLow);
            }
            if (response2.current.uvi > 7) {
                let uvLow = $("<button>");
                uvLow.addClass("btn btn-danger");
                uvLow.text(response2.current.uvi);
                $(".UVMain").append(uvLow);
            }
            // Clear input field
            $("#city-search").val("");
            // Create city buttons
            let cityButton = $("<button>")
            let cityStorage = cityValue.charAt(0).toUpperCase() + cityValue.slice(1)
            cityButton.addClass("col-md-12 btn btn-light btn-outline-dark");
            cityButton.text(cityStorage);
            cityButton.attr("src", "button");
            $("#cityBtnDiv").append(cityButton);

        });
    });
};

function generateButton() {
      var create = $("<button>")
      create.attr("class", "btn btn-outline-secondary")
      create.attr("type", "button")
      create.text(response.name)
      buttonDiv.prepend(create)

      var cityString = response.name
      cityButtonArr.push(cityString)

      localStorage.setItem("cityStorage", JSON.stringify(cityButtonArr))
      console.log(cityButtonArr)
}

function loadData() {

    let loadData = localStorage.getItem("city")
    if (loadData == null || loadData == "") return;

    let cityButtonArr = JSON.parse(loadData)

    for (i = 0; i < cityButtonArr.length; i++) {
        let create = $("<button>")
        create.addClass("btn btn-outline-secondary")
        create.attr("type", "button")
        create.text(cityButtonArr[i])
        buttonDiv.prepend(create)
    }
}

//for loop to create setItem value 
$("#search-button").on("click", function (event) {
    event.preventDefault();
    let cityValue = $("#city-search").val().trim();

    localStorage.setItem("city1", cityValue)
    searchCity(cityValue)

});

