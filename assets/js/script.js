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
        (cityHistory == null) ? cityHistory = [] : "";
        cityHistory.forEach(element => {
            let cityBtn = $("<li class='list-group-item'>");
            cityBtn.text(`${element.name}, ${element.state}`);
            cityBtn.attr("data-name", `${element.name}`);
            cityBtn.attr("data-state", `${element.state}`);
            $("ul").prepend(cityBtn);
        });
    };

    function init() {
        if (cityHistory !== null) {
            let recentCity = cityHistory[cityHistory.length-1];
            console.log(recentCity);
            $.get(`${geoCode}&q=${recentCity.name},${recentCity.state},us`).then((response) => {
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
                console.log(response);
                let lat = response[0].lat;
                let lon = response[0].lon;
                let name = response[0].name;
                let state = response[0].state;
                $(".city-name").text(response[0].name);

                let newCity = {
                    "name": name,
                    "state": state,
                    "lat": lat,
                    "lon": lon
                };

                (cityHistory == null) ? cityHistory = [] : "";
                cityHistory.push(newCity);
                localStorage.setItem("cities", JSON.stringify(cityHistory));

                // use lat and lon values to search for that location's weather data
                $.get(`${weatherURL}&lat=${lat}&lon=${lon}`).then((response) => {
                    console.log(response);

                    // Current conditions
                    $("p.current-temp").text(`Temperature: ${response.current.temp} F`);
                    $("p.current-humidity").text(`Humidity: ${response.current.humidity}%`);
                    $("p.current-wind").text(`Wind Speed: ${response.current.wind_speed} mph`);
                    $("p.current-uv").text(`UV Index: ${response.current.uvi}`);
                    // Prepend icon for current conditons
                    let currentIcon = "https://openweathermap.org/img/w/" + response.current.weather[0].icon + ".png";
                    $(".current-icon").attr("src", currentIcon);

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
                };
            });
        });       
    });
})