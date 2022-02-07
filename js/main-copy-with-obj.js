'use strict'

// Pieces Types
const KING_WHITE = '♔';
const QUEEN_WHITE = '♕';
const ROOK_WHITE = '♖';
const BISHOP_WHITE = '♗';
const KNIGHT_WHITE = '♘';
const PAWN_WHITE = '♙';
const KING_BLACK = '♚';
const QUEEN_BLACK = '♛';
const ROOK_BLACK = '♜';
const BISHOP_BLACK = '♝';
const KNIGHT_BLACK = '♞';
const PAWN_BLACK = '♟';

// The Chess Board
var gBoard;
var gSelectedElCell = null;

function restartGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function buildBoard() {
    //build the board 8 * 8
    var board = [];
    for (var i = 0; i < 8; i++) {
        board[i] = [];
        for (var j = 0; j < 8; j++) {
            var currCell = { piece: '', isWhite: null }
            if (i === 1) currCell = { piece: PAWN_BLACK, isWhite: false };
            if (i === 6) currCell = { piece: PAWN_WHITE, isWhite: true };
            board[i][j] = currCell;
        }
    }

    board[0][0] = board[0][7] = { piece: ROOK_BLACK, isWhite: false };
    board[0][1] = board[0][6] = { piece: KNIGHT_BLACK, isWhite: false };
    board[0][2] = board[0][5] = { piece: BISHOP_BLACK, isWhite: false };
    board[0][3] = { piece: QUEEN_BLACK, isWhite: false };
    board[0][4] = { piece: KING_BLACK, isWhite: false };

    board[7][0] = board[7][7] = { piece: ROOK_WHITE, isWhite: true };
    board[7][1] = board[7][6] = { piece: KNIGHT_WHITE, isWhite: true };
    board[7][2] = board[7][5] = { piece: BISHOP_WHITE, isWhite: true };
    board[7][3] = { piece: QUEEN_WHITE, isWhite: true };
    board[7][4] = { piece: KING_WHITE, isWhite: true };

    console.table(board);
    return board;

}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j].piece;
            // figure class name
            var className = ((i + j) % 2 === 0) ? 'white' : 'black';
            var tdId = `cell-${i}-${j}`;

            strHtml += `<td id="${tdId}" class="${className}" onclick="cellClicked(this)">
                            ${cell}
                        </td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}


function cellClicked(elCell) {

    // if the target is marked - move the piece!
    if (elCell.classList.contains('mark')) {
        movePiece(gSelectedElCell, elCell);
        cleanBoard();
        return;
    }

    cleanBoard();

    elCell.classList.add('selected');
    gSelectedElCell = elCell;

    var cellCoord = getCellCoord(elCell.id);
    var currCell = gBoard[cellCoord.i][cellCoord.j]
    var piece = currCell.piece;
    console.log('currCell', currCell)

    var possibleCoords = [];
    switch (piece) {
        case ROOK_WHITE:
        case ROOK_BLACK:
            possibleCoords = getAllPossibleCoordsRook(cellCoord, currCell.isWhite);
            break;
        case BISHOP_WHITE:
        case BISHOP_BLACK:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord, currCell.isWhite);
            break;
        case KNIGHT_WHITE:
        case KNIGHT_BLACK:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord, currCell.isWhite);
            break
        case PAWN_WHITE:
        case PAWN_BLACK:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, currCell.isWhite);
            break;
        case QUEEN_WHITE:
        case QUEEN_BLACK:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord, currCell.isWhite);
            break;
        case KING_WHITE:
        case KING_BLACK:
            possibleCoords = getAllPossibleCoordsKing(cellCoord, currCell.isWhite)
    }
    markCells(possibleCoords);
}

function movePiece(elFromCell, elToCell) {

    var fromCoord = getCellCoord(elFromCell.id);
    var fromCell = gBoard[fromCoord.i][fromCoord.j]
    var toCoord = getCellCoord(elToCell.id);
    var toCell = gBoard[toCoord.i][toCoord.j]

    // update the MODEL
    var piece = fromCell.piece;
    var isWhite = fromCell.isWhite
    fromCell.piece = '';
    toCell.piece = piece;
    fromCell.isWhite = null;
    toCell.isWhite = isWhite

    // update the DOM
    elFromCell.innerText = '';
    elToCell.innerText = piece;

}

function markCells(coords) {
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        var elCell = document.querySelector(`#cell-${coord.i}-${coord.j}`);
        elCell.classList.add('mark')
    }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
}

function cleanBoard() {
    var elTds = document.querySelectorAll('.mark, .selected');
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected');
    }
}

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j].piece === ''
}


function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    var res = [];
    var diff = (isWhite) ? -1 : 1;
    var nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
    if (isEmptyCell(nextCoord)) res.push(nextCoord);
    else {
        return res;
    }

    if ((pieceCoord.i === 1 && !isWhite) || (pieceCoord.i === 6 && isWhite)) {
        diff *= 2;
        nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
        if (isEmptyCell(nextCoord)) res.push(nextCoord);
    }
    return res;
}



