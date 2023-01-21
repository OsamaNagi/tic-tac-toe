(function () {
  let gameBoard;
  const Human = "X";
  const Computer = "O";

  const winning_combination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];

  const cells = document.querySelectorAll(".cell");
  const replay = document.getElementById("replay");

  const turnClick = (square) => {
    if (typeof gameBoard[square.target.id] == "number") {
      turn(square.target.id, Human);
      if (!tie()) turn(spot(), Computer);
    }
  };

  const turn = (squareId, player) => {
    gameBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(gameBoard, player);
    if (gameWon) gameOver(gameWon);
  };

  const checkWin = (board, player) => {
    let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
    let gameWon = null;
    for (let [index, win] of winning_combination.entries()) {
      if (win.every((elem) => plays.indexOf(elem) > -1)) {
        gameWon = { index: index, player: player };
        break;
      }
    }
    return gameWon;
  };

  const emptySlots = () => {
    return gameBoard.filter((slot) => typeof slot === "number");
  };

  const spot = () => {
    return minimax(gameBoard, Computer).index;
  };

  const winner = (who) => {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
  };

  const tie = () => {
    if (emptySlots().length == 0) {
      for (let i = 0; i < cells.length; i++) {
        cells[i].style.backgroundColor = "green";
        cells[i].removeEventListener("click", turnClick, false);
      }
      winner("Tie!");
      return true;
    }
    return false;
  };

  const minimax = (newBoard, player) => {
    var availSpots = emptySlots();

    if (checkWin(newBoard, Human)) {
      return { score: -10 };
    } else if (checkWin(newBoard, Computer)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
      var move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player == Computer) {
        var result = minimax(newBoard, Human);
        move.score = result.score;
      } else {
        var result = minimax(newBoard, Computer);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;

      moves.push(move);
    }

    var bestMove;
    if (player === Computer) {
      var bestScore = -10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      var bestScore = 10000;
      for (var i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  };

  const gameOver = (gameWon) => {
    for (let index of winning_combination[gameWon.index]) {
      document.getElementById(index).style.backgroundColor =
        gameWon.player === Human ? "red" : "blue";
    }
    for (let i = 0; i < cells.length; i++) {
      cells[i].removeEventListener("click", turnClick, false);
    }
    winner(gameWon.player === Human ? "You Win!" : "You Lose!");
  };

  const startGame = () => {
    document.querySelector(".endgame").style.display = "none";
    gameBoard = Array.from(Array(9).keys());

    for (let i = 0; i < cells.length; i++) {
      cells[i].innerHTML = "";
      cells[i].style.removeProperty("background-color");
      cells[i].addEventListener("click", turnClick, false);
    }
  };

  replay.addEventListener("click", startGame);
  startGame();
})();
