const hero = document.querySelector('.hero');
const playArea = document.querySelector('main');
const gameInstructions = document.querySelector('.game-instructions');
const startButton = document.querySelector('#start-button');
let gameLoopInterval;

// Voando com a nave
function flyShip(event) {
    if (event.key == 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if (event.key == 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if (event.key == ' ') {
        event.preventDefault()
        fireLaser();
    }
}

// Função de subir
function moveUp() {
    // Obtém o valor de uma propriedade CSS dinamicamente
    let topPosition = getComputedStyle(hero).getPropertyValue('top');
    if (topPosition == '0px') {
        return;
    } else {
        let position = parseInt(topPosition);
        position -= 50;
        hero.style.top = position + 'px';
    }
}

// Função de descer
function moveDown() {
    // Obtém o valor de uma propriedade CSS dinamicamente
    let topPosition = getComputedStyle(hero).getPropertyValue('top');
    if (topPosition >= '540px') {
        return;
    } else {
        let position = parseInt(topPosition);
        position += 50;
        hero.style.top = position + 'px';
    }
}

// Função de atirar
function fireLaser() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

// cria o laser na tela
function createLaserElement() {
    let positionX = parseInt(window.getComputedStyle(hero).getPropertyValue('left'));
    let positionY = parseInt(window.getComputedStyle(hero).getPropertyValue('top'));
    let laser = document.createElement('img');
    laser.src = 'assets/images/shoot.png';
    laser.classList.add('laser');
    laser.style.left = positionX + 'px';
    laser.style.top = (positionY - 10) + 'px';
    return laser;
}

// movimenta o laser 
function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let positionX = parseInt(laser.style.left);
        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach((enemy) => {
            if (checkLaserCollision(laser, enemy)) {
                enemy.src = 'assets/images/explosion.png';
                enemy.classList.remove('enemy');
                enemy.classList.add('dead-enemy');
            }
        });

        if (positionX >= 340) {
            laser.remove();
            clearInterval(laserInterval);
        } else {
            laser.style.left = (positionX + 8) + 'px';
        }
    }, 10);
}

// criando inimigos
function createEnemy() {
    const enemyImgSrc = shuffleEnemyImg();
    const enemy = document.createElement('img');
    const enemyPosition = shuffleEnemyPosition();
    enemy.src = enemyImgSrc;
    enemy.style.top = enemyPosition + 'px';
    enemy.classList.add('enemy');
    enemy.classList.add('enemy-transition');
    playArea.appendChild(enemy);
    moveEnemy(enemy);
}

// Sorteia imagem do inimigo
function shuffleEnemyImg() {
    const enamies = ['assets/images/monster-1.png', 'assets/images/monster-2.png', 'assets/images/monster-3.png'];
    const shuffle = Math.floor(Math.random() * 3);
    return enamies[shuffle];
}

// Sorteia position do inimigo
function shuffleEnemyPosition() {
    const positionY = Math.floor(Math.random() * 540);
    return positionY;
}

// Função para movimentar inimigos
function moveEnemy(enemy) {
    let moveEnemyInterval = setInterval(() => {
        let positionX = parseInt(window.getComputedStyle(enemy).getPropertyValue('left'));
        if (positionX <= 10) {
            // Seinimigo chegar a menos de 50px sem a classe de morto, então perdemos
            if (Array.from(enemy.classList).includes('dead-enemy')) {
                enemy.remove();
                clearInterval(moveEnemyInterval);
            } else {
                // game over
                clearInterval(gameLoopInterval);
            }
        } else {
            enemy.style.left = (positionX - 4) + 'px';
        }
    }, 30);
}

// Função para tratar colisão
function checkLaserCollision(laser, enemy) {
    const laserLeft = parseInt(laser.style.left);
    const laserTop = parseInt(laser.style.top);
    const laserBottom = laserTop - 20;

    const enemyLeft = parseInt(enemy.style.left);
    const enemyTop = parseInt(enemy.style.top);
    const enemyBottom = enemyTop - 20;

    if (laserLeft != 340 && laserLeft + 40 >= enemyLeft) {
        if (laserTop <= enemyTop && laserTop >= enemyBottom) {
            return true;
        }
    }
    return false;
}


// Start Game e loop
function playGame() {
    startButton.style.display = 'none';
    gameInstructions.style.display = 'none';

    // Add handlers do Game
    document.body.addEventListener('keydown', flyShip);
    gameLoop();
}

// Loop do Game
function gameLoop() {
    const ramdomCreateEnemy = Math.floor((Math.random() * 3) + 2) * 1000;
    let gameLoopInterval = setInterval(() => {
        createEnemy();
    }, ramdomCreateEnemy);
}

// Função de Game Over
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(gameLoopInterval);
    // Remove enemies
    document.querySelectorAll('.enemy')
        .forEach((enemy) => enemy.remove());
    // Remove lasers
    document.querySelectorAll('.laser')
        .forEach((laser) => laser.remove());

    setTimeout(() => {
        window.alert('Game Over!!');
        hero.style.top = '250px';
        gameInstructions.style.display = 'block';
        startButton.style.display = 'block';
    }, 100);
}

// Adiciona Start Game ao Botão
startButton.addEventListener('click', playGame);