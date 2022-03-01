let elements = {

}

let gameState = {
    currentScore: 0,
    bossHealth: 100,
    gameStatus: 'not playing',
    dialogueCounter: 0,
    playerName: 'SNEK',
}

const dialogue = [
    'There is a monster below',
    'Only you can defeat it',
    'Will you help?',
    'Thank you great hero',
    'Who are you?',
    '<input type="textarea" placeholder="your name" id="nameInput" />',
    `Thank you ${gameState.playerName}!`,
    ];
const dialogueBtn = document.querySelector('.dialogueBtn');
const textArea = document.querySelector('.text');

const startBtn = document.querySelector('button');
const heroes = document.querySelector('.heroes');
const gameArea = document.querySelector('.gameArea');
const borders = document.querySelectorAll('.border');
const fires = document.querySelectorAll('.fire');
const snake = document.querySelector('.snake');
const FIRE_DELAY = 150;
const SNAKE_DELAY = 3000;
const BOSS_DELAY = 3000;
const HEIGHT = 300; // height of gameArea in px
const WIDTH = 600; // width of gameArea in px
const CELL_SIZE = 15; // hw of cell in px

// EVENT LISTENERS
startBtn.addEventListener('click', () => {
    createGameArea();
    goDown();
    enterSnake();
    enterBoss();
    setTimeout(() => {
        makeFire();
    }, SNAKE_DELAY + BOSS_DELAY);
})

dialogueBtn.addEventListener('click', () => {
    if (document.getElementById('nameInput')) {
        gameState.playerName = document.getElementById('nameInput').value
    }
    textArea.innerHTML = dialogue[gameState.dialogueCounter]
    gameState.dialogueCounter++;
})


// create gamearea
function createGameArea() {
    let rows = HEIGHT / CELL_SIZE;
    let columns = WIDTH / CELL_SIZE;
    
    for (let i = 0; i < rows; i++) {
        let row = document.createElement('tr')
        gameArea.appendChild(row);
        for (let j = 0; j < columns; j++) {
            let cell = document.createElement('td');
            cell.classList.add('cell')
            row.append(cell)
        }
    }
}

function makeFire() {
    for (let i = 0; i < fires.length; i++) {
        setTimeout(() => {
            fires[i].classList.add('on');
        }, i*FIRE_DELAY)
    }

    setTimeout(() => {
        borders[0].style.backgroundColor = 'brown';
        borders[1].style.backgroundColor = 'brown';
    }, 20*FIRE_DELAY)
}

function goDown() {
    heroes.classList.add('goDown');
}

function enterSnake() {
    snake.classList.add('slither');
}

function enterBoss() {

}