// Function to load submitted entries from local storage
function loadMeetupEntries() {
    const savedEntries = JSON.parse(localStorage.getItem("meetupEntries"));
    if (savedEntries) {
        const currentDate = new Date();
        savedEntries.forEach(entry => {
            const eventDate = new Date(entry.date);
            if (eventDate < currentDate) {
                // Event date has passed, visually indicate it's expired
                entry.expired = true;
            } else {
                // Event is still valid
                entry.expired = false;
                const meetupEntry = createMeetupEntry(entry);
                document.getElementById("meetupEntries").appendChild(meetupEntry);
            }
        });

        // Save filtered entries back to local storage
        const filteredEntries = savedEntries.filter(entry => !entry.expired);
        localStorage.setItem("meetupEntries", JSON.stringify(filteredEntries));
    }
}

// Function to save submitted entry to local storage
function saveMeetupEntry(entry) {
    const existingEntries = JSON.parse(localStorage.getItem("meetupEntries")) || [];
    existingEntries.push(entry);
    localStorage.setItem("meetupEntries", JSON.stringify(existingEntries));
}

// Function to create HTML structure for a meetup entry
function createMeetupEntry(entryData) {
    const meetupEntry = document.createElement("div");
    meetupEntry.classList.add("meetup-entry");
    meetupEntry.innerHTML = `
        <p>Name: ${entryData.firstName}</p>
        <p>Email: ${entryData.email}</p>
        <p>Date: ${entryData.date}</p>
        <p>Time: ${entryData.time}</p>
        <p>Place: ${entryData.place}</p>
        <button class="attend-btn">I'll be there</button>
        <p>Number of attendees: <span class="attendees">${entryData.attendees || 0}</span></p>
    `;
    return meetupEntry;
}

// Function to clear submitted entries from local storage and the page
function clearMeetupEntries() {
    localStorage.removeItem("meetupEntries");
    document.getElementById("meetupEntries").innerHTML = ""; // Clear entries from the page
}

document.addEventListener("DOMContentLoaded", function() {
    loadMeetupEntries(); // Load existing entries when the page loads
});

document.getElementById("meetupForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const place = document.getElementById("place").value;

    const entry = {
        firstName: firstName,
        email: email,
        date: date,
        time: time,
        place: place
    };

    const meetupEntry = createMeetupEntry(entry);
    document.getElementById("meetupEntries").appendChild(meetupEntry);

    saveMeetupEntry(entry); // Save the new entry to local storage

    document.getElementById("meetupForm").reset(); // Reset form fields
});

// Event delegation for dynamically added buttons
document.getElementById("meetupEntries").addEventListener("click", function(event) {
    if (event.target.classList.contains("attend-btn") && !event.target.classList.contains("clicked")) {
        const attendeesElement = event.target.parentElement.querySelector(".attendees");
        let attendees = parseInt(attendeesElement.textContent);
        attendees++;
        attendeesElement.textContent = attendees;
        event.target.classList.add("clicked"); // Add the "clicked" class to prevent further clicks

        // Update entry in local storage with updated attendee count
        const entryIndex = Array.from(event.target.parentElement.parentElement.parentElement.children).indexOf(event.target.parentElement.parentElement);
        const savedEntries = JSON.parse(localStorage.getItem("meetupEntries"));
        savedEntries[entryIndex] = {
            ...savedEntries[entryIndex],
            attendees: attendees
        };
        localStorage.setItem("meetupEntries", JSON.stringify(savedEntries));
    }
});
