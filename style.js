const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ������������� ������ �������
canvas.width = 800;
canvas.height = 400;

// ������� ����������
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
astronaut.image.src = 'astronaut.png';  // ���� � ����������� ����������

// ���
let backgroundImage = new Image();
backgroundImage.src = 'space-background.jpg';  // ���� � ����������� ���� (������)

// ������ ����������� (���������)
let platformImage = new Image();
platformImage.src = 'moon-surface.png';  // ���� � ����������� ������ �����������

let obstacles = [];
let score = 0;
let gameOver = false;

// ����������� �����������
let asteroidImage = new Image();
let alienImage = new Image();
asteroidImage.src = 'asteroid.png';  // ���� � ����������� ���������
alienImage.src = 'alien.png';        // ���� � ����������� ��������������

// ���������� ������
let clickCount = 0;

// ��������� �������� ����
let gameSpeed = 1;

// ���������� ����� ������ �� ������
document.getElementById('upBtn').addEventListener('click', () => astronaut.dy = -astronaut.speed);
document.getElementById('downBtn').addEventListener('click', () => astronaut.dy = astronaut.speed);

// ������� ��� ������ �����������
document.addEventListener('mouseup', () => astronaut.dy = 0);

// ���������� ������ ��� ������
canvas.addEventListener('click', () => {
    clickCount++;
    if (clickCount == 1) {
        astronaut.dy = -7;  // ��������� ������
        astronaut.jumpHeight = 100;  // ���������� ������ ������� ������
    } else if (clickCount == 2) {
        astronaut.dy = -12;  // ������� ������
        astronaut.jumpHeight = 200;  // ������ ������� ������
    }

    // ����� �������� ������ ����� 2-�
    if (clickCount > 2) {
        clickCount = 0;
    }
});

// ��������� �����������
function generateObstacle() {
    const isAsteroid = Math.random() < 0.5;  // 50% ����, ��� ����� ��������� ��� �������������

    if (isAsteroid) {
        // ��������� ����������, ������� ��������� �� ���������
        obstacles.push({
            x: canvas.width,
            y: 0,
            width: 40,
            height: 40,
            speed: 3 * gameSpeed, // �������� ������� �� ����� �������� ����
            type: 'asteroid',
            image: asteroidImage
        });
    } else {
        // ��������� �����������, ������� ��������� �����
        obstacles.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 40), // ��������� ��������� �� ���������
            width: 40,
            height: 40,
            speed: 3 * gameSpeed, // �������� ������� �� ����� �������� ����
            type: 'alien',
            image: alienImage
        });
    }
}

// ������� ���������� ��������� ����
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ���������� ��� (������)
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // ���������� ������ �����������
    ctx.drawImage(platformImage, 0, canvas.height - 50, canvas.width, 50);  // ��������� �����

    // ������� ����������
    astronaut.y += astronaut.dy;
    astronaut.dy += astronaut.gravity;  // ��������� ����������

    // ������������ �������� �� ���������
    if (astronaut.y < 0) astronaut.y = 0;
    if (astronaut.y + astronaut.height > canvas.height - 50) {
        astronaut.y = canvas.height - 50 - astronaut.height;
        astronaut.dy = 0;  // ��������� ������ �� ��������� � ���������������
    }

    // ���������� ����������
    ctx.drawImage(astronaut.image, astronaut.x, astronaut.y, astronaut.width, astronaut.height);

    // ���������� ����������� � ����������� ������������
    if (Math.random() < 0.006) {  // ����������� ��������� ��������� ��������� � 3 ����
        generateObstacle();
    }

    // ��������� �����������
    obstacles.forEach((obstacle, index) => {
        // ��������� ��������� �� ��������� � �������� ������� ���� � ������ ����� ����
        if (obstacle.type === 'asteroid') {
            obstacle.x -= obstacle.speed;  // �������� ��������� �����
            obstacle.y += obstacle.speed;  // �������� ������ ����
        } else if (obstacle.type === 'alien') {
            obstacle.x -= obstacle.speed;  // ������������� �������� �����
        }

        ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // ������� �����������, ������� ����� �� ������� ������
        if (obstacle.x + obstacle.width < 0 || obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score += 10;
        }

        // �������� �� ������������ � ������������
        if (astronaut.x < obstacle.x + obstacle.width &&
            astronaut.x + astronaut.width > obstacle.x &&
            astronaut.y < obstacle.y + obstacle.height &&
            astronaut.y + astronaut.height > obstacle.y) {
            gameOver = true;
            alert("Game Over! Score: " + score);
            resetGame();
        }
    });

    // ���������� ����
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    // ���������� ����������� �������� ����
    if (gameSpeed < 2) { // ������������ �������� ����
        gameSpeed += 0.0005;
    }

    requestAnimationFrame(updateGame);
}

// ������� ������ ����
function resetGame() {
    astronaut.y = canvas.height - 60;
    astronaut.dy = 0;
    obstacles = [];
    score = 0;
    gameOver = false;
    gameSpeed = 1;  // ����� �������� ����
}

// ������ ����
updateGame();