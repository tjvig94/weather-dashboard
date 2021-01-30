$(document).ready(function() {

    const searchBtn = $(".search-btn");
    let city = $(".city");
    let state = $(".state");
    let weatherURL = "https://api.openweathermap.org/data/2.5/onecall?appid=fab861540adeaacaf58d87add689e290&units=imperial&exclude=minutely,hourly,alerts"
    let geoCode = `https://api.openweathermap.org/geo/1.0/direct?appid=fab861540adeaacaf58d87add689e290&limit=1`
    let forecastDays = [
        $(".day1"), $(".day2"), $(".day3"),  $(".day4"), $(".day5")
    ]

    let cityHistory = JSON.parse(localStorage.getItem("cities"));

    function listCities() {
        (cityHistory == null) ? cityHistory = [] : $("ul.search-history").empty();
        cityHistory.forEach(element => {
            let cityBtn = $("<li class='list-group-item'>");
            cityBtn.text(`${element.name}, ${element.state}`);
            cityBtn.attr("data-name", `${element.name}`);
            cityBtn.attr("data-state", `${element.state}`);
            $("ul").prepend(cityBtn);
        });
    };

    function currentDate(response) {
        let unixTimeStamp = response.current.dt;
        let milliseconds = unixTimeStamp * 1000;
        let dateObject = new Date(milliseconds);
        let currentDay = dateObject.toLocaleString("en-US", {weekday: "long"});
        let currentMonth = dateObject.toLocaleString("en-US", {month: "long"});
        let currentDate = dateObject.toLocaleString("en-US", {day: "numeric"});
        $("h2.current-day").text(`${currentDay}, ${currentMonth} ${currentDate}`);
    }

    function init() {
        if (cityHistory !== null) {
            let recentCity = cityHistory[cityHistory.length-1];
            $.get(`${geoCode}&q=${recentCity.name},${recentCity.state},us`).then((response) => {
                let lat = response[0].lat;
                let lon = response[0].lon;
                $(".city-name").text(response[0].name);

                // use lat and lon values to search for that location's weather data
                $.get(`${weatherURL}&lat=${lat}&lon=${lon}`).then((response) => {
                    // Place current date in the header
                    currentDate(response);

                    // Current conditions
                    $("p.current-temp").text(`Temperature: ${response.current.temp} F`);
                    $("p.current-humidity").text(`Humidity: ${response.current.humidity}%`);
                    $("p.current-wind").text(`Wind Speed: ${response.current.wind_speed} mph`);
                    $("p.current-uv").text(`UV Index: ${response.current.uvi}`);
                    // Change color of UV text background depending on severity
                    if (response.current.uvi < 3) {
                        $("p.current-uv").css("background-color", "green");
                    } else if (response.current.uvi >= 3 && response.current.uvi < 6) {
                        $("p.current-uv").css("background-color", "orange");
                    } else if (response.current.uv >= 6) {
                        $("p.current-uv").css("background-color", "orange");
                    };
                    // Prepend icon for current conditons
                    let currentIcon = "https://openweathermap.org/img/w/" + response.current.weather[0].icon + ".png";
                    $("img.current-icon").attr("src", currentIcon);

                    // 5 Day Forecast
                    for (let i = 0; i < forecastDays.length; i++) {
                        let element = forecastDays[i];
                            element.empty();       
                            let icon = "https://openweathermap.org/img/w/" + response.daily[i+1].weather[0].icon + ".png";
                            let img = $("<img>");                            
                            let newTemp = $("<p>");
                            let newHumid = $("<p>");
                            newTemp.text(`Temp: ${response.daily[i+1].temp.day} F`);
                            newHumid.text(`Humidity: ${response.daily[i+1].humidity} %`);
                            element.prepend(img);
                            img.attr("src", icon);
                            element.append(newTemp).append(newHumid); 

                            let unixTimeStamp = response.daily[i+1].dt;
                            let milliseconds = unixTimeStamp *1000;
                            let dateObject = new Date(milliseconds);
                            let currentDay = dateObject.toLocaleString("en-US", {weekday: "long"});
                            let currentMonth = dateObject.toLocaleString("en-US", {month: "long"});
                            let currentDate = dateObject.toLocaleString("en-US", {day: "numeric"});
                            let dateHead = $("<h3>");
                            dateHead.text(`${currentDay}, ${currentMonth} ${currentDate}`);
                            element.prepend(dateHead);
                    };
                });
            });            
        }; 
        listCities();
    }

    init();

    function getWeather() {
        if (city.val() !== "") {
            // Get latitude and longitude values for API weather query
            $.get(`${geoCode}&q=${city.val()},${state.val()},us`).then((response) => {
                let lat = response[0].lat;
                let lon = response[0].lon;
                let name = response[0].name;
                let state = response[0].state;
                $(".city-name").text(response[0].name);

                // Save the searched city to local storage 
                let newCity = {
                    "name": name,
                    "state": state
                };
                (cityHistory == null) ? cityHistory = [] : "";
                (JSON.stringify(cityHistory).includes(JSON.stringify(newCity))) ? "" : cityHistory.push(newCity);
                localStorage.setItem("cities", JSON.stringify(cityHistory));

                // use lat and lon values to search for that location's weather data
                $.get(`${weatherURL}&lat=${lat}&lon=${lon}`).then((response) => {

                    currentDate(response);

                    // Current conditions
                    $("p.current-temp").text(`Temperature: ${response.current.temp} F`);
                    $("p.current-humidity").text(`Humidity: ${response.current.humidity}%`);
                    $("p.current-wind").text(`Wind Speed: ${response.current.wind_speed} mph`);
                    $("p.current-uv").text(`UV Index: ${response.current.uvi}`);

                    // Change color of UV paragraph depending on severity of UV exposure
                    if (response.current.uvi < 3) {
                        $("p.current-uv").css("background-color", "green");
                    } else if (response.current.uvi >= 3 && response.current.uvi < 6) {
                        $("p.current-uv").css("background-color", "orange");
                    } else if (response.current.uv >= 6) {
                        $("p.current-uv").css("background-color", "orange");
                    };

                    // Prepend icon for current conditons
                    let currentIcon = "https://openweathermap.org/img/w/" + response.current.weather[0].icon + ".png";
                    $(".current-icon").attr("src", currentIcon);
                    
                    // Add new city to search history list only if it does not already exist
                    if (JSON.stringify(cityHistory).includes(JSON.stringify(newCity)) == false) {
                        let cityBtn = $("<li class='list-group-item'>");
                        cityBtn.text(`${name}, ${state}`);
                        cityBtn.attr("data-name", `${name}`);
                        cityBtn.attr("data-state", `${state}`);
                        $("ul").prepend(cityBtn);
                    };   


                    // 5 Day Forecast
                    for (let i = 0; i < forecastDays.length; i++) {
                        let element = forecastDays[i];
                            element.empty();       
                            let icon = "https://openweathermap.org/img/w/" + response.daily[i+1].weather[0].icon + ".png";
                            let img = $("<img>");                            
                            let newTemp = $("<p>");
                            let newHumid = $("<p>");
                            newTemp.text(`Temp: ${response.daily[i+1].temp.day} F`);
                            newHumid.text(`Humidity: ${response.daily[i+1].humidity} %`);
                            element.prepend(img);
                            img.attr("src", icon);
                            element.append(newTemp).append(newHumid);
                            // Add dates 
                            let unixTimeStamp = response.daily[i+1].dt;
                            let milliseconds = unixTimeStamp *1000;
                            let dateObject = new Date(milliseconds);
                            let currentDay = dateObject.toLocaleString("en-US", {weekday: "long"});
                            let currentMonth = dateObject.toLocaleString("en-US", {month: "long"});
                            let currentDate = dateObject.toLocaleString("en-US", {day: "numeric"});
                            let dateHead = $("<h3>");
                            dateHead.text(`${currentDay}, ${currentMonth} ${currentDate}`);
                            element.prepend(dateHead); 
                    };
                });
            });
        };
    };

    searchBtn.on("click", getWeather);

    $("li").on("click", function() {
        let _this = $(this);
        $.get(`${geoCode}&q=${_this.data("name")},${_this.data("state")},us`).then((response) => {
            let lat = response[0].lat;
            let lon = response[0].lon;
            $(".city-name").text(response[0].name);

            // use lat and lon values to search for that location's weather data
            $.get(`${weatherURL}&lat=${lat}&lon=${lon}`).then((response) => {
                // Current conditions
                $("p.current-temp").text(`Temperature: ${response.current.temp} F`);
                $("p.current-humidity").text(`Humidity: ${response.current.humidity}%`);
                $("p.current-wind").text(`Wind Speed: ${response.current.wind_speed} mph`);
                $("p.current-uv").text(`UV Index: ${response.current.uvi}`);

                if (response.current.uvi < 3) {
                    $("p.current-uv").css("background-color", "green");
                } else if (response.current.uvi >= 3 && response.current.uvi < 6) {
                    $("p.current-uv").css("background-color", "orange");
                } else if (response.current.uv >= 6) {
                    $("p.current-uv").css("background-color", "orange");
                };
                // Prepend icon for current conditons
                let currentIcon = "https://openweathermap.org/img/w/" + response.current.weather[0].icon + ".png";
                $("img.current-icon").attr("src", currentIcon);

                // 5 Day Forecast
                for (let i = 0; i < forecastDays.length; i++) {
                    let element = forecastDays[i];
                        element.empty();       
                        let icon = "https://openweathermap.org/img/w/" + response.daily[i+1].weather[0].icon + ".png";
                        let img = $("<img>");                            
                        let newTemp = $("<p>");
                        let newHumid = $("<p>");
                        newTemp.text(`Temp: ${response.daily[i+1].temp.day} F`);
                        newHumid.text(`Humidity: ${response.daily[i+1].humidity} %`);
                        element.prepend(img);
                        img.attr("src", icon);
                        element.append(newTemp).append(newHumid); 
                        // Add dates 
                        let unixTimeStamp = response.daily[i+1].dt;
                        let milliseconds = unixTimeStamp *1000;
                        let dateObject = new Date(milliseconds);
                        let currentDay = dateObject.toLocaleString("en-US", {weekday: "long"});
                        let currentMonth = dateObject.toLocaleString("en-US", {month: "long"});
                        let currentDate = dateObject.toLocaleString("en-US", {day: "numeric"});
                        let dateHead = $("<h3>");
                        dateHead.text(`${currentDay}, ${currentMonth} ${currentDate}`);
                        element.prepend(dateHead); 
                };
            });
        });       
    });
    console.log(JSON.stringify(cityHistory));
})