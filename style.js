const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Устанавливаем размер канваса
canvas.width = 800;
canvas.height = 400;

// Игровые переменные
let astronaut = {
    x: 50,
    y: canvas.height - 60,
    width: 40,
    height: 60,
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpHeight: 0,
    image: new Image()
};
astronaut.image.src = 'astronaut.png';  // Путь к изображению космонавта

// Фон
let backgroundImage = new Image();
backgroundImage.src = 'space-background.jpg';  // Путь к изображению фона (космос)

// Лунная поверхность (платформа)
let platformImage = new Image();
platformImage.src = 'moon-surface.png';  // Путь к изображению лунной поверхности

let obstacles = [];
let score = 0;
let gameOver = false;

// Изображения препятствий
let asteroidImage = new Image();
let alienImage = new Image();
asteroidImage.src = 'asteroid.png';  // Путь к изображению астероида
alienImage.src = 'alien.png';        // Путь к изображению инопланетянина

// Количество кликов
let clickCount = 0;

// Начальная скорость игры
let gameSpeed = 1;

// Управление через кнопки на экране
document.getElementById('upBtn').addEventListener('click', () => astronaut.dy = -astronaut.speed);
document.getElementById('downBtn').addEventListener('click', () => astronaut.dy = astronaut.speed);

// Функция для сброса направления
document.addEventListener('mouseup', () => astronaut.dy = 0);

// Обработчик кликов для прыжка
canvas.addEventListener('click', () => {
    clickCount++;
    if (clickCount == 1) {
        astronaut.dy = -7;  // Небольшой прыжок
        astronaut.jumpHeight = 100;  // Определяем высоту первого прыжка
    } else if (clickCount == 2) {
        astronaut.dy = -12;  // Большой прыжок
        astronaut.jumpHeight = 200;  // Высота второго прыжка
    }

    // Сброс счётчика кликов после 2-х
    if (clickCount > 2) {
        clickCount = 0;
    }
});

// Генерация препятствий
function generateObstacle() {
    const isAsteroid = Math.random() < 0.5;  // 50% шанс, что будет астероида или инопланетянин

    if (isAsteroid) {
        // Генерация астероидов, которые двигаются по диагонали
        obstacles.push({
            x: canvas.width,
            y: 0,
            width: 40,
            height: 60,
            speed: 6 * gameSpeed, // Скорость зависит от общей скорости игры
            type: 'asteroid',
            image: asteroidImage
        });
    } else {
        // Генерация инопланетян, которые двигаются сбоку
        obstacles.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 40), // Случайное положение по вертикали
            width: 40,
            height: 40,
            speed: 10 * gameSpeed, // Скорость зависит от общей скорости игры
            type: 'alien',
            image: alienImage
        });
    }
}

// Функция обновления состояния игры
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отображаем фон (космос)
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Отображаем лунную поверхность
    ctx.drawImage(platformImage, 0, canvas.height - 50, canvas.width, 50);  // Платформа внизу

    // Двигаем космонавта
    astronaut.y += astronaut.dy;
    astronaut.dy += astronaut.gravity;  // Применяем гравитацию

    // Ограничиваем движение по вертикали
    if (astronaut.y < 0) astronaut.y = 0;
    if (astronaut.y + astronaut.height > canvas.height - 50) {
        astronaut.y = canvas.height - 50 - astronaut.height;
        astronaut.dy = 0;  // Космонавт падает на платформу и останавливается
    }

    // Отображаем космонавта
    ctx.drawImage(astronaut.image, astronaut.x, astronaut.y, astronaut.width, astronaut.height);

    // Генерируем препятствия с уменьшенной вероятностью
    if (Math.random() < 0.006) {  // Вероятность появления астероида уменьшена в 3 раза
        generateObstacle();
    }

    // Обновляем препятствия
    obstacles.forEach((obstacle, index) => {
        // Метеориты двигаются по диагонали с верхнего правого угла в нижний левый угол
        if (obstacle.type === 'asteroid') {
            obstacle.x -= obstacle.speed;  // Астероид двигается влево
            obstacle.y += obstacle.speed;  // Астероид падает вниз
        } else if (obstacle.type === 'alien') {
            obstacle.x -= obstacle.speed;  // Инопланетянин движется сбоку
        }

        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Удаляем препятствия, которые вышли за пределы экрана
        if (obstacle.x + obstacle.width < 0 || obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score += 10;
        }

        // Проверка на столкновение с препятствием
        if (astronaut.x < obstacle.x + obstacle.width &&
            astronaut.x + astronaut.width > obstacle.x &&
            astronaut.y < obstacle.y + obstacle.height &&
            astronaut.y + astronaut.height > obstacle.y) {
            gameOver = true;
            alert("Game Over! Score: " + score);
            resetGame();
        }
    });

    // Отображаем счет
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    // Постепенно увеличиваем скорость игры
    if (gameSpeed < 2) { // Максимальная скорость игры
        gameSpeed += 0.0005;
    }

    requestAnimationFrame(updateGame);
}

// Функция сброса игры
function resetGame() {
    astronaut.y = canvas.height - 60;
    astronaut.dy = 0;
    obstacles = [];
    score = 0;
    gameOver = false;
    gameSpeed = 1;  // Сброс скорости игры
}

// Начало игры
updateGame();
