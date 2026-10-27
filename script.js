
/* Persönlicher "Was soll ich jetzt tun?"-Coach */

const coachTasks = [
  {
    title: "📚 15 Minuten für die Schule lernen",
    description: "Wiederhole ein Thema für deine nächste Klausur.",
    duration: 15,
    category: "Schule"
  },
  {
    title: "💻 15 Minuten an deinem Business arbeiten",
    description: "Verbessere eine Kleinigkeit an deinem Online-Projekt.",
    duration: 15,
    category: "Business"
  },
  {
    title: "🌿 10 Minuten für dich",
    description: "Mache eine kurze Pause oder eine leichte Dehnübung.",
    duration: 10,
    category: "Wohlbefinden"
  },
  {
    title: "🧹 5 Minuten Ordnung schaffen",
    description: "Erledige eine kleine Aufgabe, die dir später hilft.",
    duration: 5,
    category: "Alltag"
  }
];

let coachTaskIndex = 0;

function showNextCoachTask() {
  const task = coachTasks[coachTaskIndex];

  const title = document.getElementById("coach-task-title");
  const description = document.getElementById("coach-task-description");
  const duration = document.getElementById("coach-task-duration");
  const category = document.getElementById("coach-task-category");

  if (!title || !description || !duration || !category) {
    console.error(
      "Coach-Bereich fehlt. Bitte die passenden HTML-Elemente hinzufügen."
    );
    return;
  }

  title.textContent = task.title;
  description.textContent = task.description;
  duration.textContent = `${task.duration} Minuten`;
  category.textContent = task.category;
}

function completeCoachTask() {
  coachTaskIndex = (coachTaskIndex + 1) % coachTasks.length;
  showNextCoachTask();

  
/* Persönlicher Tagesplan */

function generateDailySchedule() {
  const startInput = document.getElementById("schedule-start");
  const energyInput = document.getElementById("schedule-energy");
  const results = document.getElementById("schedule-results");
  const dateDisplay = document.getElementById("schedule-date");

  if (!startInput || !energyInput || !results) return;

  const [startHour, startMinute] = startInput.value
    .split(":")
    .map(Number);

  const energy = energyInput.value;

  if (Number.isNaN(startHour) || Number.isNaN(startMinute)) {
    results.textContent = "Bitte wähle eine Startzeit.";
    return;
  }

  let currentMinutes = startHour * 60 + startMinute;

  const focusDuration = energy === "low" ? 20 : energy === "high" ? 45 : 30;
  const breakDuration = energy === "low" ? 15 : 10;

  const tasks = [
    { title: "🌅 Ankommen und Tagesplanung", duration: 15 },
    { title: "📚 Lernen: wichtigstes Schulfach", duration: focusDuration },
    { title: "☕ Pause und etwas trinken", duration: breakDuration },
    { title: "📝 Übungsaufgaben oder Wiederholung", duration: focusDuration },
    { title: "🥗 Essen und Erholung", duration: 45 },
    { title: "💻 Persönliches Projekt oder Business", duration: focusDuration },
    { title: "🌿 Pause und Bewegung nach Bedarf", duration: breakDuration },
    { title: "🎯 Kleine Aufgabe für deine Ziele", duration: 20 },
    { title: "🌙 Tagesabschluss und Vorbereitung", duration: 10 }
  ];

  function formatTime(totalMinutes) {
    const minutes = ((totalMinutes % 1440) + 1440) % 1440;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return String(hours).padStart(2, "0") + ":" +
      String(mins).padStart(2, "0");
  }

  results.replaceChildren();

  const heading = document.createElement("h3");
  heading.textContent = "Dein Zeitplan";
  results.appendChild(heading);

  tasks.forEach((task) => {
    const start = currentMinutes;
    const end = currentMinutes + task.duration;

    const item = document.createElement("div");
    item.className = "schedule-item";

    const time = document.createElement("strong");
    time.textContent = `${formatTime(start)}–${formatTime(end)}`;

    const title = document.createElement("p");
    title.textContent = task.title;

    const duration = document.createElement("small");
    duration.textContent = `${task.duration} Minuten`;

    item.append(time, title, duration);
    results.appendChild(item);

    currentMinutes = end;
  });

  if (dateDisplay) {
    dateDisplay.textContent = new Date().toLocaleDateString("de-DE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }
}

}

document.addEventListener("DOMContentLoaded", showNextCoachTask);
