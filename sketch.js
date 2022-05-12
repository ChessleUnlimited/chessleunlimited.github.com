let board = [];
let w;
let holding = false;
let selected = [0, 0];
let startPos;
let whiteTurn = true;
let openings = [];
let answer = [];
let boardWidth;
let rightShift;
let counter;

let guesses = [[]];
let guessWidth;
let tried = [];
let colors = [];

let savedBoards = [];

let ratio;
let globalScale = .8;

// Turn fen string into board
function fenToBoard(fen) {
    board = [];
    for (let i = 0; i < 8; i++) {
        board.push([]);
        for (let j = 0; j < 8; j++) {
            board[i].push(0);
        }
    }
    let row = 0;
    let col = 0;
    for (let i = 0; i < fen.length; i++) {
        if (fen[i] == "/") {
            row++;
            col = 0;
        } else if (isNaN(fen[i])) {
            board[row][col] = new Piece(
                col * w,
                row * w,
                fen[i].toUpperCase() == fen[i],
                fen[i]
            );
            col++;
        }
    }
}

function preload() {
    openings = loadStrings("data/games.txt");
}

function setup() {
    //ratio = createVector(displayWidth / 1920 * globalScale, displayHeight / 1080 * globalScale);
    ratio = createVector(displayWidth / 1920 * globalScale, displayWidth / 1920 * globalScale);
    createCanvas(1250 * ratio.x, 2100 * ratio.y);
    guessWidth = 90 * ratio.x;
    boardWidth = 850 * ratio.x;
    rightShift = 25 * ratio.x; // + width / 6 (but it doesn't work for moving the pieces)
    w = (boardWidth - (50 * ratio.x)) / 8;
    fenToBoard("rnbqkbnr/pppppppp/////PPPPPPPP/RNBQKBNR");
    for (let i = openings.length - 1; i >= 0; i--) {
        openings[i] = openings[i].split(" ");
        // Get first 10 elements of openings[i] and save to openings[i]
        openings[i] = openings[i].slice(0, 10);
        containsCastle = false;
        for (let j = 0; j < openings[i].length; j++) {
            if (openings[i][j].charAt(0) == "O") {
                containsCastle = true;
                break;
            }
        }
        if (containsCastle) {
            openings.splice(i, 1);
        }
    }
    answer = random(openings);
}

function drawBoard() {
    legalMoves = [];
    if (holding) {
        legalMoves = getLegalMoves(selected[0], selected[1]);
    }
    fill(0);
    rect(20 * ratio.x + rightShift - (25 * ratio.x), 20 * ratio.y, boardWidth - (40 * ratio.x), boardWidth - (40 * ratio.y), 5);
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            push();
            let blue = true;
            if (i % 2 == 0) {
                if (j % 2 == 0) {
                    fill(61, 120, 217);
                } else {
                    fill(255);
                    blue = false;
                }
            } else {
                if (j % 2 == 0) {
                    fill(255);
                    blue = false;
                } else {
                    fill(61, 120, 217);
                }
            }
            noStroke();
            rectMode(CENTER);
            for (let k = 0; k < legalMoves.length; k++) {
                if (
                    p5.Vector.sub(legalMoves[k], createVector(j, i)).mag() == 0
                ) {
                    if (!blue) {
                        fill(196, 84, 100);
                    } else {
                        fill(196, 49, 16);
                    }
                    break;
                }
            }
            if (board[j][i] != 0) {
                if (board[j][i].selected) {
                    fill(201, 240, 62);
                }
            }
            rect(i * w + (50 * ratio.x) + rightShift, j * w + (75 * ratio.y), w, w, 2);
            pop();
        }
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] != 0) {
                board[i][j].show();
            }
        }
    }
}

function drawGuesses() {
    for (let i = 0; i < guesses.length; i++) {
        let x = 25;
        for (let j = 0; j < 10; j++) {
            if (j < guesses[i].length) {
                // Default color
                fill(120);

                notation = guesses[i][j];
                if (i < guesses.length - 1) {
                    guessColor = answer.includes(notation) ? "yellow" : "gray";
                    guessColor = answer[j] == notation ? "green" : guessColor;
                    if (guessColor == "green") {
                        fill(28, 186, 65);
                    } else if (guessColor == "yellow") {
                        fill(232, 215, 26);
                    }
                }

                rectMode(CORNER);
                noStroke();
                rect(
                    x,
                    boardWidth + i * (guessWidth + (10 * ratio.x)),
                    guessWidth,
                    guessWidth,
                    9
                );

                // Text
                fill(255);
                textAlign(CENTER, CENTER);
                textSize(30);
                textStyle(BOLD);
                text(
                    notation,
                    x + guessWidth / 2,
                    boardWidth + i * (guessWidth + (10 * ratio.x)) + guessWidth / 2
                );
            } else {
                fill(120);
                rectMode(CORNER);
                noStroke();
                rect(
                    x,
                    boardWidth + i * (guessWidth + (10 * ratio.x)),
                    guessWidth,
                    guessWidth,
                    9
                );
            }

            x += guessWidth + (10 * ratio.x);
            if (j % 2 != 0) x += guessWidth / 2;
        }
    }
}

