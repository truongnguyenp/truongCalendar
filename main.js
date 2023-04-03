const handlePopup = (event) => {
  console.log("ok");
  const username = document.getElementById("username").value;
  const popup = document.getElementById("popup");
  if (!username) {
    alert("Pls input username")
    return;
  }
  if (document.getElementById("addAppointment").textContent == "Hide add appointment") {
    popup.style.display = "none";
    (document.getElementById("addAppointment")).textContent = "Add Appointment"
  } else {
    popup.style.display = "block";
    (document.getElementById("addAppointment")).textContent = "Hide add appointment"

  }
};
const form = document.querySelector("form");
const nameInput = document.querySelector("#name");
const locationInput = document.querySelector("#location");
const startTimeInput = document.querySelector("#start-time");
const endTimeInput = document.querySelector("#end-time");
const reminderInput = document.querySelector("#reminder");

const LOCAL_STORAGE_APPOINTMENTS_KEY = "appointments";

const addToStorage = (appointment) => {
  const appointments =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_APPOINTMENTS_KEY)) || [];
  appointments.push(appointment);
  localStorage.setItem(
    LOCAL_STORAGE_APPOINTMENTS_KEY,
    JSON.stringify(appointments)
  );
  console.log("saved to");
};
const reloadAppointments = () => {
  const appointments =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_APPOINTMENTS_KEY)) || [];
  const appointmentsContainer = document.querySelector("#appointments");
  appointments.forEach((appointment) => {
    const appointmentElement = document.createElement("div");
    appointmentElement.classList.add("appointment");
    appointmentElement.innerHTML = `    <div class="appointment-name">${appointment.name}</div>
        <div class="appointment-location">${appointment.location}</div>
        <div class="appointment-time">${appointment.startTime} - ${appointment.endTime}</div>
        <div class="appointment-participantList">${appointment.participantList}</div>
        <div class="appointment-reminder">${appointment.reminder}</div>`;
    appointmentsContainer.appendChild(appointmentElement);
  });
};
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.toLowerCase();
  const location = locationInput.value;
  const startTime = new Date(startTimeInput.value);
  const endTime = new Date(endTimeInput.value);
  const reminder = reminderInput.checked;
  const username = document.getElementById("username").value;

  if (name.trim() === "") {
    alert("Please enter a name for the appointment.");
    return;
  }

  if (startTime >= endTime) {
    alert("Please enter a valid start and end time.");
    return;
  }

  // check if appointment conflicts with existing appointments
  // if there is a conflict, show a warning message and ask user to choose an available time or replace the previous appointment

  // check if appointment is similar to an existing group meeting
  // if it is, ask user if they intended to join the group meeting instead

  // add appointment to calendar's list of appointments
  // add reminder (if selected) to list of reminders
  const meetingIndex = meetingExistedIndex(name, startTime, endTime);
  if (meetingIndex < 0)
    addToStorage({
      name,
      location,
      startTime,
      endTime,
      reminder,
      participantList: [username],
    });
  else
    addParticipantToExistedMeeting(meetingIndex, {
      name,
      location,
      startTime,
      endTime,
      reminder,
      participantList: [username],
    });
  nameInput.value = "";
  locationInput.value = "";
  startTimeInput.value = "";
  endTimeInput.value = "";
  reminderInput.checked = false;
  popup.style.display = "none";

  reloadAppointments();
});
const meetingExistedIndex = (name, startTime, endTime) => {
  const appointments =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_APPOINTMENTS_KEY)) || [];
  const duration = endTime - startTime;

  const index = appointments.findIndex((appointment) => {
    const appointmentDuration =
      Date.parse(appointment.endTime) - Date.parse(appointment.startTime);

    console.log(appointmentDuration + " new duration");
    console.log(appointment.name + " new name");
    console.log(duration + " existed duration");
    console.log(name + " existed name");

    return appointment.name === name && appointmentDuration === duration;
  });
  console.log(index + " index");
  return index;
};
const addParticipantToExistedMeeting = (index, appointment) => {
  const appointments =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_APPOINTMENTS_KEY)) || [];
  const participantList = appointments[index].participantList;
  if (participantList.includes(appointment.participantList[0])) {
    alert("You have already joined this meeting");
    return;
  } else {
    participantList.push(appointment.participantList[0]);

    appointments[index].participantList = participantList;
    localStorage.setItem(
      LOCAL_STORAGE_APPOINTMENTS_KEY,
      JSON.stringify(appointments)
    );
    alert("You joined this meeting successfully");
  }
};
reloadAppointments();
