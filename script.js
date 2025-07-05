// http://api.weatherapi.com/v1/current.json?key=780927323d624d1d974140427251606&q=Hyderabad&aqi=no

const temperatureField = document.querySelector(".temp");
const locationField = document.querySelector(".time_location p");
const dateandTimeField = document.querySelector(".time_location span");
const conditionField = document.querySelector(".condition p");
const searchField = document.querySelector(".search_area");
const form = document.querySelector("form");
const toggleBtn = document.querySelector(".toggle-btn");

let currentTempC = null;
let currentTempF = null;
let isCelsius = true;

form.addEventListener("submit", searchForLocation);

let target = "Melbourne";

const errorMsg = document.querySelector(".error-msg");

const fetchResults = async (targetLocation) => {
  const url = `http://api.weatherapi.com/v1/current.json?key=780927323d624d1d974140427251606&q=${targetLocation}&aqi=no`;
  try{
  const res = await fetch(url);
  if(!res.ok){
    throw new Error("City not found")
  }
  const data = await res.json();
  console.log(data);

  const locationName = data.location.name;
  const time = data.location.localtime;
  const tempC = data.current.temp_c;
  const tempF = data.current.temp_f;
  const condition = data.current.condition.text;

  updateDetails(tempC, tempF, locationName, time, condition);
  errorMsg.style.visibility = "hidden";
  }
  catch(error){
    console.log("Error fetching weather:",error);
    errorMsg.innerText = "Sorry,we couldn't find that city.Try another!";
    errorMsg.style.visibility = "visible";
  }
};

function updateDetails(tempC, tempF, locationName, time, condition) {
  currentTempC = tempC;
  currentTempF = tempF;

  temperatureField.innerText = `${tempC}°C`;
  locationField.innerText = locationName;
  dateandTimeField.innerText = time;
  conditionField.innerText = condition;

  updateBackground(condition);
}

function updateBackground(condition) {
  const container = document.querySelector(".container");
  container.className = "container";

  const cond = condition.toLowerCase();

  if (cond.includes("sunny")) {
    container.classList.add("sunny");
  } else if (cond.includes("clear")) {
    container.classList.add("clear");
  } else if (cond.includes("cloudy")) {
    container.classList.add("cloudy");
  } else if (cond.includes("rain")) {
    container.classList.add("rainy");
  } else if (cond.includes("partly") && cond.includes("cloudy")) {
    container.classList.add("partly-cloudy");
  } else if (cond.includes("mist")) {
    container.classList.add("mist");
  } else if (cond.includes("overcast")) {
    container.classList.add("overcast");
  } else {
    container.style.background = "linear-gradient(to bottom, #444, #222)";
  }
}

function searchForLocation(e) {
  e.preventDefault();
  if (searchField.value.trim() === "") return;
  target = searchField.value;
  fetchResults(target);
  searchField.value = "";
}

toggleBtn.addEventListener("click", () => {
  if (isCelsius) {
    temperatureField.innerText = `${currentTempF}°F`;
    toggleBtn.innerText = "Show °C";
  } else {
    temperatureField.innerText = `${currentTempC}°C`;
    toggleBtn.innerText = "Show °F";
  }
  isCelsius = !isCelsius;
});

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const long = position.coords.longitude;
        const lat = position.coords.latitude;
        fetchResults(`${lat},${long}`);
      },
      () => fetchResults("Hyderabad")
    );
  } else {
    fetchResults("Hyderabad");
  }
});

fetchResults(target);
