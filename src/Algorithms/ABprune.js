import { BOARD_SIZE } from "../Board/Board";

export function AlphaBetaSearch(board, player) {
    return player ? minValue(board, -Infinity, Infinity, player) : maxValue(board, -Infinity, Infinity, player);
    // 
}

function maxValue(board, alpha, beta, player) {
    let bestBoard = board;

    let { over, winner } = isTerminal(bestBoard);
    if (over) {
        return winner === 2 ? { finalV: 1, finalBoard: bestBoard } : { finalV: -1, finalBoard: bestBoard };
    }

    if (isTie(bestBoard)) {
        return { finalV: 0, finalBoard: bestBoard };
    }

    let Alpha = alpha;
    let v = -Infinity;
    const newBoards = getNewBoards(bestBoard, player);
    for (let i = 0; i < newBoards.length; i++) {
        let { finalV: v2, finalBoard: currBoard } = minValue(newBoards[i], Alpha, beta, !player)
        if (v2 > v) {
            v = v2;
            bestBoard = newBoards[i];
            Alpha = Math.max(Alpha, v);
        }
        if (v >= beta) {
            return { finalV: v, finalBoard: bestBoard }
        }
    };
    return { finalV: v, finalBoard: bestBoard };
}

function minValue(board, alpha, beta, player) {
    let bestBoard = board;

    let { over, winner } = isTerminal(bestBoard);
    if (over) {
        return winner === 2 ? { finalV: 1, finalBoard: bestBoard } : { finalV: -1, finalBoard: bestBoard };
    }

    if (isTie(bestBoard)) {
        return { finalV: 0, finalBoard: bestBoard };
    }

    let Beta = beta;
    let v = Infinity;
    const newBoards = getNewBoards(bestBoard, player);
    for (let i = 0; i < newBoards.length; i++) {
        let { finalV: v2, finalBoard: currBoard } = maxValue(newBoards[i], alpha, Beta, !player);
        if (v2 < v) {
            v = v2;
            bestBoard = newBoards[i];
            Beta = Math.min(Beta, v);
        }
        if (v <= alpha) {
            return { finalV: v, finalBoard: bestBoard }
        }
    };
    return { finalV: v, finalBoard: bestBoard };
}

function isTie(board) {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === 0) {
                return false;
            }
        }
    }
    return true;
}

function isTerminal(board) {
    let over = false;
    let winner = null;
    for (let row = 0; row < BOARD_SIZE; row++) {
        if (board[row].every((val) => val === 1)) {
            over = true;
            winner = 1;
            return { over, winner };
        }
        if (board[row].every((val) => val === 2)) {
            over = true;
            winner = 2;
            return { over, winner };
        }
    }
    const arrCol = (arr, n) => {
        return arr.map((x) => x[n]);
    };
    for (let col = 0; col < BOARD_SIZE; col++) {
        let column = arrCol(board, col)
        if (column.every((val) => val === 1)) {
            over = true;
            winner = 1;
            return { over, winner };
        }
        if (column.every((val) => val === 2)) {
            over = true;
            winner = 2;
            return { over, winner };
        }
    }
    const positiveDiagonal = board.map((row, i) => row[i]);
    const negativeDiagonal = board.map((row, i) => row[BOARD_SIZE - i - 1]);
    if (positiveDiagonal.every((val) => val === 1) || negativeDiagonal.every((val) => val === 1)) {
        over = true;
        winner = 1;
        return { over, winner };
    }
    if (positiveDiagonal.every((val) => val === 2) || negativeDiagonal.every((val) => val === 2)) {
        over = true;
        winner = 2;
        return { over, winner };
    }
    return { over, winner };
}

function getNewBoards(board, player) {
    const boardList = []
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === 0) {
                const copy = structuredClone(board)
                copy[row][col] = player ? 1 : 2;
                boardList.push(copy);
            }
        }
    }
    return boardList;
}