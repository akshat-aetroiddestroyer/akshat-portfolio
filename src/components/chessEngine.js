// High-Performance Client-Side Chess AI Engine with Stockfish Web Worker Fallback

// Positional piece-square evaluation tables (PST)
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_TABLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
];

const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

const TABLES = {
  p: PAWN_TABLE,
  n: KNIGHT_TABLE,
  b: BISHOP_TABLE,
  r: ROOK_TABLE,
  q: QUEEN_TABLE,
  k: KING_TABLE
};

function squareIndex(square, isWhite) {
  const file = square.charCodeAt(0) - 97;
  const rank = 8 - parseInt(square[1], 10);
  return isWhite ? rank * 8 + file : (7 - rank) * 8 + file;
}

function evaluateBoard(game) {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -99999 : 99999;
  }
  if (game.isDraw()) return 0;

  let totalScore = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type] || 0;
      const sq = String.fromCharCode(97 + c) + (8 - r);
      const isWhite = piece.color === 'w';
      const pst = TABLES[piece.type];
      const pstVal = pst ? pst[squareIndex(sq, isWhite)] : 0;

      const score = val + pstVal;
      if (isWhite) {
        totalScore += score;
      } else {
        totalScore -= score;
      }
    }
  }

  return totalScore;
}

function orderMoves(moves) {
  return [...moves].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (a.captured) scoreA += (PIECE_VALUES[a.captured] || 0) * 10 - (PIECE_VALUES[a.piece] || 0);
    if (b.captured) scoreB += (PIECE_VALUES[b.captured] || 0) * 10 - (PIECE_VALUES[b.piece] || 0);
    if (a.promotion) scoreA += 800;
    if (b.promotion) scoreB += 800;
    if (a.san && a.san.includes('+')) scoreA += 50;
    if (b.san && b.san.includes('+')) scoreB += 50;
    return scoreB - scoreA;
  });
}

function minimax(game, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = orderMoves(game.moves({ verbose: true }));
  if (moves.length === 0) {
    return evaluateBoard(game);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const ev = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const ev = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getMinimaxAIMove(game, depth = 3) {
  const legalMoves = game.moves({ verbose: true });
  if (!legalMoves || legalMoves.length === 0) return null;

  const isMaximizing = game.turn() === 'w';
  const orderedMoves = orderMoves(legalMoves);

  let bestMove = orderedMoves[0];
  let bestScore = isMaximizing ? -Infinity : Infinity;

  // Evaluate candidate moves with alpha-beta search
  for (const move of orderedMoves) {
    game.move(move);
    const score = minimax(game, depth - 1, -Infinity, Infinity, !isMaximizing);
    game.undo();

    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return {
    from: bestMove.from,
    to: bestMove.to,
    promotion: bestMove.promotion || 'q'
  };
}

// Web Worker Stockfish integration (Optional accelerator)
class StockfishWorker {
  constructor() {
    this.worker = null;
    this.isReady = false;
    this.onMoveCallback = null;
  }

  async init() {
    if (typeof window === 'undefined' || !window.Worker) return false;
    return new Promise((resolve) => {
      try {
        this.worker = new Worker('/redoxchess.js');
        const timeout = setTimeout(() => {
          this.isReady = false;
          resolve(false);
        }, 1200);

        this.worker.onmessage = (e) => {
          const msg = e.data;
          if (typeof msg === 'string') {
            if (msg === 'readyok') {
              clearTimeout(timeout);
              this.isReady = true;
              resolve(true);
            } else if (msg.startsWith('bestmove')) {
              const best = msg.split(' ')[1];
              if (this.onMoveCallback && best && best !== '(none)') {
                const cb = this.onMoveCallback;
                this.onMoveCallback = null;
                cb(best);
              }
            }
          }
        };

        this.worker.onerror = () => {
          clearTimeout(timeout);
          this.isReady = false;
          resolve(false);
        };

        this.worker.postMessage('uci');
        this.worker.postMessage('isready');
      } catch (err) {
        this.isReady = false;
        resolve(false);
      }
    });
  }

  getBestMove(fen, depth = 12) {
    return new Promise((resolve) => {
      if (!this.worker || !this.isReady) {
        return resolve(null);
      }

      const timer = setTimeout(() => {
        this.onMoveCallback = null;
        resolve(null);
      }, 1500);

      this.onMoveCallback = (uciMove) => {
        clearTimeout(timer);
        if (uciMove && uciMove.length >= 4) {
          resolve({
            from: uciMove.substring(0, 2),
            to: uciMove.substring(2, 4),
            promotion: uciMove.length > 4 ? uciMove[4] : 'q'
          });
        } else {
          resolve(null);
        }
      };

      this.worker.postMessage(`position fen ${fen}`);
      this.worker.postMessage(`go depth ${depth}`);
    });
  }

  terminate() {
    if (this.worker) {
      try {
        this.worker.postMessage('quit');
        this.worker.terminate();
      } catch (e) {
        // ignore
      }
      this.worker = null;
      this.isReady = false;
    }
  }
}

let stockfishSingleton = null;

export async function initStockfish() {
  if (!stockfishSingleton) {
    stockfishSingleton = new StockfishWorker();
    await stockfishSingleton.init();
  }
  return stockfishSingleton;
}

export async function calculateAIMove(game, depth = 3) {
  // If game is over or no legal moves, return null
  const legalMoves = game.moves({ verbose: true });
  if (!legalMoves || legalMoves.length === 0) return null;

  // Attempt Stockfish worker if ready
  if (stockfishSingleton && stockfishSingleton.isReady) {
    try {
      const sfMove = await stockfishSingleton.getBestMove(game.fen(), 10);
      if (sfMove) {
        // Validate sfMove is legal in current game state
        const isLegal = legalMoves.some(
          (m) => m.from === sfMove.from && m.to === sfMove.to
        );
        if (isLegal) {
          return sfMove;
        }
      }
    } catch (e) {
      // fallback to minimax below
    }
  }

  // Fast, guaranteed client-side minimax algorithm
  return getMinimaxAIMove(game, depth);
}
