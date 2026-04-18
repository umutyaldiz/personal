const canvas = document.getElementById('pacman-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('pacman-score');
const highscoreEl = document.getElementById('pacman-highscore');
const startBtn = document.getElementById('start-pacman');
const startOverlay = document.getElementById('pacman-start-overlay');

const TILE_SIZE = 20;
const MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1],
    [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
    [1,1,1,1,2,1,0,1,1,0,1,1,0,1,2,1,1,1,1],
    [0,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
    [1,2,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,2,1],
    [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

canvas.width = MAP[0].length * TILE_SIZE;
canvas.height = MAP.length * TILE_SIZE;

let score = 0;
let highscore = localStorage.getItem('pacman-highscore') || 0;
highscoreEl.textContent = highscore;

let pacman = { x: 9, y: 16, dir: 0, nextDir: 0, mouth: 0, mouthSpeed: 0.1 };
let ghosts = [
    { x: 9, y: 8, color: '#FF0000', dir: 0 },
    { x: 9, y: 10, color: '#FFB8FF', dir: 2 },
    { x: 1, y: 1, color: '#00FFFF', dir: 1 },
    { x: 17, y: 1, color: '#FFB852', dir: 1 }
];

let pellets = [];
function initPellets() {
    pellets = [];
    for (let y = 0; y < MAP.length; y++) {
        for (let x = 0; x < MAP[y].length; x++) {
            if (MAP[y][x] === 2) pellets.push({ x, y });
        }
    }
}

let gameRunning = false;
let frameCount = 0;

function canMove(x, y, dir) {
    let nx = x, ny = y;
    if (dir === 0) nx++;
    else if (dir === 1) ny++;
    else if (dir === 2) nx--;
    else if (dir === 3) ny--;
    if (ny < 0 || ny >= MAP.length || nx < 0 || nx >= MAP[0].length) return false;
    return MAP[ny][nx] !== 1;
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < MAP.length; y++) {
        for (let x = 0; x < MAP[y].length; x++) {
            if (MAP[y][x] === 1) {
                ctx.fillStyle = '#2222FF';
                ctx.fillRect(x * TILE_SIZE + 1, y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
            }
        }
    }

    ctx.fillStyle = '#FFB8AE';
    pellets.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * TILE_SIZE + TILE_SIZE / 2, p.y * TILE_SIZE + TILE_SIZE / 2, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    let cx = pacman.x * TILE_SIZE + TILE_SIZE / 2;
    let cy = pacman.y * TILE_SIZE + TILE_SIZE / 2;
    let rotation = pacman.dir * Math.PI / 2;
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, TILE_SIZE / 2 - 2, (0.2 + pacman.mouth) * Math.PI + rotation, (1.8 - pacman.mouth) * Math.PI + rotation);
    ctx.fill();

    ghosts.forEach(g => {
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(g.x * TILE_SIZE + TILE_SIZE / 2, g.y * TILE_SIZE + TILE_SIZE / 3, TILE_SIZE / 2 - 2, Math.PI, 0);
        ctx.fillRect(g.x * TILE_SIZE + 2, g.y * TILE_SIZE + TILE_SIZE / 3, TILE_SIZE - 4, TILE_SIZE / 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.fillRect(g.x * TILE_SIZE + 5, g.y * TILE_SIZE + 5, 3, 3);
        ctx.fillRect(g.x * TILE_SIZE + 12, g.y * TILE_SIZE + 5, 3, 3);
    });
}

function gameOver(message) {
    gameRunning = false;
    startOverlay.classList.remove('hidden');
    alert(message);
    reset();
}

function update() {
    if (!gameRunning) return;
    if (frameCount % 12 === 0) {
        if (canMove(pacman.x, pacman.y, pacman.nextDir)) pacman.dir = pacman.nextDir;
        if (canMove(pacman.x, pacman.y, pacman.dir)) {
            if (pacman.dir === 0) pacman.x++;
            else if (pacman.dir === 1) pacman.y++;
            else if (pacman.dir === 2) pacman.x--;
            else if (pacman.dir === 3) pacman.y--;
        }

        // Check if Pacman moved into any ghost
        for (const g of ghosts) {
            if (g.x === pacman.x && g.y === pacman.y) {
                gameOver('Ghost caught you! Game Over.');
                return;
            }
        }

        let pIdx = pellets.findIndex(p => p.x === pacman.x && p.y === pacman.y);
        if (pIdx !== -1) {
            pellets.splice(pIdx, 1);
            score += 10;
            scoreEl.textContent = score;
            if (score > highscore) {
                highscore = score;
                highscoreEl.textContent = highscore;
                localStorage.setItem('pacman-highscore', highscore);
            }
        }

        for (const g of ghosts) {
            let options = [0, 1, 2, 3].filter(d => canMove(g.x, g.y, d));
            if (options.length > 0) {
                if (!options.includes(g.dir) || Math.random() < 0.25) {
                    g.dir = options[Math.floor(Math.random() * options.length)];
                }
                if (g.dir === 0) g.x++;
                else if (g.dir === 1) g.y++;
                else if (g.dir === 2) g.x--;
                else if (g.dir === 3) g.y--;
            }

            // Check if ghost moved into Pacman - simplified for exact tile overlap
            if (g.x === pacman.x && g.y === pacman.y) {
                gameOver('Ghost caught you! Game Over.');
                return;
            }
        }

        if (pellets.length === 0) {
            gameOver('Congratulations! You cleared the level.');
            return;
        }
    }
    pacman.mouth += pacman.mouthSpeed;
    if (pacman.mouth > 0.2 || pacman.mouth < 0) pacman.mouthSpeed *= -1;
    frameCount++;
}

function reset() {
    score = 0;
    scoreEl.textContent = 0;
    pacman = { x: 9, y: 16, dir: 0, nextDir: 0, mouth: 0, mouthSpeed: 0.1 };
    ghosts = [
        { x: 9, y: 8, color: '#FF0000', dir: 0 },
        { x: 9, y: 10, color: '#FFB8FF', dir: 2 },
        { x: 1, y: 1, color: '#00FFFF', dir: 1 },
        { x: 17, y: 1, color: '#FFB852', dir: 1 }
    ];
    initPellets();
}

window.addEventListener('keydown', e => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    if (e.key === 'ArrowRight') pacman.nextDir = 0;
    if (e.key === 'ArrowDown') pacman.nextDir = 1;
    if (e.key === 'ArrowLeft') pacman.nextDir = 2;
    if (e.key === 'ArrowUp') pacman.nextDir = 3;
});

startBtn.addEventListener('click', () => {
    startOverlay.classList.add('hidden');
    gameRunning = true;
    reset();
});

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
initPellets();
loop();