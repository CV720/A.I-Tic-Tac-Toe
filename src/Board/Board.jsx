import React, { useState, useEffect } from 'react';
import playerX from './assets/X-player.png';
import playerO from './assets/O-player.png';
import { AlphaBetaSearch } from '../Algorithms/ABprune';
import './Board.css';

export const BOARD_SIZE = 3;

const Board = () => {
    const [board, setBoard] = useState(makeBoard());
    const [xTurn, setxTurn] = useState(true);
    const [isHovering, setIsHovering] = useState({ x: -1, y: -1 })
    const [isOver, setIsOver] = useState({ gameOver: false, winningPlayer: null });
    const [AIX, setAIX] = useState(true)
    const [AIO, setAIO] = useState(false)

    useEffect(() => {
        gameOver();
        if (AIX && !xTurn && !isOver.gameOver) {
            let { finalV: v2, finalBoard: AIBoard } = AlphaBetaSearch(board, xTurn);
            setBoard(AIBoard)
            setxTurn(!xTurn)
        }
        gameOver();
        if (AIO && xTurn && !isOver.gameOver) {
            let { finalV: v2, finalBoard: AIBoard } = AlphaBetaSearch(board, xTurn);
            setBoard(AIBoard)
            setxTurn(!xTurn)
        }
    }, [board]);

    const handleClick = (row, col) => {
        let copy = [...board];
        copy[row][col] = xTurn ? 1 : 2
        setxTurn(!xTurn);
        setIsHovering({ x: -1, y: -1 })
        setBoard(copy);
    };

    const gameOver = () => {
        const playerVal = !xTurn ? 1 : 2;
        // Check for rows 
        for (let row = 0; row < BOARD_SIZE; row++) {
            if (board[row].every((val) => val === playerVal)) {
                setIsOver({ gameOver: true, winningPlayer: !xTurn ? 'X' : 'O' });
                return;
            }
        }
        //Check for columns
        const arrCol = (arr, n) => {
            return arr.map((x) => x[n]);
        };
        for (let col = 0; col < BOARD_SIZE; col++) {
            let column = arrCol(board, col)
            if (column.every((val) => val === playerVal)) {
                setIsOver({ gameOver: true, winningPlayer: !xTurn ? 'X' : 'O' });
                return;
            }
        }
        // Check for diagonals
        const positiveDiagonal = board.map((row, i) => row[i]);
        const negativeDiagonal = board.map((row, i) => row[BOARD_SIZE - i - 1]);
        if (positiveDiagonal.every((val) => val === playerVal) || negativeDiagonal.every((val) => val === playerVal)) {
            setIsOver({ gameOver: true, winningPlayer: !xTurn ? 'X' : 'O' });
            return;
        }

        let allFilled = true
        for (let row = 0; row < BOARD_SIZE; row++) {
            board[row].forEach((val) => {
                if (val === 0) {
                    allFilled = false;
                }
            })
        }
        if (allFilled) {
            setIsOver({ gameOver: true, winningPlayer: 'Tie' });
        };
    };

    return (
        <>
            <h1>
                Winner: {!isOver.gameOver ? 'None' : isOver.winningPlayer === 'X' ? 'Player X' : isOver.winningPlayer === 'O' ? 'Player O' : 'Tie'}
            </h1>
            <div className="board">
                {board.map((row, rowIdx) => (
                    <div key={rowIdx} className="row">
                        {row.map((cellVal, cellIdx) => (
                            <div key={cellIdx}
                                className="cell"
                                onClick={() => (cellVal === 0 && !isOver.gameOver) ? handleClick(rowIdx, cellIdx) : undefined}
                                onMouseOver={() => (cellVal === 0 && !isOver.gameOver) ? setIsHovering({ x: cellIdx, y: rowIdx }) : undefined}>
                                {cellVal === 0 ? null : <img src={cellVal === 1 ? playerX : playerO} alt={cellVal === 1 ? "playerX" : "playerO"} />}
                                <img src={xTurn ? playerX : playerO}
                                    alt={xTurn ? "playerX-hidden" : "playerO-hidden"}
                                    className="player-hidden"
                                    style={{ display: (isHovering.x === cellIdx && isHovering.y === rowIdx) ? 'block' : 'none' }} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );

};
const makeBoard = () => {
    const board = []
    for (let row = 0; row < BOARD_SIZE; row++) {
        const currRow = []
        for (let col = 0; col < BOARD_SIZE; col++) {
            currRow.push(0);
        }
        board.push(currRow)
    }
    return board;
};

export default Board;