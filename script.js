
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
}

document.addEventListener("DOMContentLoaded", showNextCoachTask);
