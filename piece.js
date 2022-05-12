class Piece {
    constructor(x, y, white, pieceType) {
        this.x = x + 50 * ratio.x + rightShift;
        this.y = y + 75 * ratio.y;
        this.white = white;
        this.pieceType = pieceType.toUpperCase();
        this.img = loadImage(
            `images/${this.white ? "white" : "black"}${this.pieceType}.png`
        );
        this.selected = false;
        this.startPos = createVector(this.x, this.y);
    }

    show() {
        imageMode(CENTER);
        this.img.resize(w - 5 * ratio.x, w - 5 * ratio.y);
        image(this.img, this.x, this.y);
    }

    hover() {
        return (mouseX > this.x - w / 2 && mouseX < this.x + w / 2 && mouseY > this.y - w / 2 && mouseY < this.y + w / 2);
    }

    hoverXY(x, y) {
        return (mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - w / 2 && mouseY < y + w / 2);
    }
}

function getLegalMoves(rank, file) {
    let pieceType = board[rank][file].pieceType;
    let white = board[rank][file].white;
    let moves = [];
    switch (pieceType) {
        case "P":
            moves = getPawnMoves(rank, file, white);
            break;
        case "R":
            moves = getSlidingMoves(rank, file);
            break;
        case "N":
            moves = getKnightMoves(rank, file);
            break;
        case "B":
            moves = getDiagonalMoves(rank, file);
            break;
        case "Q":
            moves = getSlidingMoves(rank, file);
            moves = moves.concat(getDiagonalMoves(rank, file));
            break;
        case "K":
            moves = getKingMoves(rank, file);
            break;
    }
    return moves;
}

function getPawnMoves(rank, file, white) {
    moves = [];
    // 1 Move
    if (board[rank + (white ? -1 : 1)][file] == 0)
        moves.push(createVector(rank + (white ? -1 : 1), file));
    // moves = moves.concat(getLegalMoveByDir(createVector(0, white ? -1 : 1), rank, file, 1));

    // 2 Move
    if ((white && rank == 6) || (!white && rank == 1))
        if (moves.length == 1)
            moves = moves.concat(
                getLegalMoveByDir(
                    createVector(0, white ? -2 : 2),
                    rank,
                    file,
                    1
                )
            );

    // Capture
    try {
        let piece = board[rank + (white ? -1 : 1)][file - 1];
        if (piece.white != white && piece != 0) {
            moves.push(createVector(rank + (white ? -1 : 1), file - 1));
        }
    } catch (e) {
        // do nothing
    }
    try {
        let piece = board[rank + (white ? -1 : 1)][file + 1];
        if (piece.white != white && piece != 0) {
            moves.push(createVector(rank + (white ? -1 : 1), file + 1));
        }
    } catch (e) {
        // do nothing
    }
    return moves;
}

function getKnightMoves(rank, file) {
    moves = [];
    moves = moves.concat(getLegalMoveByDir(createVector(2, 1), rank, file, 1));
    moves = moves.concat(getLegalMoveByDir(createVector(2, -1), rank, file, 1));
    moves = moves.concat(getLegalMoveByDir(createVector(1, 2), rank, file, 1));
    moves = moves.concat(getLegalMoveByDir(createVector(1, -2), rank, file, 1));
    moves = moves.concat(getLegalMoveByDir(createVector(-2, 1), rank, file, 1));
    moves = moves.concat(
        getLegalMoveByDir(createVector(-2, -1), rank, file, 1)
    );
    moves = moves.concat(getLegalMoveByDir(createVector(-1, 2), rank, file, 1));
    moves = moves.concat(
        getLegalMoveByDir(createVector(-1, -2), rank, file, 1)
    );
    return moves;
}

function isCheck(kingI, kingJ) {
    let king = board[kingI][kingJ];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] == 0) continue;
            if (board[i][j].white == king.white) continue;

            let legalMoves = getLegalMoves(i, j);
            for (let k = 0; k < legalMoves.length; k++) {
                if (
                    p5.Vector.sub(
                        createVector(kingI, kingJ),
                        legalMoves[k]
                    ).mag() == 0
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

function getKingMoves(rank, file) {
    moves = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i == 0 && j == 0) continue;
            moves = moves.concat(
                getLegalMoveByDir(createVector(i, j), rank, file, 1)
            );
        }
    }
    return moves;
}

function getSlidingMoves(rank, file) {
    moves = [];
    moves = moves.concat(getLegalMoveByDir(createVector(1, 0), rank, file));
    moves = moves.concat(getLegalMoveByDir(createVector(-1, 0), rank, file));
    moves = moves.concat(getLegalMoveByDir(createVector(0, 1), rank, file));
    moves = moves.concat(getLegalMoveByDir(createVector(0, -1), rank, file));
    return moves;
}

function getDiagonalMoves(rank, file) {
    moves = [];
    moves = moves.concat(getLegalMoveByDir(createVector(1, 1), rank, file));
    moves = moves.concat(getLegalMoveByDir(createVector(1, -1), rank, file));
    moves = moves.concat(getLegalMoveByDir(createVector(-1, 1), rank, file));
    moves = moves.concat(getLegalMoveByDir(createVector(-1, -1), rank, file));
    return moves;
}

function getLegalMoveByDir(dir, rank, file, range = 8) {
    let moves = [];
    let pos = createVector(rank, file);
    for (let i = 0; i < range; i++) {
        pos = createVector(pos.x + dir.y, pos.y + dir.x);
        if (pos.x < 0 || pos.x > 7 || pos.y < 0 || pos.y > 7) {
            break;
        }
        if (board[pos.x][pos.y] != 0) {
            if (board[pos.x][pos.y].white != board[rank][file].white) {
                moves.push(pos);
                break;
            } else {
                if (i != 0) {
                    pos = createVector(pos.x - dir.y, pos.y - dir.x);
                    moves.push(pos);
                }
                break;
            }
        } else {
            moves.push(pos);
        }
    }
    return moves;
}
