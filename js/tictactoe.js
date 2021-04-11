
//  Game status element goes here to more easily use it later on 
const statusDisplay = document.querySelector('.game--status');
// same with score
scoreDisplay = document.querySelector('.PlayerScore');

// Variables that will track the game state throught the game. 

// To pause the game in case of an end scenario
let gameActive = true;

// Establish current player here, so we know whos turn. array of objects so we can change names and signs later.
let players = [
  {
    'id' : ['Player1'],
    'name' : ['player 1'],
    'sign' : ['X'],
    'score' : [0]
  },{
    'id' : ['Player2'],
    'name' : ['player 2'],
    'sign' : ['O'],
    'score' : [0]
  }
];

let currentPlayer = players[0];
let P1 = players[0];
let P2 = players[1];

// set player name based on input field entry when button pressed
const setPlayer1Name = function(){
  const input = document.getElementById('Player1');
  objIndex = players.findIndex((obj => obj.id == 'Player1'));
  // ignore if input is empty
  if (input.value !== ""){
  // set new player name
  players[objIndex].name = input.value;
  // restart game to refresh player name
  statusDisplay.innerHTML = currentPlayerTurn();
  scoreDisplay.innerHTML = scoreBoard();
  }
};

// repeat for player 2 as i couldnt get it work for both in one fuction
const setPlayer2Name = function(){
  const input = document.getElementById('Player2');
  objIndex = players.findIndex((obj => obj.id == 'Player2'));
    if (input.value !== ""){
      players[objIndex].name = input.value;
      statusDisplay.innerHTML = currentPlayerTurn();
      scoreDisplay.innerHTML = scoreBoard();
    }
};

// current game state, empty strings in an array will allow us to easily track played cells and validate the game state later on
let gameState = ["", "", "", "", "", "", "", "", ""];

// messages displayed to the user during the game, declared as functions, so that the message gets created with current data every time we need it.
const winMessage = () => `${currentPlayer['name']} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer['name']}'s turn`;
const scoreBoard = () => `${P1['name']} ${P1['score']} / ${P2['score']} ${P2['name']}`

// set the inital message to let the players know whose turn it is
statusDisplay.innerHTML = currentPlayerTurn();
scoreDisplay.innerHTML = scoreBoard();

// listed winning scenarios
const winScenarios = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const cellPlayed = function(clickedCell, clickedCellIndex) {
  //  update internal game state to reflect the played move, as well as update the user interface to reflect the played move
      gameState[clickedCellIndex] = currentPlayer['id'];
      clickedCell.innerHTML = currentPlayer['sign'];
  }

// using a ternary operator to assign a new player to avoid complicated looping through players array.
const playerChange = function() {
  currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  statusDisplay.innerHTML = currentPlayerTurn();
}

// result valdiation. 
const resultValidation = function () {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
      const winCondition = winScenarios[i];

      let a = gameState[winCondition[0]];
      let b = gameState[winCondition[1]];
      let c = gameState[winCondition[2]];
      
      if (a === b && b === c && a !== '') {
          roundWon = true;
          break
      }
  }

  if (roundWon) {
    statusDisplay.innerHTML = winMessage();
    currentPlayer['score'] = parseInt(currentPlayer['score']) + 1;
    scoreDisplay.innerHTML = scoreBoard();  
    gameActive = false;
    return;
}

// check weather there are any values in our game state array that are still not populated with a player sign
let roundDraw = !gameState.includes("");
if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
}

// If we get to here we know that the no one won the game yet, and that there are still moves to be played, so we continue by changing the current player.
playerChange();
}

const cellClick = function (clickedCellEvent) {
  
  // save the clicked html element in a variable for easier further use
      const clickedCell = clickedCellEvent.target;
  
  // grab the 'data-cell-index' attribute from the clicked cell to identify where that cell is in our grid. 
  // getAttribute will return a string value. Since we need an actual number we will parse it to an integer.
      const clickedCellIndex = parseInt(
        clickedCell.getAttribute('data-cell-index')
      );

      // Next check whether the call has already been played, or if the game is paused. If either of those is true we will simply ignore the click.
  if (gameState[clickedCellIndex] !== "" || !gameActive) {
          return;
      }

      // If everything if in order we will proceed with the game flow
      cellPlayed(clickedCell, clickedCellIndex);
      resultValidation();
  }

  //  to re establish start conditions when restart button clicked
const restartGame =function () {
  gameActive = true;
  currentPlayer = players[0]
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.innerHTML = currentPlayerTurn();
  document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

// And finally we add our event listeners to the actual game cells, as well as our restart button
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', cellClick));
document.querySelector('.game--restart').addEventListener('click', restartGame);
document.querySelector('#p1').addEventListener('click', setPlayer1Name)
document.querySelector('#p2').addEventListener('click', setPlayer2Name)
