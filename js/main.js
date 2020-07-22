/* 
Turn-based game created by using Javascript and jQuery.

GAME'S RULES:
1. Randomly generated game map included obstacles, which players can’t pass through directly.
2. Two players can move maximum 3 squares horizontally or vertically.
3. Four weapons with different  damage inflicted, which can be collected by players passing through 
them and replacing with the weapon which they currently have.
4. If players cross over adjacent squares (horizontally or vertically), a battle begins.
5. Each player attacks in turn with the weapon’s power he currently has. Player can also defend against 
next shot sustaining 50% less damage than normal.
5. As soon as the life points of a player falls to 0, he loses. A message appears and the game is over.
EXTRAS: If player pass through square with a question mark, the modal window opens with a quiz question
generated randomly. If player gives correct answer, he increases his life score to 20 points, 
if the answer is incorrect, he loses 10 life scores.
 */
/*_______________________________________________________________________
        
                *VARIABLES*
_________________________________________________________________________*/

const mapSize = 99;
const obstacles = 20;
let tiles = [];
let possibleMoves = 3;
let playerActive;
let activePlayer = 1;
let currentWeapon = 1;
let turn = 0;
let playerDefend = null;
let player1Active = true;
let player2Active = false;
let move = true;
let attacked = false;
let hover = false;

const attackBtn1 = $('.btn-attack-1');
const attackBtn2 = $('.btn-attack-2');
const defendBtn1 = $('.btn-defend-1');
const defendBtn2 = $('.btn-defend-2');
const startButton = $('#start');
const mapContainer = $('#board-game');
const startContainer = $('#intro');
const gameOverContainer =$('#gameOver');
const playerContainerDiv = $('.player-container');
const powerDiv1 = $('.vitamins-1');
const powerDiv2 = $('.vitamins-2');
const body = $('body');
const turnMessage = [
"Let's move, there is your turn! Good Luck!",
"Be careful, don't start your fight if you aren't strong enough!",
"Do you have enough vitamins?",
"Your enemy is behind your back!",
"Your move! Don't wait to long!",
]
const noTurnMessage = 'Wait for your turn!';
// Extra - quiz 
let scores = 0;
let questionsMark = 5;

// create Players
let player1 = new Player('Pig Player', 100, 'player1', 1, 'wp-1', 10, 'image/path-1.png');
let player2 = new Player('Snake Player', 100, 'player2', 2, 'wp-1', 10, 'image/path-2.png');

