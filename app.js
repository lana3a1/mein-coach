// Cherry Doll Coach App Logic
let appData = {
    energyMode: 'normal', // 'normal' or 'low'
    tasks: [
        { id: 1, title: 'Biologie: Fotosynthese wiederholen', category: 'Schule', date: '2026-11-02', priority: 'Hoch', status: 'open' },
        { id: 2, title: 'Bewerbung für Remote-Assistenz abschicken', category: 'Beruf', date: '2026-10-27', priority: 'Hoch', status: 'open' },
        { id: 3, title: 'Sanftes Knie-Training & Stretching', category: 'Fitness', date: '2026-10-27', priority: 'Mittel', status: 'done' }
    ],
    exams: [
        { subject: 'Biologie', date: '2026-11-03', topics: ['Fotosynthese', 'Zellatmung', 'Diffusion und Osmose', 'Zellorganellen'] },
        { subject: 'Englisch', date: '2026-11-11', topics: ['The individual in society', 'Aspect-based summary', 'Will-future / Going-to-future'] },
        { subject: 'Französisch', date: '2026-11-13', topics: ['Vokabeltest: Deutsch -> Französisch'] },
        { subject: 'Französisch', date: '2026-11-27', topics: ['Themen noch offen'] },
        { subject: 'Mathematik', date: '2026-11-19', topics: ['Funktionen und Graphen', 'Polynomdivision', 'Nullstellen'] },
        { subject: 'Deutsch', date: '2026-11-23', topics: ['Textgebundener argumentativer Aufsatz', 'Indirekte Rede'] },
        { subject: 'Mathematik', date: '2027-01-15', topics: ['Thema noch nicht bestätigt'] },
        { subject: 'Französisch', date: '2027-01-22', topics: ['Thema noch nicht bestätigt'] }
    ],
    applications: [
        { company: 'Digital Media GmbH', role: 'Content Assistant (Remote)', date: '2026-10-20', status: 'Beworben', nextAction: 'Rückmeldung abwarten' }
    ],
    reading: { todayPages: 25 },
    training: { countWeek: 2 }
};

// Initialisierung beim Laden
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initNavigation();
    initModals();
    renderAll();
    setupChat();
    setupDataManagement();
});

function loadData() {
    const saved = localStorage.getItem('cherryDollData');
    if (saved) {
        try {
            appData = JSON.parse(saved);
        } catch (e) {
            console.error('Fehler beim Laden der gespeicherten Daten', e);
        }
    }
}

function saveData() {
    localStorage.setItem('cherryDollData', JSON.stringify(appData));
}

// Navigation zwischen Ansichten
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.getAttribute('data-view');
            switchView(view);
        });
    });
}

function switchView(viewName) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(nav => nav.classList.remove('active'));

    const targetSec = document.getElementById(`view-${viewName}`);
    if (targetSec) targetSec.classList.add('active');

    document.querySelectorAll(`[data-view="${viewName}"]`).forEach(el => el.classList.add('active'));
    renderAll();
}

// Rendering aller Bereiche
function renderAll() {
    renderDashboard();
    renderTasks();
    renderSchool();
    renderApplications();
    renderFitness();
    renderProgress();
}

function renderDashboard() {
    // Aufgaben heute Statistik
    const totalTasks = appData.tasks.length;
    const doneTasks = appData.tasks.filter(t => t.status === 'done').length;
    document.getElementById('stat-tasks-done').innerText = `${doneTasks}/${totalTasks}`;
    document.getElementById('stat-apps-week').innerText = `${appData.applications.length}/5`;
    document.getElementById('stat-reading').innerText = `${appData.reading.todayPages}/50`;

    // Nächste Klausur ermitteln (ab 27. Oktober 2026)
    const upcomingExams = appData.exams
        .filter(e => new Date(e.date) >= new Date('2026-10-27'))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const examWidget = document.getElementById('next-exam-widget');
    if (upcomingExams.length > 0) {
        const next = upcomingExams[0];
        examWidget.innerHTML = `<strong>${next.subject}</strong> am ${next.date}<br><small>Themen: ${next.topics.join(', ')}</small>`;
    } else {
        examWidget.innerHTML = 'Keine anstehenden Klausuren eingetragen.';
    }

    // Nächste sinnvolle Aufgabe
    const smartTaskWidget = document.getElementById('next-smart-task');
    const openTasks = appData.tasks.filter(t => t.status === 'open');
    if (openTasks.length > 0) {
        smartTaskWidget.innerHTML = `👉 <strong>${openTasks[0].title}</strong><br><small>Bereich: ${openTasks[0].category} | Priorität: ${openTasks[0].priority}</small>`;
    } else {
        smartTaskWidget.innerHTML = 'Super! Alle Aufgaben für heute erledigt. 🍒';
    }

    // Mini Task List
    const miniList = document.getElementById('dashboard-task-list');
    miniList.innerHTML = appData.tasks.slice(0, 3).map(t => `
        <div class="task-item-mini">
            <input type="checkbox" ${t.status === 'done' ? 'checked' : ''} onclick="toggleTask(${t.id})">
            <span class="${t.status === 'done' ? 'completed' : ''}">${t.title}</span>
        </div>
    `).join('');
}

