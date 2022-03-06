

// TABLE OF CONTENTS (not current)
// 1. objects and dialogue
// 2. global variables
// 3. tick
// 4. event listeners
// 5. create game initial state
// 6. play logic
// 7. boss logic

// OBJECTS AND DIALOGUE
const gameState = {
    currentBoss: 1,
    bossHealth: 100,
    isPaused: true,
    hasLost: false,
    score: 0,
    level: 1,
    dialogueCounter: 0,
    apple: [6, 5],
    weapon: [5, 2],
    buff: [],
    buffName: null,
    weaponCounter: 30,
    appleCounter: 30,
    enterClicked: false,
};

let player = {
    name: 'Snek',
    body: [[08, -1]],
    direction: 'right',
    hasApple: false,
    hasWeapon: true,
    getLength: function() {
        return this.body.length;
    },
    getHead: function() {
        return this.body[this.getLength() - 1]
    },
    getNeck: function() {
        return this.body[this.getLength() - 2]
    },
    getTail: function() {
        return this.body[0]
    },
    getName: function() {
        return this.name;
    },
}

let collisionClasses = ['head', 'body', 'apple', 'weapon', 'buff'];

let buffs = {
    damageMultiplyer: {
        className: 'buffDmg',
        consume: function() {
            dmg_muliplyer *= 2;
            let display = document.createElement('p');
            display.id = 'buffDmg';
            buffDisplay.append(display);
            display.innerHTML = `DAMAGE x${dmg_muliplyer}`;
            setTimeout(() => {
                dmg_muliplyer /= 2;
                display.remove();
            }, buff_duration)
        },
    },
    slowTime: {
        className: 'slowTime',
        consume: function() {
            clearInterval(intervalID);
            tick_speed *= 2;
            let display = document.createElement('p');
            display.id = 'slowTime';
            buffDisplay.append(display);
            display.innerHTML = `SLOW TIME`;
            tick.startTick();
            setTimeout(() => {
                tick_speed /= 2;
                display.remove();
                clearInterval(intervalID);
                tick.startTick();
            }, buff_duration)
        },
    }
}

let bosses = {
    boss1: {
        startHealth: 100,
        health: 100,
        src: './images/boss1.gif',
        hitAnimationSRC: './images/boss1_hit.gif',
    },
    boss2: {
        startHealth: 200,
        health: 200,
        src: './images/boss2.gif',
        hitAnimationSRC: './images/boss2_hit.gif',
        spells: {
            list: ['spellOfMinion'],
            spellOfMinion: function() {
                let img = document.getElementById('bossImg');
                img.src = './images/boss2spell.png'
                setTimeout(() => {
                    img.src = './images/boss2.gif'
                }, 2000)
            }
        }
    },
    boss3: {
        startHealth: 1000,
        health: 1000,
        isTransformed: false,
        hitAnimationSRC: './images/boss3_hit.gif',
        src: './images/boss3.gif',
        spells: {
            list: ['spellOfMinion', 'spellOfTime'],
            spellOfTime: function() {
                tick_speed *= 1.25;
                let img = document.getElementById('bossImg');
                img.src = './images/boss3spell.png'
                setTimeout(() => {
                    if (bosses.boss3.isTransformed) {
                        img.src = './images/boss3transform.gif'
                    } else {
                        img.src = './images/boss3.gif'
                    }
                }, 2000)
            },
            spellOfTransform: function() {
                spell_interval = 20;
                this.isTransformed = true;
                let img = document.getElementById('bossImg');
                img.src = './images/boss3transform.gif';
            },
            spellOfMinion: function() {
                let img = document.getElementById('bossImg');
                img.src = './images/boss3spell.png'
                setTimeout(() => {
                    if (bosses.boss3.isTransformed) {
                        img.src = './images/boss3transform.gif'
                    } else {
                        img.src = './images/boss3.gif'
                    }
                }, 2000)
            }
        },
    },
    getLength: function() {
        return Object.keys(this).length;
    }
}

let characters = {
    friend1: {
        src: './images/friend1.png',
    },
    friend2: {
        src: './images/friend2.png',
        leave: './images/friend2.gif',
    },
}