// initialize the movment of the players:
// players can move by the mouse click 3 tiles horizontally or vertically, avoiding tiles with obstacles
// and the tiles with another player
function movePlayer() {
    let gameBox = $('.box');
    // mouseover method shows the possible move of the player
    gameBox.hover( function () {
            hover = true;
            let sqHovered = $(this).data('index');
            posNew = getCoordinates(sqHovered);
            //check the posible move horizontally
            for (let i = Math.min(posOld.x, posNew.x); i <= Math.max(posOld.x, posNew.x); i++) {
                let num = getTileIndex(i, posOld.y);
                let tile = $('.box[data-index="' + num + '"]');
                if (tile.hasClass('obstacle')) {
                    return;
                }
                if (player1Active) {
                    if (tile.hasClass('player2')) {
                        return;
                    }
                } else {
                    if (tile.hasClass('player1')) {
                        return;
                    }
                }
            }
            //check the posible move vertically 
            for (let i = Math.min(posOld.y, posNew.y); i <= Math.max(posOld.y, posNew.y); i++) {
                let num = getTileIndex(posOld.x, i);
                let tile = $('.box[data-index="' + num + '"]');
                if (tile.hasClass('obstacle')) {
                    return;
                }
                if (player1Active) {
                    if (tile.hasClass('player2')) {
                        return;
                    }
                } else {
                    if (tile.hasClass('player1')) {
                        return;
                    }
                }
            }
            if (!attacked) {
                // if players don't cross adjacent tile, their path for possible movement will be shown
                if (posNew.y === posOld.y && posNew.x <= posOld.x + possibleMoves && posNew.x >= posOld.x - possibleMoves
                    || posNew.x === posOld.x && posNew.y <= posOld.y + possibleMoves && posNew.y >= posOld.y - possibleMoves) {

                    if (player1Active) {
                        $(this).css('backgroundImage', 'url(' + player1.activePath + ')');

                    } else {
                        $(this).css('backgroundImage', 'url(' + player2.activePath + ')');
                    }
                }

            }
            // if the movement isn't possible hover is false and the posible movment won't be shown
        }, 
        function () {
            hover = false;
            $(this).css('backgroundImage', '');
        }
    );
    // by the click method choose the next position of the player 
    gameBox.on('click', function () {
        hover = false;
        let sqClicked = $(this).data('index');
        posNew = getCoordinates(sqClicked);
        //new position of the player choosen by mouse click vertically - coordinate X
        for (let i = Math.min(posOld.x, posNew.x); i <= Math.max(posOld.x, posNew.x); i++) {
            let num = getTileIndex(i, posOld.y);
            let tile = $('.box[data-index="' + num + '"]');
            if (tile.hasClass('obstacle')) {
                $(this).css('cursor', 'not-allowed');
                return;
            }
            if (player1Active) {
                if (tile.hasClass('player2')) {
                    return;
                }
            } else {
                if (tile.hasClass('player1')) {
                    return;
                }
            }
        }
        //check possible new position of the player choosen by mouse click vertically
        for (let i = Math.min(posOld.y, posNew.y); i <= Math.max(posOld.y, posNew.y); i++) {
            let num = getTileIndex(posOld.x, i);
            let tile = $('.box[data-index="' + num + '"]');
            // if new tile includes obstacle - don't move
            if (tile.hasClass('obstacle')) {
                $(this).css('cursor', 'not-allowed');
                return;
            }
            // if new tile includes players - don't move
            if (player1Active) {
                if (tile.hasClass('player2')) {
                    return;
                }
            } else {
                if (tile.hasClass('player1')) {
                    return;
                }
            }
        }
        if (player1Active) {
            if ($(this).hasClass('player1')){
                return;
            }
        }else{
            if ($(this).hasClass('player2')){
                return;
            }
        }

        if (move) {
            // check when the player can move maximum 3 tiles (possibleMoves) horizontally or vertically
            if (posNew.y === posOld.y && posNew.x <= posOld.x + possibleMoves && posNew.x >= posOld.x - possibleMoves
                || posNew.x === posOld.x && posNew.y <= posOld.y + possibleMoves && posNew.y >= posOld.y - possibleMoves) {
                // check the position X
                for (let i = Math.min(posOld.x, posNew.x); i <= Math.max(posOld.x, posNew.x); i++) {
                    let num = getTileIndex(i, posOld.y);
                    checkWeapon(num);
                }
                // check the position Y
                for (let i = Math.min(posOld.y, posNew.y); i <= Math.max(posOld.y, posNew.y); i++) {
                    let num = getTileIndex(posOld.x, i);
                    checkWeapon(num);
                }
                whoIsActive();
                // if the player moved, his tile lose a class 'active', which is set to opposite player
                if (player1Active) {
                    playerPosition = boxPosition('.player2');
                    posOld = getCoordinates(playerPosition);
                    $('.player1').removeClass('player1').removeClass('active');
                    $(this).addClass('player1');
                    $('.player2').addClass('active');
                    fight(posNew, posOld);
                    player1Active = false;

                
                } else {
                    playerPosition = boxPosition('.player1');
                    posOld = getCoordinates(playerPosition);
                    $('.player2').removeClass('player2').removeClass('active');
                    $(this).addClass('player2');
                    $('.player1').addClass('active');
                    fight(posNew, posOld);
                    player1Active = true;
                }
            }
        }
    });
}

// weapon function constructor:
function Weapon(type, value, itemClass) {
    this.type = type;
    this.value = value;
    this.itemClass = itemClass;

    // add weapons to the map
    this.add = function () {
    addComponents(this.itemClass);
    }
    //add quiz mark to the map
    this.addExtras = function(){
        for(var i = 1; i<=questionsMark; i++){
            addComponents(this.itemClass);
        }
    }
};

// create weapons with their attributes:
let defaultWeapon = new Weapon('DefaultWeapon', 10, 'wp-1 weapon');
let strawberry = new Weapon('Strawberry', 30, 'wp-2 weapon');
let kiwi = new Weapon('Kiwi', 40, 'wp-3 weapon');
let lemon = new Weapon('Lemon', 50, 'wp-4 weapon');
let coconut = new Weapon('Coconut', 60, 'wp-5 weapon');
let extra = new Weapon ('Extra1', 20, 'quiz-1');

// replace the weapon on the map:
function replaceWeaponOnMap(value, weapon, num) {
    let tile = $('.box[data-index="' + num + '"]');
    whoIsActive();
    tile.removeClass(weapon).addClass(playerActive.weapon);
    playerActive.weapon = weapon;    
    playerNotActive.power = value;        
}

