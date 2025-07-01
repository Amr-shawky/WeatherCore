//http://api.weatherapi.com/v1/current.json?key=5f4ef216e8cc4506abb181515253006&q=Cairo
/**
 * response example 
 * {
  "location": {
    "name": "Cairo",
    "region": "Al Qahirah",
    "country": "Egypt",
    "lat": 30.05,
    "lon": 31.25,
    "tz_id": "Africa/Cairo",
    "localtime_epoch": 1751372832,
    "localtime": "2025-07-01 15:27"
  },
  "current": {
    "last_updated_epoch": 1751372100,
    "last_updated": "2025-07-01 15:15",
    "temp_c": 30.2,
    "temp_f": 86.4,
    "is_day": 1,
    "condition": {
      "text": "Heavy rain",
      "icon": "//cdn.weatherapi.com/weather/64x64/day/308.png",
      "code": 1195
    },
    "wind_mph": 10.5,
    "wind_kph": 16.9,
    "wind_degree": 290,
    "wind_dir": "WNW",
    "pressure_mb": 1006,
    "pressure_in": 29.71,
    "precip_mm": 0,
    "precip_in": 0,
    "humidity": 49,
    "cloud": 75,
    "feelslike_c": 28,
    "feelslike_f": 82.4,
    "windchill_c": 38.5,
    "windchill_f": 101.3,
    "heatindex_c": 37.8,
    "heatindex_f": 100,
    "dewpoint_c": 8.8,
    "dewpoint_f": 47.8,
    "vis_km": 4,
    "vis_miles": 2,
    "uv": 7.9,
    "gust_mph": 12.1,
    "gust_kph": 19.5
  }
}
 * 
 */
let apiKey = "5f4ef216e8cc4506abb181515253006";
let apiUrl = "https://api.weatherapi.com/v1/forecast.json?key=" + apiKey + "&days=3&q="; // changed to forecast endpoint
let searchInput = document.getElementById("search-input");
let searchButton = document.getElementById("search-button");
let weatherDisplay = document.getElementById("forecast-container");

// Function to display weather data
function displayWeatherData(data) {
    if (data.error) {
        console.error("Error fetching weather data:", data.error.message);
        swal("Error", "Could not find weather data for the specified location.", "error");  
        return;
    }
    if (data.location && data.current && data.current.condition) {
        const forecastDays = data.forecast && data.forecast.forecastday ? data.forecast.forecastday : [];
        let forecastHTML = "";

        forecastDays.forEach((day, idx) => {
            const dateObj = new Date(day.date);
            const daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const dayName = daysArr[dateObj.getDay()];
            const dateStr = `${dateObj.getDate()}${monthsArr[dateObj.getMonth()]}`;
            let forecastClass = "";
            if (idx === 0) forecastClass = "today forecast rounded-start-4 bg-darkblue";
            else if (idx === forecastDays.length - 1) forecastClass = "forecast rounded-end-4 text-center bg-darkblue";
            else forecastClass = "forecast text-center bg-darkblue2";

            let headerClass = "";
            if (idx === 0) headerClass = "p-2 forecast-header d-flex  justify-content-between bg-darkblue3 rounded-end-0 rounded-top-4";
            else if (idx === forecastDays.length - 1) headerClass = "p-2 forecast-header d-flex  justify-content-between bg-darkblue3 rounded-top-4 rounded-start-0";
            else headerClass = "p-2 forecast-header d-flex  justify-content-between bg-darkblue4";

            forecastHTML += `
                <div class="${forecastClass}">
                    <div class="${headerClass}" ${idx === 0 ? 'id="today"' : ''}>
                        <div class="day">${dayName}</div>
                        <div class="date">${dateStr}</div>
                    </div>
                    <div class="forecast-content ${idx === 0 ? 'px-4 py-4' : 'py-5'}" ${idx === 0 ? 'id="current"' : ''}>
                        <div class="location">${idx === 0 ? data.location.name : ""}</div>
                        <div class="degree">
                            <div class="num">${day.day.maxtemp_c}<sup>o</sup>C</div>
                            <div class="forecast-icon">
                                <img src="https:${day.day.condition.icon}" alt="" width="${idx === 0 ? "90" : "48"}">
                            </div>
                        </div>
                        <small>${day.day.mintemp_c}<sup>o</sup></small>
                        <div class="custom ${idx === 0 ? "pb-4" : "pt-4"}">${day.day.condition.text}</div>
                        ${idx === 0 ? `
                        <div class="forecast-details d-flex justify-content-between">
                            <span><img class="pe-1" src="./Assets/Images/imgi_3_icon-umberella.png" alt="">${day.day.avghumidity}%</span>
                            <span><img class="pe-1" src="./Assets/Images/imgi_4_icon-wind.png" alt="">${day.day.maxwind_kph}km/h</span>
                            <span><img class="" src="./Assets/Images/imgi_5_icon-compass.png" alt="">${day.day.condition.text}</span>
                        </div>
                        ` : ""}
                    </div>
                </div>
            `;
        });

        weatherDisplay.innerHTML = forecastHTML;
        // log the data to the console for debugging and swal
        console.log(data);
    }
}

// Fetch and display weather data for a given location
async function fetchAndDisplayWeather(location) {
    if (!location) return;
    try {
        let result = await fetch(apiUrl + location);
        console.log("Fetching weather data for:", location);
        if (!result.ok) {
            throw new Error("Network response was not ok");
        }
        let data = await result.json();
        console.log("Weather data received:", data);
        displayWeatherData(data);
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

searchInput.addEventListener("input", function() {
    let location = searchInput.value;
    fetchAndDisplayWeather(location);
});

// Display weather for a default location when the site loads
window.addEventListener("DOMContentLoaded", function() {
    fetchAndDisplayWeather("Cairo");
});
