import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { config } from '../config/config';
import { CHESS_PIECES } from './chessPieces';
import { calculateAIMove, initStockfish } from './chessEngine';
import {
  INITIAL_CHAT_MESSAGES,
  QUICK_PROMPTS,
  getAssistantReply
} from './chessChatbot';

export const InteractiveChess = ({ isEmbedded = false }) => {
  // Game state
  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [capturedByWhite, setCapturedByWhite] = useState([]); // Black pieces captured by White
  const [capturedByBlack, setCapturedByBlack] = useState([]); // White pieces captured by Black
  const [lastMove, setLastMove] = useState(null);
  const [gameStatus, setGameStatus] = useState("White's turn");
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [playerColor] = useState('w');

  // Chat state
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Refs for auto-scrolling
  const chatMessagesRef = useRef(null);
  const moveHistoryRef = useRef(null);

  // Initialize engine worker in background
  useEffect(() => {
    initStockfish().catch(() => {});
  }, []);

  // Compute status text
  const updateStatus = useCallback((currentGame, thinking = false) => {
    if (currentGame.isCheckmate()) {
      setGameStatus(
        currentGame.turn() === 'w'
          ? 'Checkmate! Black (AI) wins!'
          : 'Checkmate! White (You) win!'
      );
    } else if (currentGame.isDraw()) {
      if (currentGame.isStalemate()) {
        setGameStatus('Draw by stalemate');
      } else if (currentGame.isThreefoldRepetition()) {
        setGameStatus('Draw by 3-fold repetition');
      } else if (currentGame.isInsufficientMaterial()) {
        setGameStatus('Draw by insufficient material');
      } else {
        setGameStatus('Draw');
      }
    } else if (currentGame.isCheck()) {
      setGameStatus(
        currentGame.turn() === 'w' ? 'White is in check!' : 'Black is in check!'
      );
    } else if (thinking || currentGame.turn() === 'b') {
      setGameStatus("Black's turn (AI thinking...)");
    } else {
      setGameStatus("White's turn");
    }
  }, []);

  // Keep game status updated
  useEffect(() => {
    updateStatus(game, isAIThinking);
  }, [game, isAIThinking, updateStatus]);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading]);

  // Scroll moves list to bottom when moves update
  useEffect(() => {
    if (moveHistoryRef.current) {
      moveHistoryRef.current.scrollTop = moveHistoryRef.current.scrollHeight;
    }
  }, [moveHistory]);

  // Execute a validated move and trigger AI response if applicable
  const executeMove = useCallback(
    (from, to) => {
      try {
        const nextGame = new Chess(game.fen());
        const move = nextGame.move({ from, to, promotion: 'q' });

        if (move) {
          if (move.captured) {
            if (move.color === 'w') {
              setCapturedByWhite((prev) => [...prev, move.captured]);
            } else {
              setCapturedByBlack((prev) => [...prev, move.captured]);
            }
          }

          setMoveHistory((prev) => [
            ...prev,
            {
              from: move.from,
              to: move.to,
              piece: move.piece,
              captured: move.captured,
              san: move.san
            }
          ]);

          setLastMove({ from, to });
          setGame(nextGame);
          setSelectedSquare(null);
          setPossibleMoves([]);

          // AI Turn Trigger
          if (
            !nextGame.isGameOver() &&
            nextGame.turn() !== playerColor
          ) {
            setIsAIThinking(true);
            updateStatus(nextGame, true);

            setTimeout(async () => {
              try {
                const aiMove = await calculateAIMove(nextGame, 3);
                if (aiMove) {
                  const aiNextGame = new Chess(nextGame.fen());
                  const executedAIMove = aiNextGame.move({
                    from: aiMove.from,
                    to: aiMove.to,
                    promotion: aiMove.promotion || 'q'
                  });

                  if (executedAIMove) {
                    if (executedAIMove.captured) {
                      setCapturedByBlack((prev) => [
                        ...prev,
                        executedAIMove.captured
                      ]);
                    }

                    setMoveHistory((prev) => [
                      ...prev,
                      {
                        from: executedAIMove.from,
                        to: executedAIMove.to,
                        piece: executedAIMove.piece,
                        captured: executedAIMove.captured,
                        san: executedAIMove.san
                      }
                    ]);

                    setLastMove({
                      from: executedAIMove.from,
                      to: executedAIMove.to
                    });
                    setGame(aiNextGame);
                  }
                }
              } catch (err) {
                console.error('AI move execution error:', err);
              } finally {
                setIsAIThinking(false);
              }
            }, 550);
          }
        }
      } catch (err) {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    },
    [game, playerColor, updateStatus]
  );

  // Handle square clicks
  const handleSquareClick = (square) => {
    if (isAIThinking || game.turn() !== playerColor || game.isGameOver()) {
      return;
    }

    const piece = game.get(square);

    if (selectedSquare) {
      if (possibleMoves.includes(square)) {
        executeMove(selectedSquare, square);
        return;
      }

      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves.map((m) => m.to));
        return;
      }

      setSelectedSquare(null);
      setPossibleMoves([]);
    } else if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setPossibleMoves(moves.map((m) => m.to));
    }
  };

  // New Game reset
  const handleNewGame = () => {
    const freshGame = new Chess();
    setGame(freshGame);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setMoveHistory([]);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setLastMove(null);
    setGameStatus("White's turn");
    setIsAIThinking(false);
    setIsFlipped(false);
  };

  // Flip Board view orientation
  const handleFlipBoard = () => {
    setIsFlipped((prev) => !prev);
  };

  // Handle Chat Submit
  const handleSendMessage = async (msgToSend = null) => {
    const text = typeof msgToSend === 'string' ? msgToSend : chatInput;
    if (!text || !text.trim() || isChatLoading) return;

    const userMsg = { role: 'user', content: text.trim() };
    const updatedMessages = [...chatMessages, userMsg];

    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const reply = await getAssistantReply(text.trim(), updatedMessages, {
        status: gameStatus,
        isGameOver: game.isGameOver()
      });
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply }
      ]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Sorry, I had a momentary connection hiccup! Feel free to ask again or make a move on the board ♟️"
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Render piece helper
  const renderPiece = (piece) => {
    if (!piece) return null;
    const key = `${piece.color}${piece.type.toUpperCase()}`;
    const svg = CHESS_PIECES[key];
    if (!svg) return null;
    return (
      <div
        className="chess-piece"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  };

  // Render captured pieces tray
  const renderCapturedPieces = (pieces, pieceColor) => {
    return pieces.map((type, idx) => {
      const key = `${pieceColor}${type.toUpperCase()}`;
      const svg = CHESS_PIECES[key];
      return (
        <div
          key={idx}
          className="captured-piece"
          dangerouslySetInnerHTML={{ __html: svg || '' }}
        />
      );
    });
  };

  // Board files and ranks based on flipped orientation
  const files = isFlipped
    ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
    : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  const ranks = isFlipped
    ? ['1', '2', '3', '4', '5', '6', '7', '8']
    : ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Group moves into pairs for table view
  const formattedMovePairs = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    formattedMovePairs.push({
      moveNum: Math.floor(i / 2) + 1,
      white: moveHistory[i]?.san || '',
      black: moveHistory[i + 1]?.san || ''
    });
  }

  return (
    <div className={`chess-container ${isEmbedded ? 'embedded' : ''}`}>
      {/* ================= LEFT COLUMN: CHAT PANEL ================= */}
      <div className="chat-panel">
        <div className="chat-header">
          <span className="chat-title">💬 Talk with me</span>
        </div>

        <div className="chat-messages" ref={chatMessagesRef}>
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div
                className="message-content"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isChatLoading && (
            <div className="chat-message assistant">
              <div className="message-content typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        {chatMessages.length <= 2 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              padding: '6px 12px 10px',
              background: '#070509'
            }}
          >
            {QUICK_PROMPTS.slice(0, 2).map((prompt, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                data-cursor="disable"
                style={{
                  background: 'rgba(194, 164, 255, 0.1)',
                  border: '1px solid rgba(194, 164, 255, 0.2)',
                  color: '#c2a4ff',
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-area">
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            data-cursor="disable"
          />
          <button
            type="button"
            className="chat-send-btn"
            onClick={() => handleSendMessage()}
            data-cursor="disable"
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
      </div>

      {/* ================= CENTER COLUMN: CHESS BOARD & PLAYER BARS ================= */}
      <div className="chess-board-section">
        {/* Top Player Bar: Opponent (AI) */}
        <div className="player-bar opponent-bar">
          <div className="player-info">
            <div className="player-avatar">
              <span style={{ fontSize: '15px' }}>🤖</span>
            </div>
            <div className="player-details">
              <span className="player-name">{config.developer.name} (AI)</span>
              <span
                className="player-rating"
                style={{
                  color: isAIThinking ? '#fb8dff' : 'var(--accentColor)'
                }}
              >
                {isAIThinking ? '🤔 Thinking...' : 'ELO 3640'}
              </span>
            </div>
          </div>
          {/* Black captured white pieces */}
          <div className="captured-pieces">
            {renderCapturedPieces(capturedByBlack, 'w')}
          </div>
        </div>

        {/* Center Chessboard Wrapper */}
        <div className="chess-board-wrapper">
          <div className="chess-board">
            {ranks.map((rank) =>
              files.map((file) => {
                const square = `${file}${rank}`;
                const piece = game.get(square);

                // Checkerboard colors (a1 is dark, b1 is light, etc.)
                const fileIdx = 'abcdefgh'.indexOf(file);
                const rankIdx = parseInt(rank, 10) - 1;
                const isLight = (fileIdx + rankIdx) % 2 === 1;

                const isSelected = selectedSquare === square;
                const isTarget = possibleMoves.includes(square);
                const isLast =
                  lastMove &&
                  (lastMove.from === square || lastMove.to === square);
                const isCheckSquare =
                  game.isCheck() &&
                  piece &&
                  piece.type === 'k' &&
                  piece.color === game.turn();

                // Coordinates indicators on outer border squares
                const isFirstRankCoord =
                  file === (isFlipped ? 'h' : 'a');
                const isFirstFileCoord =
                  rank === (isFlipped ? '8' : '1');

                return (
                  <div
                    key={square}
                    className={`chess-square ${isLight ? 'light' : 'dark'} ${
                      isSelected ? 'selected' : ''
                    } ${isLast ? 'last-move' : ''} ${
                      isCheckSquare ? 'in-check' : ''
                    }`}
                    onClick={() => handleSquareClick(square)}
                    data-cursor="disable"
                  >
                    {/* Rank coordinate */}
                    {isFirstRankCoord && (
                      <span className="coord-rank">{rank}</span>
                    )}

                    {/* File coordinate */}
                    {isFirstFileCoord && (
                      <span className="coord-file">{file}</span>
                    )}

                    {/* Chess piece */}
                    {renderPiece(piece)}

                    {/* Legal move indicator (dot for empty, ring for capture) */}
                    {isTarget && (
                      <div
                        className={`move-indicator ${
                          piece ? 'capture' : ''
                        }`}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Player Bar: User */}
        <div className="player-bar player-bar-bottom">
          <div className="player-info">
            <div className="player-avatar">
              <span style={{ fontSize: '15px' }}>👤</span>
            </div>
            <div className="player-details">
              <span className="player-name">You</span>
              <span className="player-rating">
                {isFlipped ? 'Black' : 'White'}
              </span>
            </div>
          </div>
          {/* White captured black pieces */}
          <div className="captured-pieces">
            {renderCapturedPieces(capturedByWhite, 'b')}
          </div>
        </div>
      </div>

      {/* ================= RIGHT COLUMN: STATUS, MOVES & CONTROLS ================= */}
      <div className="chess-side-panel right-panel">
        {/* Game Status */}
        <div className="game-status">
          <span className={game.isCheck() ? 'check' : ''}>
            {gameStatus}
          </span>
        </div>

        {/* Move History Table */}
        <div className="move-history">
          <div className="move-history-header">Moves</div>
          <div className="move-history-list" ref={moveHistoryRef}>
            {formattedMovePairs.length === 0 ? (
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.3)',
                  padding: '16px 10px',
                  fontSize: '11px',
                  textAlign: 'center'
                }}
              >
                No moves yet
              </div>
            ) : (
              formattedMovePairs.map((pair, idx) => (
                <div key={idx} className="move-row">
                  <span className="move-num">{pair.moveNum}.</span>
                  <span className="move-white">{pair.white}</span>
                  <span className="move-black">{pair.black}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Game Controls */}
        <div className="game-controls">
          <button
            type="button"
            onClick={handleNewGame}
            className="control-btn"
            data-cursor="disable"
          >
            New Game
          </button>
          <button
            type="button"
            onClick={handleFlipBoard}
            className="control-btn"
            data-cursor="disable"
          >
            Flip Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveChess;
