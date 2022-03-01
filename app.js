let elements = {

}

let gameState = {
    currentScore: 0,
    bossHealth: 100,
    gameStatus: 'not playing',
    dialogueCounter: 0,
    playerName: 'SNEK',
    getName: function() {
        return this.playerName;
    }
}

const dialogue = [
    'There is a monster below!!',
    'Only you can defeat it!',
    'Will you help?',
    'Thank you, great hero!',
    'Who are you?',
    '<input type="textarea" placeholder="your name" id="nameInput" />',
    'That\'s a silly name for a snake',
    'ADVANCE'
    ];

const dialogueBtn = document.querySelector('.dialogueBtn');
const textArea = document.querySelector('.text');

const startBtn = document.querySelector('button');
const heroes = document.querySelector('.heroes');
const gameArea = document.querySelector('.gameArea');
const borders = document.querySelectorAll('.border');
const columns = document.querySelectorAll('.column');
const fires = document.querySelectorAll('.fire');
const snake = document.querySelector('.snake');
const boss = document.querySelector('.boss');
const FIRE_DELAY = 150;
const SNAKE_DELAY = 3000;
const BOSS_DELAY = 5000;
const HEIGHT = 300; // height of gameArea in px
const WIDTH = 600; // width of gameArea in px
const CELL_SIZE = 15; // hw of cell in px

// EVENT LISTENERS
startBtn.addEventListener('click', () => {
    startGame();
})

dialogueBtn.addEventListener('click', () => {
    if (document.getElementById('nameInput')) {
        gameState.playerName = document.getElementById('nameInput').value
    }
    if (dialogue[gameState.dialogueCounter] === 'ADVANCE') {
        gameState.dialogueCounter++;
        startGame();
    } else {
        textArea.innerHTML = dialogue[gameState.dialogueCounter]
        gameState.dialogueCounter++;
    }
})

function startGame() {
    gameState.gameStatus = 'playing';
    createGameArea();
    goDown();
    enterSnake();
    enterBoss();
    setTimeout(() => {
        makeFire();
    }, BOSS_DELAY);
}

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
        columns[0].style.borderRight = '1px solid brown';
        columns[1].style.borderLeft = '1px solid brown';
    }, 20*FIRE_DELAY)
}

function goDown() {
    heroes.classList.add('goDown');
}

function enterSnake() {
    snake.classList.add('slither');
}

function enterBoss() {
    boss.classList.add('enterBoss');
}