const dialogue = [
    'Snake, I need your help!',
    'There is a monster below!',
    'Please defeat it!',
    'Thank you! What\'s your name hero?',
    '<input type="textarea" placeholder="your name" id="nameInput" />',
    'That\'s a silly name for a snake',
    'ADVANCE',
    'Hello, I am the magician Neely',
    'You really did a number on that boss!',
    'By now you must know how monsters work',
    'They can be killed by energy',
    'Collect energy to store it',
    'Use magic staffs to release energy',
    'The more energy you have, the more damage dealt',
    'Say, what\'s your name anyway?',
    `${player.getName()}? What a silly name...`,
    'Well, I really must be going...',
    'NEELY GOES AWAY',
    '...',
    'ADVANCE',
    'Oh you\'re still alive?',
    'err... I mean good to see you buddy!',
    'This next boss is very powerful',
    'Good luck',
    'By the way have you seen my friend Neely anywhere?',
    'ADVANCE',
    'I can\'t believe it',
    'Snakes really can be heroes',
    'ADVANCE',
];

// GLOBAL VARIABLES
const HEIGHT = 300; // height of gameArea in px
const WIDTH = 600; // width of gameArea in px
const TOTAL_CELLS = 450;
const CELL_SIZE = Math.sqrt(HEIGHT * WIDTH / TOTAL_CELLS);
const ROWS = HEIGHT / CELL_SIZE;
const COLS = WIDTH / CELL_SIZE;
const gameArea = document.querySelector('.gameArea');
createGameArea(); // rows and cols calculated based on h x w and cellsize. adjust accordingly.

const up = document.getElementById('up');
const down = document.getElementById('down');
const left = document.getElementById('left');
const right = document.getElementById('right');
const enterBtn = document.getElementById('enter');
const title = document.querySelector('.titleContainer');
const dialogueBtn = document.querySelector('.dialogueBtn');
const textArea = document.querySelector('.text');
const skipBtn = document.querySelector('.skip');
const level2 = document.querySelector('.level2')
const level3 = document.querySelector('.level3')
const dialogueArea = document.querySelector('.heroes');
const dialogueText = document.querySelector('.dialogue');
const friend = document.querySelector('.hero.left');
const hero = document.querySelector('.hero.right');
const gameGrid = document.querySelectorAll('tr');
const borders = document.querySelectorAll('.border');
const columns = document.querySelectorAll('.column');
const fires = document.querySelectorAll('.fire');
const snake = document.querySelector('.snake');
const boss = document.querySelector('.boss');
const bossHealth = document.querySelector('.bar');
const hitAnimation = document.querySelector('.hitAnimation');
const loseContainer = document.querySelector('.loseContainer');
const loseText = document.querySelector('.loseText');
const FIRE_DELAY = 30;
const ALL_FIRE_DELAY = FIRE_DELAY * 20;
const SNAKE_DELAY = 3000;
const BOSS_DELAY = 5000;
var dmg_muliplyer = 1;
var tick_speed = 150;
var second = 0;
var buff_interval = 10;
var spell_interval = 30;
var buff_duration = 5000;
const buffDisplay = document.querySelector('.buffDisplay');
let intervalID;

// THE ALMIGHTY TICK
const tick = {
    // count seconds 60 at a time
    startCounter: function() {
        setInterval(() => {
            if (!gameState.isPaused) {
                if (second % buff_interval === 0) {
                    createBuff();
                    placeBuff();
                }
                if (second % spell_interval === 0 && gameState.level > 1) {
                    castSpell();
                }
            }
            second++
            if (second === 60) {
                second = 0;
            }
        }, 1000)
    },
    startTick: function() {
        intervalID = setInterval(() => {
            if (gameState.hasLost) {
                gameState.hasLost = false;
                youLose();
                return;
            }
            if (gameState.isPaused) {
                return;
            }
            // move to a createWeapon function
            gameState.appleCounter--;
            // move to a checkBoss function
            if (gameState.bossHealth <= 0) {
                gameState.isPaused = true;
                gameState.level++;
                gameState.currentBoss++;
                killBoss(BOSS_DELAY);
                // if (gameState.currentBoss === bosses.getLength()) {
                //     youWin();
                //     return;
                // }
                this.resetBoard();
                return;
            }
                // move to a checkWin function
            movePlayer();
        }, tick_speed);
    },
    startLevel: function() {
        player.direction = 'right';
        toggleDialogue();
        enterSnake();
        enterBoss();
        skipBtn.style.display = 'none';
        setTimeout(() => {
            toggleFire(FIRE_DELAY);
        }, BOSS_DELAY);
        setTimeout(() => {
            togglePause();
        }, BOSS_DELAY + ALL_FIRE_DELAY);
        setTimeout(() => {
            snake.style.display = 'none';
            gameGrid[08].cells[0].classList.add('head');
            placeApple();
            gameState.isPaused = false;
        }, BOSS_DELAY + ALL_FIRE_DELAY + tick_speed)
        if (level2) level2.remove();
        if (level3) level3.remove();
    },
    resetBoard: function() {
        player.hasWeapon = true;
        wipeBoard();
        toggleFire(FIRE_DELAY * 8);
        toggleDialogue();
    },
};

