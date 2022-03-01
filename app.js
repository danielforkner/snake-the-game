const btn = document.querySelector('button');
const gameArea = document.querySelector('.gameArea');
const borders = document.querySelectorAll('.border');
const fires = document.querySelectorAll('.fire');
const FIRE_DELAY = 150;
const HEIGHT = 300; // height of gameArea in px
const WIDTH = 600; // width of gameArea in px
const CELL_SIZE = 15; // hw of cell in px

let gameState = {
    currentScore: 0,
    bossHealth: 100,
    gameStatus: 'not playing',
}

btn.addEventListener('click', () => {
    // slitherIn(); add the .slither class. Then have the top image slide in for text.
    createGameArea();
    makeFire();
})

// createGameArea();

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
