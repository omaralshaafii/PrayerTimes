// Global vars
let theHijriDateElement = document.querySelector(".general .date");
let theCityElement = document.querySelector(".general .city");
let prayersContainer = document.querySelector(".prayers-container");
let selectInput = document.querySelector(".select-input");

// Get prayers times function
function getTimes(year, month, day, city, country) {
  axios
    .get(
      `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=5`
    )
    .then((response) => {
      let result = response.data.data[day - 1];

      // Add hijri date to the page

      let dayName = result.date.hijri.weekday.ar;
      let hijriDayNum = result.date.hijri.day;
      let hijriMonthName = result.date.hijri.month.ar;
      let hijriYearNum = result.date.hijri.year;

      let hijriDate =
        dayName + " " + hijriDayNum + " " + hijriMonthName + " " + hijriYearNum;

      theHijriDateElement.innerHTML = hijriDate;
      // Add times to the page
      let timeContent = `
        <div class="prayer-container">
            <div class="prayer">الفجر</div>
            <div class="time" data-time="${result.timings.Fajr.slice(
              0,
              5
            )}" >${formatTime(result.timings.Fajr.slice(0, 5))}</div>
        </div>
        <div class="prayer-container">
            <div class="prayer">الشروق</div>
            <div class="time"  data-time="${result.timings.Sunrise.slice(
              0,
              5
            )}">${formatTime(result.timings.Sunrise.slice(0, 5))}</div>
        </div>
        <div class="prayer-container">
            <div class="prayer">الظهر</div>
            <div class="time" data-time="${result.timings.Dhuhr.slice(
              0,
              5
            )}">${formatTime(result.timings.Dhuhr.slice(0, 5))}</div>
        </div>
        <div class="prayer-container">
            <div class="prayer">العصر</div>
            <div class="time" data-time="${result.timings.Asr.slice(
              0,
              5
            )}">${formatTime(result.timings.Asr.slice(0, 5))}</div>
        </div>
        <div class="prayer-container">
            <div class="prayer">المغرب</div>
            <div class="time" data-time="${result.timings.Maghrib.slice(
              0,
              5
            )}">${formatTime(result.timings.Maghrib.slice(0, 5))}</div>
        </div>
        <div class="prayer-container">
            <div class="prayer">العشاء</div>
            <div class="time" data-time="${result.timings.Isha.slice(
              0,
              5
            )}">${formatTime(result.timings.Isha.slice(0, 5))}</div>
        </div>
      `;

      prayersContainer.innerHTML = timeContent;

      // Make closest prayer active
      AddActiveClass();
    });
}

// Get date function
function getDate(city, country) {
  let date = new Date();
  let day = date.getDate();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;

  getTimes(year, month, day, city || "Cairo", country || "Egypt");
}

getDate();

// Get prayers times by choosing city
selectInput.addEventListener("change", function () {
  // get selcted country and city
  let city =
    selectInput.options[selectInput.selectedIndex].getAttribute("data-city");
  let country =
    selectInput.options[selectInput.selectedIndex].getAttribute("data-country");

  theCityElement.innerHTML =
    selectInput.options[selectInput.selectedIndex].text;

  getDate(city, country);
});

// Add Active class function
function AddActiveClass() {
  // Get all the elements with the data-time attribute
  var elements = document.querySelectorAll("[data-time]");

  // Get the current time
  var currentTime = new Date();
  var currentHours = currentTime.getHours();
  var currentMinutes = currentTime.getMinutes();

  // Convert current time into minutes
  var currentTotalMinutes = currentHours * 60 + currentMinutes;

  // Initialize minimum difference as a large value
  var minDifference = Infinity;
  var closestElement;

  // Iterate through each element and find the closest time
  elements.forEach(function (element) {
    // Get the time from the data-time attribute of the element
    var time = element.getAttribute("data-time");

    // Extract hours and minutes from the time
    var [hours, minutes] = time.split(":");
    var timeHours = parseInt(hours);
    var timeMinutes = parseInt(minutes);

    // Calculate the time in minutes
    var timeTotalMinutes = timeHours * 60 + timeMinutes;

    // Calculate the difference (subtraction)
    var difference = timeTotalMinutes - currentTotalMinutes;
    // Check if the time is after the current time and update the closest element if necessary
    if (difference > 0 && difference < minDifference) {
      minDifference = difference;
      closestElement = element;
    }
  });
  // Add active class to the closest prayer
  closestElement.parentNode.classList.add("active");
}

// Change time formate function
function formatTime(timeString) {
  const [hourString, minute] = timeString.split(":");
  const hour = +hourString % 24;
  return (
    `${hour % 12 || 12}`.padStart(2, "0") +
    ":" +
    minute +
    (hour < 12 ? "AM" : "PM")
  );
}
