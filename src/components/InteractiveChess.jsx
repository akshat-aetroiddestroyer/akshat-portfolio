import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { config } from '../config/config';

// Unicode piece symbols
const PIECE_SYMBOLS = {
  p: '♟',
  r: '♜',
  n: '♞',
  b: '♝',
  q: '♛',
  k: '♚',
  P: '♙',
  R: '♖',
  N: '♘',
  B: '♗',
  Q: '♕',
  K: '♔'
};

export const InteractiveChess = ({ isEmbedded = false }) => {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState([]);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState("White's Turn");

  useEffect(() => {
    updateBoard();
  }, [game]);

  const updateBoard = () => {
    setBoard(game.board());

    if (game.isCheckmate()) {
      setGameStatus(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`);
    } else if (game.isDraw()) {
      setGameStatus('Draw game!');
    } else if (game.inCheck()) {
      setGameStatus(`${game.turn() === 'w' ? 'White' : 'Black'} is in Check!`);
    } else {
      setGameStatus(`${game.turn() === 'w' ? "White's Turn (You)" : 'Black (AI Thinking...)'}`);
    }
  };

  const makeAIMove = () => {
    const legalMoves = game.moves({ verbose: true });
    if (legalMoves.length === 0) return;

    // Prioritize captures and checks
    const captures = legalMoves.filter((m) => m.captured);
    const checks = legalMoves.filter((m) => m.san.includes('+'));
    const candidateMoves = captures.length > 0 ? captures : checks.length > 0 ? checks : legalMoves;
    const chosenMove = candidateMoves[Math.floor(Math.random() * candidateMoves.length)];

    game.move(chosenMove);
    setMoveHistory((prev) => [...prev, chosenMove.san]);
    updateBoard();
  };

  const handleSquareClick = (rowIndex, colIndex) => {
    const file = String.fromCharCode(97 + colIndex);
    const rank = 8 - rowIndex;
    const square = `${file}${rank}`;

    if (selectedSquare) {
      try {
        const move = game.move({
          from: selectedSquare,
          to: square,
          promotion: 'q'
        });

        if (move) {
          setMoveHistory((prev) => [...prev, move.san]);
          setSelectedSquare(null);
          setPossibleMoves([]);
          updateBoard();

          if (!game.isGameOver()) {
            setTimeout(makeAIMove, 450);
          }
          return;
        }
      } catch (e) {
        // invalid move
      }
    }

    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setPossibleMoves(moves.map((m) => m.to));
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const handleNewGame = () => {
    const newG = new Chess();
    setGame(newG);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setMoveHistory([]);
  };

  return (
    <div className="chess-interactive-wrapper">
      <div className="chess-status-bar">
        <div className="chess-status-text">
          Status: <span>{gameStatus}</span>
        </div>
        <button className="chess-btn-reset" onClick={handleNewGame} data-cursor="disable">
          Reset / New Game
        </button>
      </div>

      <div className="chess-board-grid">
        {board.map((row, rIdx) =>
          row.map((piece, cIdx) => {
            const file = String.fromCharCode(97 + cIdx);
            const rank = 8 - rIdx;
            const sqName = `${file}${rank}`;
            const isLight = (rIdx + cIdx) % 2 === 0;
            const isSelected = selectedSquare === sqName;
            const isPossible = possibleMoves.includes(sqName);

            return (
              <div
                key={sqName}
                className={`chess-sq ${isLight ? 'chess-sq-light' : 'chess-sq-dark'} ${
                  isSelected ? 'chess-sq-selected' : ''
                } ${isPossible ? 'chess-sq-possible' : ''}`}
                onClick={() => handleSquareClick(rIdx, cIdx)}
              >
                {piece && (
                  <span
                    style={{
                      color: piece.color === 'w' ? '#ffffff' : '#c2a4ff',
                      filter:
                        piece.color === 'w'
                          ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
                          : 'drop-shadow(0 0 6px rgba(194,164,255,0.6))'
                    }}
                  >
                    {PIECE_SYMBOLS[piece.color === 'w' ? piece.type.toUpperCase() : piece.type]}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="chess-status-bar" style={{ justifyContent: 'center' }}>
        <span style={{ fontSize: '12px', color: '#adacac' }}>
          White: {config.developer.fullName} vs Black: AI Engine (Rating: 3640)
        </span>
      </div>
    </div>
  );
};

export default InteractiveChess;
