const gameArea = document.querySelector('.gameArea');
const HEIGHT = 10;
const WIDTH = 100;

// createGameArea();

// create gamearea
function createGameArea() {
    for (let i = 0; i < HEIGHT; i++) {
        let row = document.createElement('tr')
        gameArea.appendChild(row);
        for (let j = 0; j < WIDTH; j++) {
            let cell = document.createElement('td');
            cell.classList.add()
            row.append(cell)
        }
    }
}
