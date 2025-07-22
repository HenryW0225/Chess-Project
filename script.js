const boardEl = document.getElementById("chessboard");
let board = getInitialBoard();
let selected = null;
let turn = "white";

function drawBoard() {
  boardEl.innerHTML = "";
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.className = `square ${(row + col) % 2 === 0 ? "light" : "dark"}`;
      square.dataset.row = row;
      square.dataset.col = col;

      const piece = board[row][col];
      if (piece) square.textContent = PIECES[piece];

      square.addEventListener("click", () => handleClick(row, col));
      boardEl.appendChild(square);
    }
  }
}

function handleClick(row, col) {
  const piece = board[row][col];
  const isWhite = piece >= 'A' && piece <= 'Z';

  if (selected) {
    const [fromRow, fromCol] = selected;
    const selectedPiece = board[fromRow][fromCol];

    if (isValidMove(selectedPiece, fromRow, fromCol, row, col)) {
      board[row][col] = selectedPiece;
      board[fromRow][fromCol] = "";
      turn = turn === "white" ? "black" : "white";
    }
    selected = null;
  } else {
    if (piece && ((turn === "white" && isWhite) || (turn === "black" && !isWhite))) {
      selected = [row, col];
    }
  }
  drawBoard();
}

function isValidMove(piece, fromRow, fromCol, toRow, toCol) {
  const target = board[toRow][toCol];
  const isWhite = piece >= 'A' && piece <= 'Z';
  const targetIsWhite = target >= 'A' && target <= 'Z';
  if (target && isWhite === targetIsWhite) return false;

  const dr = toRow - fromRow;
  const dc = toCol - fromCol;
  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  switch (piece.toLowerCase()) {
    case 'p':
      let dir = piece === 'P' ? -1 : 1;
      if (dc === 0 && dr === dir && !target) return true;
      if (dc === 0 && dr === 2 * dir && fromRow === (piece === 'P' ? 6 : 1) && !target && !board[fromRow + dir][fromCol]) return true;
      if (absDc === 1 && dr === dir && target) return true;
      return false;
    case 'r':
      if (dr === 0 || dc === 0) return isPathClear(fromRow, fromCol, toRow, toCol);
      return false;
    case 'n':
      return (absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2);
    case 'b':
      if (absDr === absDc) return isPathClear(fromRow, fromCol, toRow, toCol);
      return false;
    case 'q':
      if (dr === 0 || dc === 0 || absDr === absDc) return isPathClear(fromRow, fromCol, toRow, toCol);
      return false;
    case 'k':
      return absDr <= 1 && absDc <= 1;
    default:
      return false;
  }
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
  const stepRow = Math.sign(toRow - fromRow);
  const stepCol = Math.sign(toCol - fromCol);
  let r = fromRow + stepRow;
  let c = fromCol + stepCol;
  while (r !== toRow || c !== toCol) {
    if (board[r][c]) return false;
    r += stepRow;
    c += stepCol;
  }
  return true;
}

drawBoard();