// EVENT LISTENERS
enterBtn.addEventListener('click', (e) => {
    if (gameState.enterClicked) return;
    gameState.enterClicked = true;
    title.classList.add('fadeOut');
    toggleDialogue();
    setTimeout(() => {
        title.style.display = 'none';
    }, 3000)
})

skipBtn.addEventListener('click', () => {
    tick.startLevel();
    skipBtn.style.display = 'none';
})

level2.addEventListener('click', () => {
    level2.remove();
    level3.remove();
    skipBtn.style.display = 'none';
    gameState.level = 2;
    gameState.currentBoss = 2;
    tick.startLevel();
})

level3.addEventListener('click', () => {
    level2.remove();
    level3.remove();
    skipBtn.style.display = 'none';
    gameState.level = 3;
    gameState.currentBoss = 3;
    tick.startLevel();
})

dialogueBtn.addEventListener('click', () => {
    if (document.getElementById('nameInput')) {
        player.name = document.getElementById('nameInput').value
    }
    if (dialogue[gameState.dialogueCounter] === 'ADVANCE') {
        if (gameState.level === bosses.getLength()) {
            youWin();
            return;
        }
        gameState.dialogueCounter++;
        tick.startLevel();
        setTimeout(() => {
            textArea.innerHTML = dialogue[gameState.dialogueCounter];
        }, 3000);
    } else if (dialogue[gameState.dialogueCounter] === 'NEELY GOES AWAY') {
        let neely = document.getElementById('friendImg');
        neely.src = characters.friend2.leave;
        gameState.dialogueCounter++;
    } else {
        textArea.innerHTML = dialogue[gameState.dialogueCounter]
        gameState.dialogueCounter++;
    }
})

window.addEventListener('keydown', (e) => {
    if (gameState.isPaused) return;
    switch (e.key) {
        case 'ArrowDown':
        case 's':
            player.direction = 'down';
            break;
        case 'w': 
        case 'ArrowUp':
            player.direction = 'up';
            break;
        case 'a':
        case 'ArrowLeft':
            player.direction = 'left';
            break;
        case 'd':
        case 'ArrowRight':
            player.direction = 'right';
            break;
    }
})

up.addEventListener('click', (e) => {
    if (gameState.isPaused) {
        return
    };
    player.direction = 'up';
})
down.addEventListener('click', (e) => {
    if (gameState.isPaused) {
        return
    };
    player.direction = 'down';
})
left.addEventListener('click', (e) => {
    if (gameState.isPaused) {
        return
    };
    player.direction = 'left';
})
right.addEventListener('click', (e) => {
    if (gameState.isPaused) {
        return
    };
    player.direction = 'right';
})

// CREATE GAME
function createGameArea() {
    for (let i = 0; i < ROWS; i++) {
        let row = document.createElement('tr')
        gameArea.appendChild(row);
        for (let j = 0; j < COLS; j++) {
            let cell = document.createElement('td');
            cell.classList.add('cell')
            row.append(cell)
        }
    }
}

function toggleFire(timing) {
    if (!fires[0].classList.contains('on')) {
        for (let i = 0; i < fires.length; i++) {
            setTimeout(() => {
                fires[i].classList.add('on');
            }, i*timing)
        }
        
        setTimeout(() => {
            borders[0].style.backgroundColor = 'brown';
            borders[1].style.backgroundColor = 'brown';
            columns[0].style.borderRight = '12px solid brown';
            columns[1].style.borderLeft = '12px solid brown';
        }, 20*timing)
        return;
    } else {
        for (let i = fires.length - 1; i >= 0; i--) {
            setTimeout(() => {
                fires[i].classList.remove('on');
            }, i*timing)
        }
        
        setTimeout(() => {
            borders[0].style.backgroundColor = 'gray';
            borders[1].style.backgroundColor = 'gray';
            columns[0].style.borderRight = '12px solid transparent';
            columns[1].style.borderLeft = '12px solid transparent';
        }, 20*timing)
        return;
    }
}

