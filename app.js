
let elements = {
    
}

let gameState = {
    currentScore: 0,
    bossHealth: 100,
    gameStatus: 'not playing',
    isPaused: true,
    dialogueCounter: 0,
}

let player = {
    name: 'Snek',
    body: [[10, 0]],
    direction: 'right',
    getHead: function() {
        return this.body[this.body.length - 1]
    },
    getTail: function() {
        return this.body[0]
    },
    getName: function() {
        return this.name;
    },
}

const dialogue = [
    'There is a monster below!!',
    'Only you can defeat it!',
    'Will you help?',
    'Thank you, great hero!',
    'Who are you?',
    '<input type="textarea" placeholder="your name" id="nameInput" />',
    'That\'s a silly name for a snake',
    'ADVANCE',
    'Hello hero, I am the magician Neely',
    'By now you must know how monsters work',
    'They can be killed by energy',
    'Collect purple orbs to release your energy',
    'The more energy you have, the more damage done',
    'Say, what\'s your name anyway?',
    `${player.getName}? What a silly name...`,
    'ADVANCE',
];

// FIRST OF ALL
const HEIGHT = 300; // height of gameArea in px
const WIDTH = 600; // width of gameArea in px
const CELL_SIZE = 15; // hw of cell in px
const gameArea = document.querySelector('.gameArea');
createGameArea(); // NOTE: this is a 20row by 40column board!!

const dialogueBtn = document.querySelector('.dialogueBtn');
const textArea = document.querySelector('.text');

const startBtn = document.querySelector('button');
const heroes = document.querySelector('.heroes');
const gameGrid = document.querySelectorAll('tr');
const borders = document.querySelectorAll('.border');
const columns = document.querySelectorAll('.column');
const fires = document.querySelectorAll('.fire');
const snake = document.querySelector('.snake');
const boss = document.querySelector('.boss');
const FIRE_DELAY = 150;
const ALL_FIRE_DELAY = 150 * 20;
const SNAKE_DELAY = 3000;
const BOSS_DELAY = 5000;
const TICK_SPEED = 1000;

// THE ALMIGHTY TICK
tick();

function tick() {
    setInterval(() => {
        if (gameState.isPaused) {
            return;
        }
        movePlayer(); // will call updateGameArea()
        // checkCollision();


    }, TICK_SPEED);
};

// EVENT LISTENERS
startBtn.addEventListener('click', () => {
    startGame();
})

dialogueBtn.addEventListener('click', () => {
    if (document.getElementById('nameInput')) {
        player.name = document.getElementById('nameInput').value
    }
    if (dialogue[gameState.dialogueCounter] === 'ADVANCE') {
        gameState.dialogueCounter++;
        startGame();
    } else {
        textArea.innerHTML = dialogue[gameState.dialogueCounter]
        gameState.dialogueCounter++;
    }
})

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case ('s' || 'ArrowDown'):
            player.direction = 'down';
            break;
        case ('w' || 'ArrowUp'):
            player.direction = 'up';
            break;
        case ('a' || 'ArrowLeft'):
            player.direction = 'left';
            break;
        case ('d' || 'ArrowRight'):
            player.direction = 'right';
            break;
    }
})

function startGame() {
    gameState.gameStatus = 'playing';
    goDown();
    enterSnake();
    enterBoss();
    setTimeout(() => {
        makeFire();
    }, BOSS_DELAY);
    setTimeout(() => {
        togglePause();
    }, BOSS_DELAY + ALL_FIRE_DELAY);
    setTimeout(() => {
        snake.remove();
    }, BOSS_DELAY + ALL_FIRE_DELAY + TICK_SPEED)
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

// PLAY LOGIC
function movePlayer() {
    let oldHead = player.getHead(); 
    let headRow = oldHead[0];
    let headCol = oldHead[1];
    let newHead, shifted = [];
    switch (player.direction) {
        case 'right':
            newHead = [headRow, headCol + 1]; 
            player.body.push(newHead)
            shifted = player.body.shift();
            break;
        case 'left':
            newHead = [headRow, headCol - 1]; 
            player.body.push(newHead)
            shifted = player.body.shift();
            break;
        case 'up':
            newHead = [headRow - 1, headCol]; 
            player.body.push(newHead)
            shifted = player.body.shift();
            break;
        case 'down':
            newHead = [headRow + 1, headCol]; 
            player.body.push(newHead)
            shifted = player.body.shift();
            break;
    }
    
    updateGameArea(newHead, oldHead, shifted);
    return;
}

function updateGameArea(newHead, oldHead, lostTail) {
    let add = gameGrid[newHead[0]].cells[newHead[1]]
    let remove = gameGrid[lostTail[0]].cells[lostTail[1]];
    let change = gameGrid[oldHead[0]].cells[oldHead[1]];
    
    // add newHead
    add.classList.toggle('head');

    // switch oldHead to body
    if (player.body.length !== 1) {
    change.classList.toggle('head');
    change.classList.toggle('body');
    }

    // remove tail
    if (remove.classList.contains('head')) {
        remove.classList.toggle('head');
    } else if (remove.classList.contains('body')) {
        remove.classList.toggle('body');
    }
    
}

function togglePause() {
    if (gameState.isPaused) {
        gameState.isPaused = false;
        return;
    }
    gameState.isPaused = true;
    return;
}