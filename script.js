// TIMER
const timer = document.getElementById("timer");
const weddingDate = new Date("2026-06-27T00:00:00");

function updateTimer() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        timer.textContent = "Сегодня наш день ❤️";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60) % 24);
    const minutes = Math.floor(diff / (1000 * 60) % 60);

    timer.textContent = `${days} дней ${hours} часов ${minutes} минут`;
}

setInterval(updateTimer, 60000);
updateTimer();

// SCROLL ANIMATIONS
const animated = document.querySelectorAll('.animate, .doodle');

function reveal() {
    animated.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal();

// ===== SMART CHECKBOX LOGIC =====
function setupExclusiveOption(groupName, exclusiveValue) {
    const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);

    checkboxes.forEach(box => {
        box.addEventListener("change", () => {
            // Если выбрали "Без предпочтений" или "Не употребляю", снимаем другие варианты
            if (box.value === exclusiveValue && box.checked) {
                checkboxes.forEach(other => {
                    if (other !== box) other.checked = false;
                });
            }

            // Если выбрали что-то другое, снимаем "Без предпочтений" или "Не употребляю"
            if (box.value !== exclusiveValue && box.checked) {
                checkboxes.forEach(other => {
                    if (other.value === exclusiveValue) {
                        other.checked = false;
                    }
                });
            }
        });
    });
}

// Для еды — если выбирают что-то кроме "Без предпочтений", снимать "Без предпочтений"
setupExclusiveOption("food", "no");

// Для алкоголя — если выбирают что-то кроме "Не употребляю", снимать "Не употребляю"
setupExclusiveOption("alcohol", "no");

// Отправка данных в Telegram
function sendToTelegram(data) {
    const token = '8032433224:AAGA3qLyjulEe5IEwoxLD-TjZmw3ue4eAag'; // Ваш токен от @BotFather
    const chatId = '491633740'; // Ваш Telegram ID

    const message = `
        Новая анкета:
        
        Имя: ${data.name}
        Фамилия: ${data.surname}
        Присутствие: ${data.attendance}
        Предпочтения в еде: ${data.food}
        Предпочтения в алкоголе: ${data.alcohol}
    `;

    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Message sent', data);
        })
        .catch(error => {
            console.error('Error sending message to Telegram:', error);
        });
}

// Слушаем отправку формы
const form = document.getElementById('guestForm');
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const surname = form.surname.value.trim();  // Получаем фамилию
    const attendance = form.attendance.value;
    const food = Array.from(form.querySelectorAll('input[name="food"]:checked')).map(input => input.value).join(', ');
    const alcohol = Array.from(form.querySelectorAll('input[name="alcohol"]:checked')).map(input => input.value).join(', ');

    if (!name || !surname || !attendance || food.length === 0 || alcohol.length === 0) {  // Проверяем фамилию
        alert("Пожалуйста, заполните все поля анкеты 💕");
        return;
    }

    // Отправляем данные в Telegram
    sendToTelegram({ name, surname, attendance, food, alcohol });

    // Скрываем форму и показываем сообщение благодарности
    form.style.display = "none";
    document.getElementById("thankYou").classList.remove("hidden");
});

