# Weather Dashboard

Application: https://tjvig94.github.io/weather-dashboard/

## Overview

The Weather Dashboard application allows users to search for a city or town and receive weather information for the current day, and the proceeding 5 days. As users search for cities, their recent searches are saved in a list which they can use to quickly load weather data for those prior searches.

## Openweather API's

Openweather's Geocoding API is used to acquire a city's latitudinal/longitudinal location, which is then used for a request through Openweather's One Call API to get weather data for that location. Basic date information is also parsed from the Open Call API's response.

## Bootstrap and a Dynamic Page

Bootstrap is used for the structure of the page, which is simply a header and 3 cards. The page is designed is that it can be easily viewed on mobile devices as well.

The page is dynamic, meaning that as API requests are fulfilled, the elements are filled with that data.

![Weather Dashboard Screenshot](assets\weather-dashboard.png)