function toggleDialogue() {
    if (dialogueArea.classList.contains('down') || dialogueArea.classList.contains('goDown')) {
        let img = document.getElementById('friendImg');
        skipBtn.style.display = 'block';
        switch (gameState.level) {
            case 1: 
                img.src = characters.friend1.src;
                gameState.dialogueCounter = 0;
                break;
            case 2: 
                img.src = characters.friend2.src;
                gameState.dialogueCounter = 7;
                break;
            case 3: 
                img.src = characters.friend1.src;
                gameState.dialogueCounter = 20;
                let door = document.getElementById('doorImg');
                door.src = "./images/Dungeon-door-skull.png"
                break;
            case 4: 
                img.src = characters.friend1.src;
                gameState.dialogueCounter = 26;
                skipBtn.style.display = 'none';
                break;
        }
        dialogueArea.classList.remove('goDown');
        dialogueArea.classList.remove('down');
        dialogueArea.classList.add('goUp');
        friend.classList.add('enterLeft')
        hero.classList.add('enterRight')
        dialogueText.classList.add('dialogueEnter');
        textArea.innerHTML = dialogue[gameState.dialogueCounter]
        return;
    } else {
        dialogueArea.classList.remove('goUp');
        dialogueArea.classList.add('goDown');
        setTimeout(() => {
            friend.classList.remove('enterLeft')
            hero.classList.remove('enterRight')
            dialogueText.classList.remove('dialogueEnter');
        }, 3000);
    }
}

function enterSnake() {
    snake.style.display = 'block';
    snake.classList.add('slither');
}

function enterBoss() {
    bossHealth.style.width = '100%'
    let img = document.getElementById('bossImg');
    switch (gameState.currentBoss) {
        case 1: 
            img.src = bosses.boss1.src;
            gameState.bossHealth = bosses.boss1.startHealth;
            break;
        case 2: 
            img.src = bosses.boss2.src;
            gameState.bossHealth = bosses.boss2.startHealth;
            break;
        case 3: 
            img.src = bosses.boss3.src;
            gameState.bossHealth = bosses.boss3.startHealth;
            break;
    }

    boss.classList.add('enterBoss');
}

// PLAY LOGIC
function movePlayer() {
    let oldHead = player.getHead(); 
    let neck = player.body[player.getLength() - 2]; // undefined for a snake with no body
    let oldRow = oldHead[0];
    let oldCol = oldHead[1];
    let newHead, shifted = [];
    switch (player.direction) {
        case 'right':
            newHead = [oldRow, oldCol + 1]; 
            if (isReverse(newHead, neck)) {
                newHead = [oldRow, oldCol - 1]
            }; // if player tries to 180deg reverse, just continue straight
            player.body.push(newHead)
            // if player ate the apple, do not shift tail
            if (!player.hasApple) {
                shifted = player.body.shift();
            } else {
                player.hasApple = false;
            }
            break;
        case 'left':
            newHead = [oldRow, oldCol - 1]; 
            if (isReverse(newHead, neck)) {
                newHead = [oldRow, oldCol + 1]
            };
            player.body.push(newHead)
            if (!player.hasApple) {
                shifted = player.body.shift();
            } else {
                player.hasApple = false;
            }
            break;
        case 'up':
            newHead = [oldRow - 1, oldCol];
            if (isReverse(newHead, neck)) {
                newHead = [oldRow + 1, oldCol]
            };
            player.body.push(newHead)
            if (!player.hasApple) {
                shifted = player.body.shift();
            } else {
                player.hasApple = false;
            }
            break;
        case 'down':
            newHead = [oldRow + 1, oldCol]; 
            if (isReverse(newHead, neck)) {
                newHead = [oldRow - 1, oldCol]
            };
            player.body.push(newHead)
            if (!player.hasApple) {
                shifted = player.body.shift();
            } else {
                player.hasApple = false;
            }
            break;
    }
    
    if (checkCollision()) {return};
    updateGameArea(newHead, oldHead, shifted);
    return;
}

