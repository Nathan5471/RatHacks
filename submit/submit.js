const eventDate = new Date("2025-05-24T08:00:00");

function updateCountdown() {
    const now = new Date();
    const timeDifference = eventDate - now;

    if (timeDifference > 0) {
        const days = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
        const hours = Math.floor(timeDifference / 1000 / 60 / 60) % 24;
        const minutes = Math.floor(timeDifference / 1000 / 60) % 60;
        const seconds = Math.floor(timeDifference / 1000) % 60;

        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;
    }
}

setInterval(updateCountdown, 1000);