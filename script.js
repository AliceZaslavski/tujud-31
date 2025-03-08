const moodsData = {
    "Tänulik": "#ffffcc",
    "Üksildane": "#e6ffff",
    "Segaduses": "#ecc6d9",
    "Innustunud": "#ccffcc",
    "Ärev": "#f2ccff",
    "Rahulik": "#ffcccc",
    "Vihane": "#ff0000",
    "Kurb": "#ccf2ff",
    "Rõõmus": "#ffe6f9",
    "Mäh": "#ffcc99"
};

let selectedDate = null;

function generateMoodButtons() {
    const container = document.getElementById('mood-buttons');
    container.innerHTML = "";

    Object.keys(moodsData).forEach(mood => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('mood-wrapper');

        const button = document.createElement('button');
        button.classList.add('mood-button');
        button.textContent = mood;
        button.style.backgroundColor = moodsData[mood];

        const select = document.createElement('select');
        for (let i = 0; i <= 100; i += 10) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}%`;
            select.appendChild(option);
        }

        const colorPicker = document.createElement('input');
        colorPicker.type = "color";
        colorPicker.value = moodsData[mood] || "#ffffff";

        colorPicker.addEventListener('input', () => {
            button.style.backgroundColor = colorPicker.value;
        });

        button.addEventListener("click", () => {
            button.textContent = prompt("Sisesta uus tuju:", button.textContent) || button.textContent;
        });

        wrapper.appendChild(button);
        wrapper.appendChild(select);
        wrapper.appendChild(colorPicker);
        container.appendChild(wrapper);
    });
}

function saveMood() {
    if (!selectedDate) {
        alert("Palun vali kuupäev kalendrist!");
        return;
    }

    const selectedMoods = [];
    document.querySelectorAll('.mood-wrapper').forEach(wrapper => {
        const mood = wrapper.querySelector('button').textContent;
        const percentage = wrapper.querySelector('select').value;
        const color = wrapper.querySelector('input').value;

        if (parseInt(percentage) > 0) {
            selectedMoods.push({ mood, percentage: parseInt(percentage), color });
        }
    });

    localStorage.setItem(selectedDate, JSON.stringify(selectedMoods));
    renderCalendar();
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const date = `${i.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
        const moods = JSON.parse(localStorage.getItem(date)) || [];

        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = i;

        dayDiv.addEventListener("click", () => {
            selectedDate = date;
            document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
            dayDiv.classList.add('selected');
        });

        if (moods.length > 0) {
            dayDiv.style.background = createGradientBackground(moods);
        }

        calendar.appendChild(dayDiv);
    }
}

/**
 * 🖌 **Täiustatud gradienti loogika** - toetab nüüd piiramatu arvu värve korrektselt!
 */
function createGradientBackground(moods) {
    if (moods.length === 1 && moods[0].percentage === 100) {
        return moods[0].color; // Kui ainult üks tuju, siis täisvärv
    }

    moods.sort((a, b) => b.percentage - a.percentage); // Suurima protsendi järgi sorteerimine

    let gradientStops = [];
    let totalPercentage = 0;

    moods.forEach((mood) => {
        totalPercentage += mood.percentage;
        if (totalPercentage > 100) totalPercentage = 100; // Kui üle 100%, piirame ära
        gradientStops.push(`${mood.color} ${totalPercentage}%`);
    });

    return `linear-gradient(to bottom right, ${gradientStops.join(', ')})`;
}

document.addEventListener("DOMContentLoaded", () => {
    generateMoodButtons();
    renderCalendar();
    document.getElementById('save-btn').addEventListener("click", saveMood);
});