function checkCollision() {
    let head = player.getHead();
    // check walls
    if (head[0] >= ROWS || head[0] < 0 || head[1] >= COLS || head[1] < 0) {
        gameState.isPaused = true;
        gameState.hasLost = true;
        return true;
    }
    
    // check body
    for (let i = 0; i < player.getLength() - 1; i++) {
        if (head[0] === player.body[i][0] && head[1] === player.body[i][1]) {
            gameState.isPaused = true;
            gameState.hasLost = true;
            gameState.gameStatus = 'not playing';
            return true;
        }
    }
    
    // check apple
    let currentCell = gameGrid[head[0]].cells[head[1]];
    if (currentCell && currentCell.classList.contains('apple')) {
        player.hasApple = true;
        currentCell.classList.toggle('apple');
    }
    // check weapon
    if (currentCell && currentCell.classList.contains('weapon')) {
        currentCell.classList.toggle('weapon');
        player.hasWeapon = true;
        damageBoss();
        animateHit();
    }

    if (currentCell && currentCell.classList.contains('buff')) {
        let name = gameState.buffName;
        buffs[name].consume();
        currentCell.classList.toggle('buff');
        currentCell.classList.toggle(buffs[name].className);
    }
    return false;
}

function isReverse(newHead, neck) {
    if (!neck) {
        return false;
    }
    if (newHead[0] === neck[0] && newHead[1] === neck[1]) {
        return true;
    } return false;
}