function draw() {
    background(119, 80, 44);
    drawBoard();
    drawGuesses();
    counter++;
}

function keyReleased() {
    if (key == "Enter") {
        if (guesses[guesses.length - 1].length == 10) {
            for (let i = 0; i < 10; i++) {
                result = answer.includes(notation) ? "yellow" : "gray";
                result = answer[i] == notation ? "green" : result;
                if (result == "green") {
                    fill(28, 186, 65);
                } else if (result == "yellow") {
                    fill(232, 215, 26);
                }
                if (!tried.includes(guesses[guesses.length - 1][i])) {
                    tried.push(guesses[guesses.length - 1][i]);
                    colors.push(result);
                }
            }
            guesses.push([]);
            fenToBoard("rnbqkbnr/pppppppp/////PPPPPPPP/RNBQKBNR");
            savedBoards = [];
        }
    } else if (key == "ArrowLeft" && savedBoards.length > 0) {
        guesses[guesses.length - 1].pop();
        if (savedBoards.length == 1) {
            fenToBoard("rnbqkbnr/pppppppp/////PPPPPPPP/RNBQKBNR");
        } else {
            board = [];
            for (let i = 0; i < 8; i++) {
                board.push([]);
                for (let j = 0; j < 8; j++) {
                    board[i].push(0);
                }
            }
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if (savedBoards[savedBoards.length - 2][i][j] != 0) {
                        let x = savedBoards[savedBoards.length - 2][i][j].x - (75 * ratio.x);
                        let y = savedBoards[savedBoards.length - 2][i][j].y - (75 * ratio.y);
                        let white = savedBoards[savedBoards.length - 2][i][j].white;
                        let pieceType = savedBoards[savedBoards.length - 2][i][j].pieceType;
                        board[i][j] = new Piece(x, y, white, pieceType);
                    }
                }
            }
        }
        whiteTurn = guesses[guesses.length - 1].length % 2 == 0;
        savedBoards.pop();
    }
}

function generateNotation(start, end, isCapture, isCheck, pieceType) {
    files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

    let startNotation = files[start[1]] + ranks[start[0]];
    let endNotation = files[end[1]] + ranks[end[0]];
    let notation = "";
    if (pieceType == "P") {
        if (isCapture) {
            notation = startNotation.charAt(0) + "x" + endNotation;
        } else {
            notation = endNotation;
        }
    } else {
        notation += pieceType;
        if (isCapture) notation += "x";
        notation += endNotation;
    }
    if (isCheck) notation += "+";

    /*
    // Adding N(b)d7 to the notation
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] != 0) {
                if (board[i][j].pieceType == pieceType && [i, j] != start && board[i][j].white == !whiteTurn) {
                    let otherLegal = getLegalMoves(i, j);
                    console.log(otherLegal);
                    for (let k = 0; k < otherLegal.length; k++) {
                        if (p5.Vector.sub(otherLegal[k], end).mag() == 0) {
                            if (j != start[1]) {
                                notation = notation.charAt(0) + files[start[1]] + notation.slice(1);
                            } else {
                                notation = notation.charAt(0) + ranks[start[0]] + notation.slice(1);
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
    */

    guesses[guesses.length - 1].push(notation);

    // https://stackoverflow.com/questions/13756482/create-copy-of-multi-dimensional-array-not-reference-javascript
    let newArray = [];
    for (let i = 0; i < 8; i++) {
        newArray.push([]);
        for (let j = 0; j < 8; j++) {
            newArray[i].push(0);
        }
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] != 0) {
                let x =
                    board[i][j].x -
                    75 * ratio.x;
                let y =
                    board[i][j].y -
                    75 * ratio.y;
                let white =
                    board[i][j].white;
                let pieceType =
                    board[i][j].pieceType;
                newArray[i][j] = new Piece(x, y, white, pieceType);
            }
        }
    }
    savedBoards.push(newArray);
}

