$(document).ready(function() {

    const _this = $(this);
    const searchBtn = $(".search-btn");
    let queryURL = "http://api.openweathermap.org/data/2.5/forecast?appid=fab861540adeaacaf58d87add689e290&units=imperial"
    let city = $(".city");
    let state = $(".state"); 

    
    
    searchBtn.on("click", function(){

        $.get(`${queryURL}&q=${city.val()},${state.val()},us`).then((response) => {
            console.log(response);
            let results = response.list;
            console.log(results[0].main.temp);
            $(".city-name").text(response.city.name);
        });
    });

})