function getAllPossibleCoordsRook(pieceCoord, isWhite) {
    // UNFINISHED BUT WORKING!
    // pieceCoord.i--
    //     if (isEmptyCell(pieceCoord)) {
    //         res.push({ i: pieceCoord.i, j: pieceCoord.j })
    //         getAllPossibleCoordsRook(pieceCoord, false, res)
    //     }
    // return res
    var res = []
    var currCoord
    for (var i = pieceCoord.i + 1; i >= 0 && i < 8; i++) {
        currCoord = { i: i, j: pieceCoord.j }
        if (!isEmptyCell(currCoord)) {
            if (gBoard[currCoord.i][currCoord.j].isWhite !== isWhite) res.push(currCoord)
            break
        }
        res.push(currCoord)
    }
    for (var i = pieceCoord.i - 1; i >= 0 && i < 8; i--) {
        currCoord = { i: i, j: pieceCoord.j }
        if (!isEmptyCell(currCoord)) {
            if (gBoard[currCoord.i][currCoord.j].isWhite !== isWhite) res.push(currCoord)
            break
        }
        res.push(currCoord)
    }
    for (var j = pieceCoord.j + 1; j >= 0 && j < 8; j++) {
        currCoord = { i: pieceCoord.i, j }
        if (!isEmptyCell(currCoord)) {
            if (gBoard[currCoord.i][currCoord.j].isWhite !== isWhite) res.push(currCoord)
            break
        }
        res.push(currCoord)
    }
    for (var j = pieceCoord.j - 1; j >= 0 && j < 8; j--) {
        currCoord = { i: pieceCoord.i, j }
        if (!isEmptyCell(currCoord)) {
            if (gBoard[currCoord.i][currCoord.j].isWhite !== isWhite) res.push(currCoord)
            break
        }
        res.push(currCoord)
    }
    return res
}

function getAllPossibleCoordsBishop(pieceCoord, isWhite) {
    // UNFINISHED BUT WORKING!
    var res = [];
    var i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        var coord = { i: i--, j: idx };
        if (!isEmptyCell(coord)) {
            if (gBoard[coord.i][coord.j].isWhite !== isWhite) res.push(coord)
            break
        }
        res.push(coord);
    }
    i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j - 1; i < 8 && idx >= 0; idx--) {
        var coord = { i: i++, j: idx };
        if (!isEmptyCell(coord)) {
            if (gBoard[coord.i][coord.j].isWhite !== isWhite) res.push(coord)
            break
        }
        res.push(coord);
    }
    var j = pieceCoord.j - 1
    for (var idx = pieceCoord.i - 1; j >= 0 && idx >= 0; idx--) {
        var coord = { i: idx, j: j-- };
        if (!isEmptyCell(coord)) {
            if (gBoard[coord.i][coord.j].isWhite !== isWhite) res.push(coord)
            break
        }
        res.push(coord);
    }
    j = pieceCoord.j + 1
    for (var idx = pieceCoord.i + 1; j >= 0 && idx < 8; idx++) {
        var coord = { i: idx, j: j++ };
        if (!isEmptyCell(coord)) {
            if (gBoard[coord.i][coord.j].isWhite !== isWhite) res.push(coord)
            break
        }
        res.push(coord);
    }
    return res;
}

function getAllPossibleCoordsKnight(pieceCoord, isWhite) {
    // UNFINISHED BUT WORKING!
    var res = []
    const possibleKnightPoses = [{ i: -2, j: -1 }, { i: -2, j: 1 },
        { i: -1, j: 2 }, { i: 1, j: 2 },
        { i: 2, j: 1 }, { i: 2, j: -1 },
        { i: 1, j: -2 }, { i: -1, j: -2 }
    ]
    for (var i = 0; i < possibleKnightPoses.length; i++) {
        var coord = {
            i: pieceCoord.i + possibleKnightPoses[i].i,
            j: pieceCoord.j + possibleKnightPoses[i].j
        }
        if (coord.i < 0 || coord.i > gBoard.length - 1 ||
            coord.j < 0 || coord.j > gBoard[0].length - 1) continue
        if (!isEmptyCell(coord)) {
            if (gBoard[coord.i][coord.j].isWhite !== isWhite) res.push(coord)
            continue
        }
        res.push(coord)
    }
    return res;
}

function getAllPossibleCoordsQueen(pieceCoord, isWhite) {
    return getAllPossibleCoordsBishop(pieceCoord, isWhite).concat(getAllPossibleCoordsRook(pieceCoord, isWhite))
}

function getAllPossibleCoordsKing(pieceCoord, isWhite) {
    var res = []
    for (var i = pieceCoord.i - 1; i <= pieceCoord.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pieceCoord.j - 1; j <= pieceCoord.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1 ||
                (i === pieceCoord.i && j === pieceCoord.j)) continue
            if (!isEmptyCell({ i, j })) {
                if (gBoard[i][j].isWhite !== isWhite) res.push({ i, j })
                continue
            }
            res.push({ i, j })
        }
    }
    return res
}