function move(i, j) {
    // Check if it's a legal move
    let legalMoves = getLegalMoves(selected[0], selected[1]);
    let legal = false;
    for (let k = 0; k < legalMoves.length; k++) {
        if (p5.Vector.sub(createVector(i, j), legalMoves[k]).mag() == 0) {
            legal = true;
            break;
        }
    }
    if (!legal) {
        board[selected[0]][selected[1]].selected = false;
        if (board[selected[0]][selected[1]].x != startPos.x) {
            board[selected[0]][selected[1]].x = startPos.x;
            board[selected[0]][selected[1]].y = startPos.y;
        }
        holding = false;
        selected = [];
        return;
    }

    holding = false;
    capture = board[i][j] != 0;
    board[i][j] = board[selected[0]][selected[1]];
    board[selected[0]][selected[1]] = 0;
    board[i][j].selected = false;
    whiteTurn = !whiteTurn;
    board[i][j].x = j * w + (75 * ratio.x);
    board[i][j].y = i * w + (75 * ratio.y);

    /*
    // Check if it's a check
    legalMoves = getLegalMoves(i, j);
    let check = false;
    let kingLocation;
    for (let k = 0; k < 8; k++) {
        for (let l = 0; l < 8; l++) {
            if (board[k][l] != 0) {
                if (
                    board[k][l].pieceType == "K" &&
                    board[k][l].white == whiteTurn
                ) {
                    kingLocation = createVector(k, l);
                    break;
                }
            }
        }
    }
    for (let k = 0; k < legalMoves.length; k++) {
        if (p5.Vector.sub(kingLocation, legalMoves[k]).mag() == 0) {
            check = true;
            break;
        }
    }
    */
    let kingLocation;
    for (let k = 0; k < 8; k++) {
        for (let l = 0; l < 8; l++) {
            if (board[k][l] != 0) {
                if (board[k][l].pieceType == "K" && board[k][l].white == whiteTurn) {
                    kingLocation = createVector(k, l);
                    break;
                }
            }
        }
        if (kingLocation != undefined)
            break;
    }
    generateNotation(selected, [i, j], capture, isCheck(kingLocation.x, kingLocation.y), board[i][j].pieceType);
    selected = [];
}

function mouseDragged() {
    if (holding && counter > 6) {
        board[selected[0]][selected[1]].x = mouseX;
        board[selected[0]][selected[1]].y = mouseY;
    }
}

function mouseReleased() {
    if (board[selected[0]][selected[1]].hoverXY(startPos.x, startPos.y)) {
        board[selected[0]][selected[1]].selected = false;
        board[selected[0]][selected[1]].x = startPos.x;
        board[selected[0]][selected[1]].y = startPos.y;
        selected = [];
        holding = false;
        return;
    }
    if (holding && counter > 6) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (i == selected[0] && j == selected[1])
                    continue;
                if (board[i][j] != 0) {
                    if (board[i][j].hover()) {
                        if (whiteTurn && board[i][j].white) {
                            board[selected[0]][selected[1]].selected = false;
                            board[selected[0]][selected[1]].x = startPos.x;
                            board[selected[0]][selected[1]].y = startPos.y;
                            selected = [];
                            holding = false;
                            return;
                        } else if (!whiteTurn && !board[i][j].white) {
                            board[selected[0]][selected[1]].selected = false;
                            board[selected[0]][selected[1]].x = startPos.x;
                            board[selected[0]][selected[1]].y = startPos.y;
                            selected = [];
                            holding = false;
                            return;
                        } else if ((whiteTurn && !board[i][j].white) || (!whiteTurn && board[i][j].white)) {
                            move(i, j);
                            return;
                        }
                    }
                } else {
                    if (
                        mouseX > j * w + 75 * ratio.x - w / 2 &&
                        mouseX < j * w + 75 * ratio.x + w / 2 &&
                        mouseY > i * w + 75 * ratio.y - w / 2 &&
                        mouseY < i * w + 75 * ratio.y + w / 2
                    ) {
                        move(i, j);
                        return;
                    }
                }
            }
        }
    }
}

function mousePressed() {
    if (guesses[guesses.length - 1].length >= 10) return;
    counter = 0;
    if (holding) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] != 0) {
                    if (board[i][j].hover()) {
                        if (board[i][j].selected) {
                            board[i][j].selected = false;
                            holding = false;
                            return;
                        } else {
                            if (whiteTurn && board[i][j].white) {
                                board[selected[0]][selected[1]].selected = false;
                                board[i][j].selected = true;
                                startPos = createVector(board[i][j].x, board[i][j].y);
                                selected = [i, j];
                                return;
                            } else if (!whiteTurn && !board[i][j].white) {
                                board[selected[0]][selected[1]].selected = false;
                                board[i][j].selected = true;
                                startPos = createVector(board[i][j].x, board[i][j].y);
                                selected = [i, j];
                                return;
                            } else {
                                move(i, j);
                                return;
                            }
                        }
                    }
                } else {
                    if (
                        mouseX > j * w + (75 * ratio.x) - w / 2 &&
                        mouseX < j * w + (75 * ratio.x) + w / 2 &&
                        mouseY > i * w + (75 * ratio.y) - w / 2 &&
                        mouseY < i * w + (75 * ratio.y) + w / 2
                    ) {
                        move(i, j);
                        return;
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] != 0) {
                    if (board[i][j].hover() && board[i][j].white == whiteTurn) {
                        holding = true;
                        board[i][j].selected = true;
                        startPos = createVector(board[i][j].x, board[i][j].y);
                        selected = [i, j];
                        return;
                    }
                }
            }
        }
    }
}
