/*______________________________________________________________________________________________________________

    *INFORMATION ON THE PLAYER BOARDS*
________________________________________________________________________________________________________________*/

//set attributes to the acctive player to use them by replacing weapon
function setActivePlayer(Active, notActive, activePowerDiv) {
    playerActive = Active;
    playerNotActive = notActive; 
    activePlayerPowerDiv = activePowerDiv;      
}
// add a class for a board of the active player to display current information about game flow
function setActiveBoard(notActivePlayer, activePlayer) {
    $('#player-' + notActivePlayer).removeClass('active-board');
    $('#player-' + activePlayer).addClass('active-board');
}
// display random message on active player's board
function displayMessageOnBoard(activePlayer) {  
    let text = turnMessage[Math.floor(Math.random()*turnMessage.length)];
    $('.turn-' + activePlayer).text(text);
    $('.turn-' + notActivePlayer).text(noTurnMessage);
}
// replace the information on the player's board:
function replaceWeaponOnBoard(power){
    whoIsActive();
    $('.fruit-' + notActivePlayer).empty();
    $('<img src="image/wp-' + currentWeapon +'.png">').appendTo(".fruit-" + notActivePlayer);
    $(".vitamins-" + notActivePlayer).text(power);
}
// Extra points for the players if they cross through 'quiz' square.
function addExtraPoints(){
    whoIsActive();
    playerActive.lifeScore += scores; 
    $('#life-'+ playerActive.player).text(playerActive.lifeScore);
}
// show and hide buttons during the fight
function combat() {
    if(turn == 0) {
        attackBtn1.hide();
        defendBtn1.hide();
        attackBtn2.hide();
        defendBtn2.hide();
    }else if(turn == 1) {
        attackBtn2.hide();
        defendBtn2.hide();
        attackBtn1.show();
        defendBtn1.show();
    } else if (turn == 2) {
        attackBtn1.hide();
        defendBtn1.hide();
        attackBtn2.show();
        defendBtn2.show();       
    }
}
// when the players fight, the board game is hidden
function fightingArea() {
    mapContainer.hide();
    $('#player-1').css('margin-left', '300px');
    $(body).css({
        'backgroundImage' : 'url("image/background.jpg")',
        'backgroundSize'  : 'no-repeat'
    })
    $('div.turn-1').empty();
    $('div.turn-2').empty();
    $('#player-' + activePlayer).removeClass('active-board');
    attackBtn1.show();
    defendBtn1.show();

}
// display Game Over board at the end, when battle is finished
function gameOverBoard() {
    $('.player-container').hide();
    $('header').hide();
    gameOverContainer.show();
    player1.winner(player2);
}
/*______________________________________________________________________________________________________________

    *BUTTONS FUNCTIONALITY*
________________________________________________________________________________________________________________*/
function startGame(){
    playerContainerDiv.show();
    mapContainer.show();
    startContainer.hide();
    attackBtn1.hide();
    attackBtn2.hide(); 
    defendBtn1.hide();
    defendBtn2.hide();
    $('#player-1').addClass('active-board');
 };

// attack and defend buttons connected with attack function mentioned in player function constructor
function fightPlayerOne(){
    attackBtn1.click(function() {
        player1.attack(player2);
        pleyerDefend = 0;
        turn = 2;
        activePlayer = 2;
        combat();
    });
    defendBtn1.click(function(){
        playerDefend = 1;
        turn = 2;
        activePlayer = 2;
        combat();
        
    })
}
function fightPlayerTwo() {
        attackBtn2.click(function() {
        player2.attack(player1);
        pleyerDefend = 0;
        turn = 1;
        activePlayer = 1;
        combat();
    });
    defendBtn2.click(function(){       
        turn = 1;
        playerDefend = 1;
        activePlayer = 1;
        combat();
        
    })
}