function renderTasks() {
    const listContainer = document.getElementById('full-task-list');
    listContainer.innerHTML = appData.tasks.map(t => `
        <div class="card mb-2" style="display: flex; justify-content: space-between; align-items: center; padding: 16px;">
            <div>
                <strong>${t.title}</strong><br>
                <small>${t.category} | Fällig: ${t.date} | Priorität: ${t.priority}</small>
            </div>
            <div>
                <button class="btn-secondary" onclick="toggleTask(${t.id})">${t.status === 'done' ? 'Wieder öffnen' : 'Erledigen'}</button>
                <button class="btn-danger" onclick="deleteTask(${t.id})" style="background:#ffcccc; border:none; padding:8px; border-radius:8px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function toggleTask(id) {
    const task = appData.tasks.find(t => t.id === id);
    if (task) {
        task.status = task.status === 'done' ? 'open' : 'done';
        saveData();
        renderAll();
    }
}

function deleteTask(id) {
    appData.tasks = appData.tasks.filter(t => t.id !== id);
    saveData();
    renderAll();
}

function renderSchool() {
    const container = document.getElementById('subjects-container');
    const subjects = ['Französisch', 'Englisch', 'Deutsch', 'Geschichte', 'Biologie', 'Physik', 'Mathematik'];
    
    container.innerHTML = subjects.map(sub => {
        const subExams = appData.exams.filter(e => e.subject === sub);
        return `
            <div class="card">
                <h3>${sub}</h3>
                <p><strong>Klausuren/Tests:</strong></p>
                <ul>
                    ${subExams.length > 0 ? subExams.map(e => `<li>${e.date}: ${e.topics.join(', ')}</li>`).join('') : '<li>Keine Termine eingetragen</li>'}
                </ul>
            </div>
        `;
    }).join('');

    const examsList = document.getElementById('exams-list-container');
    examsList.innerHTML = appData.exams.map(e => `
        <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
            <strong>${e.subject}</strong> (${e.date}) - ${e.topics.join(', ')}
        </div>
    `).join('');
}

function renderApplications() {
    const tbody = document.getElementById('applications-table-body');
    tbody.innerHTML = appData.applications.map((app, index) => `
        <tr>
            <td>${app.company}</td>
            <td>${app.role}</td>
            <td>${app.date}</td>
            <td><span class="badge">${app.status}</span></td>
            <td>${app.nextAction}</td>
            <td><button class="btn-secondary" onclick="deleteApp(${index})">Löschen</button></td>
        </tr>
    `).join('');

    document.getElementById('app-goal-text').innerText = `${appData.applications.length} von 5 Bewerbungen`;
    const pct = Math.min(100, (appData.applications.length / 5) * 100);
    document.getElementById('app-progress-fill').style.width = `${pct}%`;
}

function deleteApp(index) {
    appData.applications.splice(index, 1);
    saveData();
    renderApplications();
}

function renderFitness() {
    document.getElementById('pages-read-today').innerText = appData.reading.todayPages;
    document.getElementById('training-status-box').innerHTML = `
        <p>Trainingseinheiten diese Woche: <strong>${appData.training.countWeek} / 4</strong></p>
        <small>Sanftes Krafttraining / Spaziergänge (Schonung der Knie & Narkolepsie-freundlich).</small>
    `;
}

function renderProgress() {
    document.getElementById('weekly-review-box').innerHTML = `
        <p><strong>Coach-Auswertung:</strong> Du machst großartige Fortschritte am Abendgymnasium! Deine Biologie- und Englisch-Termine stehen im Fokus. Achte darauf, deine Energie gut einzuteilen und bei Müdigkeit den leichten Tagesplan zu nutzen.</p>
    `;
}

// Modals Steuerung
function initModals() {
    const modal = document.getElementById('task-modal');
    document.getElementById('open-task-modal').addEventListener('click', () => modal.style.display = 'flex');
    document.getElementById('close-task-modal').addEventListener('click', () => modal.style.display = 'none');

    document.getElementById('task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = {
            id: Date.now(),
            title: document.getElementById('task-title').value,
            category: document.getElementById('task-category').value,
            date: document.getElementById('task-date').value,
            priority: document.getElementById('task-priority').value,
            status: 'open'
        };
        appData.tasks.push(newTask);
        saveData();
        modal.style.display = 'none';
        document.getElementById('task-form').reset();
        renderAll();
    });

    // Lesefortschritt speichern
    document.getElementById('save-reading-btn').addEventListener('click', () => {
        const val = parseInt(document.getElementById('reading-input').value);
        if (!isNaN(val)) {
            appData.reading.todayPages = val;
            saveData();
            renderFitness();
            alert('Lesefortschritt gespeichert! 🍒');
        }
    });

    // Energie-Modus Umschalter
    document.getElementById('energy-toggle-btn').addEventListener('click', () => {
        appData.energyMode = appData.energyMode === 'normal' ? 'low' : 'normal';
        const label = document.getElementById('energy-label');
        if (appData.energyMode === 'low') {
            label.innerText = 'Reduzierte Energie (Schonung aktiv)';
            alert('Coach-Hinweis: Energie-Modus auf Schonung gestellt. Die Aufgaben wurden priorisiert.');
        } else {
            label.innerText = 'Normale Energie';
        }
        saveData();
    });

    // Leichter Plan Button
    document.getElementById('light-plan-btn').addEventListener('click', () => {
        alert('Leichter Plan aktiviert: Der Coach schlägt heute nur 1 wichtige Lernaufgabe und ausreichend Erholung vor.');
    });
}

// Lokaler Coach / Chatbot
function setupChat() {
    const sendBtn = document.getElementById('chat-send-btn');
    const input = document.getElementById('chat-input');
    const container = document.getElementById('chat-messages');

    sendBtn.addEventListener('click', handleChat);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    function handleChat() {
        const text = input.value.trim();
        if (!text) return;

        // User message
        container.innerHTML += `<div class="chat-msg user">${text}</div>`;
        input.value = '';

        setTimeout(() => {
            let reply = "Das habe ich verstanden. Ich kümmere mich darum!";
            const lower = text.toLowerCase();

            if (lower.includes('aufgabe') || lower.includes('füge')) {
                appData.tasks.push({ id: Date.now(), title: text, category: 'Persönlich', date: '2026-10-27', priority: 'Mittel', status: 'open' });
                saveData();
                reply = `Ich habe die Aufgabe "${text}" hinzugefügt! 🍒`;
            } else if (lower.includes('offen') || lower.includes('zeige')) {
                const openCount = appData.tasks.filter(t => t.status === 'open').length;
                reply = `Du hast aktuell ${openCount} offene Aufgaben.`;
            } else if (lower.includes('leichter plan') || lower.includes('müde')) {
                appData.energyMode = 'low';
                saveData();
                reply = `Ich habe den leichten Plan aktiviert. Gönn dir heute eine Pause und mach nur das Nötigste!`;
            }

            container.innerHTML += `<div class="chat-msg coach">${reply}</div>`;
            container.scrollTop = container.scrollHeight;
            renderAll();
        }, 500);
    }
}

// Daten Export & Import
function setupDataManagement() {
    document.getElementById('export-data-btn').addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "cherry_doll_backup.json");
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
    });

    document.getElementById('import-file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                appData = JSON.parse(evt.target.result);
                saveData();
                renderAll();
                alert('Daten erfolgreich wiederhergestellt! 🍒');
            } catch (err) {
                alert('Ungültige JSON-Datei.');
            }
        };
        reader.readAsText(file);
    });

    document.getElementById('reset-data-btn').addEventListener('click', () => {
        if (confirm('Möchtest du wirklich alle Daten zurücksetzen?')) {
            localStorage.removeItem('cherryDollData');
            location.reload();
        }
    });
}
