const hero = document.querySelector('.hero');
const playArea = document.querySelector('main');

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
        createEnemy();
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
    const positionY = Math.floor( Math.random() * 540 );
    return positionY;
}


// Add handlers do Game
document.body.addEventListener('keydown', flyShip);