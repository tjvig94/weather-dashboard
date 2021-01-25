$(document).ready(function() {

    const _this = $(this);
    const searchBtn = $(".search-btn");
    let weatherURL = "http://api.openweathermap.org/data/2.5/weather?appid=fab861540adeaacaf58d87add689e290&units=imperial"
    let forecastURL = "http://api.openweathermap.org/data/2.5/forecast?appid=fab861540adeaacaf58d87add689e290&units=imperial"
    let city = $(".city");
    let state = $(".state");
    let forecastDays = [
        $("div.day1"), $("div.day2"), $("div.day3"),  $("div.day4"), $("div.day5")
    ]

    let cityHistory = JSON.parse(localStorage.getItem("Cities"));    

    function listCities() {
        (cityHistory == null) ? cityHistory = [] : "";
        cityHistory.forEach(element => {
            let cityBtn = $("<li class='list-group-item'>");
            cityBtn.text(element);
            $("ul").prepend(cityBtn);
        });
    };
    
    listCities();

    function init() {
        let recentCity = cityHistory[cityHistory.length-1];
        
    }

    init();

    function getWeather() {
        $.get(`${weatherURL}&q=${city.val()},${state.val()},us`).then((response) => {

            console.log(response);
            $(".weather-reuslts").empty();
            $(".city-name").text(response.name);
            $("p.current-temp").text(`Temperature: ${response.main.temp} F`);
            $("p.current-humidity").text(`Humidity: ${response.main.humidity}%`);
            $("p.current-wind").text(`Wind Speed: ${response.wind.speed} mph`);
            $("p.current-uv").text(`UV Index: `);
        });

        $.get(`${forecastURL}&q=${city.val()},${state.val()},us`).then((response) => {            
            console.log(response);
            let e = 4;
            for (let i = 0; i < forecastDays.length; i++) {
                forecastDays[i].empty();
                let element = forecastDays[i];
                let newTemp = $("<p>");
                let newHumid = $("<p>");
                newTemp.text(`Temp: ${response.list[e].main.temp} F`);
                newHumid.text(`Humidity: ${response.list[e].main.humidity}%`);
                element.append(newTemp).append(newHumid);
                e+=8;
            };
            
            if (cityHistory.includes(city.val())) {
                return;
            } else {
                let cityBtn = $("<li class='list-group-item'>");            
                cityBtn.text(city.val());
                $("ul").prepend(cityBtn);
                cityHistory.push(city.val());
                localStorage.setItem("Cities", JSON.stringify(cityHistory));
            }            
        });
    };
    
    searchBtn.on("click", getWeather);
})