const h1 = document.createElement("h1");
h1.innerText = "The Golden Hour";
document.body.append(h1);

const paragraph = document.createElement("p");
paragraph.innerText =
  "gold·en hour\n:the period of time just after sunrise or just before sunset when the light is infused with red and gold tones";
document.body.append(paragraph);

const container = document.createElement("div");
container.setAttribute("class", "container");
document.body.append(container);

const topRow = document.createElement("div");
topRow.setAttribute("class", "top-row");
container.append(topRow);

const input = document.createElement("input");
input.setAttribute("type", "text");
input.placeholder = "Search location (e.g. San Francisco, CA)";
topRow.append(input);

const button = document.createElement("button");
button.id = "submit";
button.innerText = "Search";
topRow.append(button);

const bottomColumn = document.createElement("div");
bottomColumn.setAttribute("class", "bottom-column");
container.append(bottomColumn);

const timeDiv = document.createElement("div");
timeDiv.setAttribute("class", "goldenTime");
bottomColumn.append(timeDiv);

const countdownLabel = document.createElement("div");
countdownLabel.setAttribute("class", "count-label");

const countdownDiv = document.createElement("div");
countdownDiv.id = "countdown";
countdownDiv.setAttribute("class", "countdown");

const hoursEl = document.createElement("div");
hoursEl.setAttribute("class", "hoursEl");
const minutesEl = document.createElement("div");
minutesEl.setAttribute("class", "minutesEl");
const secondsEl = document.createElement("div");
secondsEl.setAttribute("class", "secondsEl");

let intervalId;

button.addEventListener("click", handleClick);
input.addEventListener("keydown", handleEnter);

function convert12to24(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes, seconds] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}:${seconds}`;
}

function handleClick() {
  bottomColumn.append(countdownLabel);
  countdownLabel.innerText = "LIVE COUNTDOWN:";
  bottomColumn.append(countdownDiv);
  countdownDiv.appendChild(hoursEl);
  countdownDiv.appendChild(minutesEl);
  countdownDiv.appendChild(secondsEl);

  timeDiv.innerText = "";

  $.get(`https://geocode.maps.co/search?q=${input.value}`, function (data) {
    let latitude = data[0].lat;
    let longitude = data[0].lon;
    let locationName = data[0].display_name;
    let locationArr = locationName.split(", ");
    locationArr.pop();
    let location = locationArr.join(", ");

    $.get(
      `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`,
      function (data) {
        let goldenHour = data.results.golden_hour;
        timeDiv.append(
          `Today's golden hour in ${location} will occur at ${goldenHour}`
        );
        let currentDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        let goldTime = convert12to24(goldenHour);
        let currentDateTime = `${currentDate} ${goldTime}`;

        let countdownDate = new Date(currentDateTime).getTime();

        function countdownTimer() {
          let now = new Date().getTime();
          let timeLeft = countdownDate - now;

          // timeLeft = -1;

          if (timeLeft <= 0) {
            hoursEl.remove();
            minutesEl.remove();
            secondsEl.remove();
            countdownLabel.remove();
            timeDiv.innerText = `We regret to inform you that today's golden hour in ${location} occurred at ${goldenHour}. Please come back tomorrow.`;
          }

          let hours = Math.floor(
            (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          hoursEl.innerText = `Hours: ${hours}`;
          minutesEl.innerText = `Minutes: ${minutes}`;
          secondsEl.innerText = `Seconds: ${seconds}`;
        }

        clearInterval(intervalId);
        hoursEl.innerText = "";
        minutesEl.innerText = "";
        secondsEl.innerText = "";
        intervalId = setInterval(countdownTimer, 1000);
      }
    );
  });
  input.value = "";
}

function handleEnter(event) {
  if (event.keyCode === 13) {
    bottomColumn.append(countdownLabel);
    countdownLabel.innerText = "LIVE COUNTDOWN:";
    bottomColumn.append(countdownDiv);
    countdownDiv.appendChild(hoursEl);
    countdownDiv.appendChild(minutesEl);
    countdownDiv.appendChild(secondsEl);

    timeDiv.innerText = "";

    $.get(`https://geocode.maps.co/search?q=${input.value}`, function (data) {
      let latitude = data[0].lat;
      let longitude = data[0].lon;
      let locationName = data[0].display_name;
      let locationArr = locationName.split(", ");
      locationArr.pop();
      let location = locationArr.join(", ");

      $.get(
        `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`,
        function (data) {
          let goldenHour = data.results.golden_hour;
          timeDiv.append(
            `Today's golden hour in ${location} will occur at ${goldenHour}`
          );
          let timeZone = data.results.timezone;
          console.log(timeZone);
          let currentDate = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          let goldTime = convert12to24(goldenHour);
          let currentDateTime = `${currentDate} ${goldTime}`;

          let countdownDate = new Date(currentDateTime).getTime();

          function countdownTimer() {
            let now = new Date().getTime();
            let timeLeft = countdownDate - now;

            // timeLeft = -1;

            if (timeLeft <= 0) {
              hoursEl.remove();
              minutesEl.remove();
              secondsEl.remove();
              countdownLabel.remove();
              timeDiv.innerText = `We regret to inform you that today's golden hour in ${location} occurred at ${goldenHour}. Please come back tomorrow.`;
            }

            let hours = Math.floor(
              (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            let minutes = Math.floor(
              (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
            );
            let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            hoursEl.innerText = `Hours: ${hours}`;
            minutesEl.innerText = `Minutes: ${minutes}`;
            secondsEl.innerText = `Seconds: ${seconds}`;
          }

          clearInterval(intervalId);
          hoursEl.innerText = "";
          minutesEl.innerText = "";
          secondsEl.innerText = "";
          intervalId = setInterval(countdownTimer, 1000);
        }
      );
    });
    input.value = "";
  }
}