// check weapon on the tile and call replace functions (for the player's boards and for the map):
function checkWeapon(num) {
    let tile = $('.box[data-index="' + num + '"]');
    if (tile.hasClass('weapon')) {
        if (tile.hasClass('wp-1')) {
            currentWeapon = 1;
            replaceWeaponOnMap(defaultWeapon.value, 'wp-1', num);
            replaceWeaponOnBoard(defaultWeapon.value);
            return;
        }
        if (tile.hasClass('wp-2')) {
            currentWeapon = 2;
            replaceWeaponOnMap(strawberry.value, 'wp-2', num);
            replaceWeaponOnBoard(strawberry.value);
            return;
        }
        if (tile.hasClass('wp-3')) {
            currentWeapon = 3;
            replaceWeaponOnMap(kiwi.value,'wp-3',num);
            replaceWeaponOnBoard(kiwi.value); 
            return;
        }
        if (tile.hasClass('wp-4')) {
            currentWeapon = 4;
            replaceWeaponOnMap(lemon.value, 'wp-4', num);
            replaceWeaponOnBoard(lemon.value);
            return;
        }
            if (tile.hasClass('wp-5')) {
            currentWeapon = 5;
            replaceWeaponOnMap(coconut.value,'wp-5', num);
            replaceWeaponOnBoard(coconut.value);
            return;
            }
        
        }
        if (tile.hasClass('quiz-1')) {
            tile.removeClass('quiz-1');
            initQuiz();
            return;
        }

}

// If players cross over adjacent squares (horizontally or vertically), a battle begins
function fight(posNew, posOld) {

    if (posNew.x === posOld.x 
        && posNew.y <= posOld.y + 1 && posNew.y >= posOld.y - 1 ||posNew.y === posOld.y 
        && posNew.x <= posOld.x + 1 && posNew.x >= posOld.x - 1) {
        move = false;
        hover = false;
        fightingArea();
        scores = 0;
        fightPlayerOne();
        fightPlayerTwo();
    }
}

//initialize the Game
function initGame() {
    game.create();
    for (let i = 0; i < obstacles; i += 1) {
        game.obstacles('obstacle');
    }
    strawberry.add();
    kiwi.add();
    lemon.add();
    coconut.add();
    player1.add();
    player2.add();
    player1.setData();
    player2.setData();
    $('.player1').addClass('active');
    extra.addExtras();

}

initGame();
movePlayer();

// check which player is active:
function whoIsActive() {
    if (player1Active) {
        activePlayer = 2;
        notActivePlayer = 1;
        setActivePlayer(player2, player1, powerDiv2);
        setActiveBoard(notActivePlayer, activePlayer);
        displayMessageOnBoard(activePlayer);  
    } else {
        activePlayer = 1; 
        notActivePlayer = 2;
        setActivePlayer(player1, player2, powerDiv1);
        setActiveBoard(notActivePlayer, activePlayer,);
        displayMessageOnBoard(activePlayer);
    }

}

// to find position x and y on the map 
function getCoordinates(tile) {
    return {
        x: (tile) % 10
        ,
        y: Math.floor((tile) / 10)
    }
}
// to find the position of the box with player class
const boxPosition = (itemClass) => {
    return $(itemClass).data('index');
};
let playerPosition = boxPosition('.player1');
// old position is the position of not active player in the moment
let posOld = getCoordinates(playerPosition);

// index of the tile on the map (from 1 to 100);
function getTileIndex(x, y) {
    return y * 10 + x;
}
// add components to the map function like obstacles, weapon, players, which is used by 'add' function by their
// function constructor.
function addComponents(itemClass, player) {
    let restOfTiles = tiles;
    let boxes = $('.box');
    let empty = true;
    while (empty) {
        let item = random(mapSize);
        if (player === 1) {
            positionRules = (item % 10 === 0);
        } else if (player === 2) {
            positionRules = (item % 10 === 9);
        } else {
            positionRules = (item % 10 !== 0 && item % 10 !== 9);
        }
        if (positionRules && restOfTiles.includes(item)) {
            boxes.eq(item).addClass(itemClass);
            let index = restOfTiles.indexOf(item);
            restOfTiles.splice(index, 1);
            empty = false;
        }
    }
}
// randomize the boxes on the map to randomize position of game's components
function random(num) {
    return Math.floor(Math.random() * num);
}


/*
NEXT CHALLENGES:
1. Turn-based game created using canvas method.
2. Instead of click event using key controlles.
3. Add more questions to the quiz using AJAX.
*/