function updateGameArea(newHead, oldHead, lostTail) {
    let add = gameGrid[newHead[0]].cells[newHead[1]]
    let change = gameGrid[oldHead[0]].cells[oldHead[1]];
    let remove;
    if (lostTail.length === 2) { 
        remove = gameGrid[lostTail[0]].cells[lostTail[1]];
        // remove tail - if snake has not eaten
        if (remove !== undefined) { // undefined when game starts
            if (remove.classList.contains('head') || remove.classList.contains('leftHead')) {
                remove.classList.remove('head');
                remove.classList.remove('leftHead');
            } if (remove.classList.contains('body')) {
                remove.classList.toggle('body');
            }
        }
    }
    
    // add newHead
    if (player.direction === 'left') {
        add.classList.toggle('leftHead');
    } else {
        add.classList.toggle('head');
    }

    // switch oldHead to body
    // but only for a snake that is at least 3 parts
    if (player.getNeck()) { 
    change.classList.remove('head');
    change.classList.remove('leftHead');
    change.classList.toggle('body');
    }

    // create apples every interval
    if (gameState.appleCounter === 0) {
        createApple();
        placeApple();
    }
    // place weapon if player picked one up
    if (player.hasWeapon) {
        player.hasWeapon = false;
        createWeapon();
        placeWeapon();
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

function createApple() {
    let collision = false;
    let row, col;
    do {
        row = Math.floor(Math.random() * ROWS)
        col = Math.floor(Math.random() * COLS)
        let target = gameGrid[row].cells[col]
        for (let i = 0; i < collisionClasses.length; i++) {
            if (target.classList.contains(collisionClasses[i])) {
                collision = true;
                break;
            }
        }
    } while (collision === true);
    gameState.apple = [row, col];
}

function createBuff() {
    let currentBuff = document.querySelector('.buff');
    // only one buff on the board at a time
    if (currentBuff !== null) {
        currentBuff.className = 'cell';
    }
    let collision = false;
    let row, col;
    do {
        row = Math.floor(Math.random() * ROWS)
        col = Math.floor(Math.random() * COLS)
        let target = gameGrid[row].cells[col]
        for (let i = 0; i < collisionClasses.length; i++) {
            if (target.classList.contains(collisionClasses[i])) {
                collision = true;
                break;
            }
        }
    } while (collision === true);
    gameState.buff = [row, col];
}

function createWeapon() {
    let collision = false;
    let row, col;
    do {
        row = Math.floor(Math.random() * ROWS)
        col = Math.floor(Math.random() * COLS)
        let target = gameGrid[row].cells[col]
        for (let i = 0; i < collisionClasses.length; i++) {
            if (target.classList.contains(collisionClasses[i])) {
                collision = true;
                break;
            }
        }
    } while (collision === true);
    gameState.weapon = [row, col];
}

function placeBuff() {
    // get a random buff
    let buffArray = Object.keys(buffs);
    let index = Math.floor(Math.random() * buffArray.length);
    let name = buffArray[index];

    let buff = gameState.buff;
    let cell = gameGrid[buff[0]].cells[buff[1]];
    cell.classList.add('buff')
    cell.classList.add(buffs[name].className);
    gameState.buffName = name;
}

function placeApple() {
    let apple = gameState.apple;
    let cell = gameGrid[apple[0]].cells[apple[1]];
    cell.classList.toggle('apple');
    gameState.appleCounter = 30;
}


function placeWeapon() {
    let weapon = gameState.weapon;
    let cell = gameGrid[weapon[0]].cells[weapon[1]];
    cell.classList.toggle('weapon');
}

// BOSS LOGIC
function damageBoss() {
    let baseDmg = player.getLength();
    let totalDmg = baseDmg * dmg_muliplyer;
    let remaining;
    gameState.score += totalDmg;
    switch (gameState.currentBoss) {
        case 1: 
            bosses.boss1.health -= totalDmg;
            gameState.bossHealth = bosses.boss1.health;
            remaining = bosses.boss1.health / bosses.boss1.startHealth * 100;
            remaining <= 0 ? bossHealth.style.width = '0%' : bossHealth.style.width = `${remaining}%`
            break;
        case 2: 
            bosses.boss2.health -= totalDmg;
            gameState.bossHealth = bosses.boss2.health;
            remaining = bosses.boss2.health / bosses.boss2.startHealth * 100;
            remaining <= 0 ? bossHealth.style.width = '0%' : bossHealth.style.width = `${remaining}%`
            break;    
        case 3: 
            bosses.boss3.health -= totalDmg;
            gameState.bossHealth = bosses.boss3.health;
            remaining = bosses.boss3.health / bosses.boss3.startHealth * 100;
            remaining <= 0 ? bossHealth.style.width = '0%' : bossHealth.style.width = `${remaining}%`
            if (remaining <= 50 && !bosses.boss3.isTransformed) {
                bosses.boss3.spells.spellOfTransform();
            }
            break;    
    }
}

function animateHit() {
    let current = gameState.currentBoss;
    switch (current) {
        case 1: 
            hitAnimation.innerHTML = `<img src="${bosses.boss1.hitAnimationSRC}" class="hitAnimation" />`;
            break;
        case 2:
            hitAnimation.innerHTML = `<img src="${bosses.boss2.hitAnimationSRC}" class="hitAnimation" />`;
            break;
        case 3:
            hitAnimation.innerHTML = `<img src="${bosses.boss3.hitAnimationSRC}" class="hitAnimation" />`;
            break;
    }
}

function killBoss(timing) {
    boss.classList.add('bossDeath');
    boss.classList.remove('enterBoss');
    setTimeout(() => {
        boss.classList.remove('bossDeath');
        boss.classList.remove('enterBoss');
    }, timing)
}

function wipeBoard() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            gameGrid[i].cells[j].className = 'cell';
            player.body = [[08, -1]];
            player.hasApple = false;
        }
    }
}

function castSpell() {
    let list2 = bosses.boss2.spells.list;
    let list3 = bosses.boss3.spells.list;
    let index;
    switch (gameState.currentBoss) {
        case 2: 
            index = Math.floor(Math.random() * list2.length);
            bosses.boss2.spells[list2[index]]();
            break;
        case 3: 
            index = Math.floor(Math.random() * list3.length);
            bosses.boss3.spells[list3[index]]();
            break;
    }
}

function youWin() {
    // toggleFire(FIRE_DELAY * 8);
    title.classList.remove('fadeOut');
    title.classList.add('fadeIn');
    title.id = 'winContainer';
    title.style.display = "";
    enterBtn.remove();
    let h1 = document.getElementById('gameName');
    h1.innerText = 'YOU WIN';
    let thankYou = document.createElement('p');
    thankYou.innerText = `You dealt ${gameState.score} total damage`;
    title.append(thankYou);
}

function youLose() {
    gameState.isPaused = true;
    let score = document.querySelector('.loseScore');
    score.innerText = `${gameState.score} damage dealt`;
    loseText.classList.add('youLose');
}

// start
tick.startTick();
tick.startCounter();