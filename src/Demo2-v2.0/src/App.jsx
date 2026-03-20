import React, { useState, useEffect, useCallback } from 'react';

// 方块类型和形状
const TETROMINOS = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: 'i'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'j'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'l'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'o'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: 's'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 't'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: 'z'
  }
};

// 随机生成方块
const randomTetromino = () => {
  const keys = Object.keys(TETROMINOS);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return TETROMINOS[randomKey];
};

// 初始化游戏板
const createEmptyBoard = () => {
  return Array(20).fill().map(() => Array(10).fill(0));
};

// 旋转方块
const rotate = (matrix) => {
  const N = matrix.length;
  const result = Array(N).fill().map(() => Array(N).fill(0));
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      result[j][N - 1 - i] = matrix[i][j];
    }
  }
  return result;
};

// 检查碰撞
const checkCollision = (board, player, { x: moveX, y: moveY }) => {
  for (let y = 0; y < player.shape.length; y++) {
    for (let x = 0; x < player.shape[y].length; x++) {
      // 检查是否是方块的一部分
      if (player.shape[y][x] !== 0) {
        const newX = player.pos.x + x + moveX;
        const newY = player.pos.y + y + moveY;

        // 检查是否超出边界
        if (
          newX < 0 ||
          newX >= 10 ||
          newY >= 20
        ) {
          return true;
        }

        // 检查是否与已有方块碰撞
        if (newY >= 0 && board[newY][newX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
};

// 合并方块到游戏板
const mergeBoard = (board, player) => {
  const newBoard = JSON.parse(JSON.stringify(board));
  for (let y = 0; y < player.shape.length; y++) {
    for (let x = 0; x < player.shape[y].length; x++) {
      if (player.shape[y][x] !== 0) {
        const boardY = player.pos.y + y;
        const boardX = player.pos.x + x;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = player.color;
        }
      }
    }
  }
  return newBoard;
};

// 清除已满的行
const clearLines = (board) => {
  let newBoard = board.filter(row => !row.every(cell => cell !== 0));
  const linesCleared = board.length - newBoard.length;
  const emptyRows = Array(linesCleared).fill().map(() => Array(10).fill(0));
  newBoard = [...emptyRows, ...newBoard];
  return { board: newBoard, linesCleared };
};

function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [player, setPlayer] = useState({
    pos: { x: 3, y: 0 },
    shape: TETROMINOS.I.shape,
    color: TETROMINOS.I.color
  });
  const [nextPiece, setNextPiece] = useState(randomTetromino());
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dropTime, setDropTime] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [theme, setTheme] = useState('theme-1'); // 初始主题
  const [highScore, setHighScore] = useState(() => {
    return localStorage.getItem('tetrisHighScore') ? parseInt(localStorage.getItem('tetrisHighScore')) : 0;
  });
  const [achievements, setAchievements] = useState(() => {
    return JSON.parse(localStorage.getItem('tetrisAchievements')) || {
      firstGame: false,
      reachLevel2: false,
      reachLevel5: false,
      reachLevel10: false,
      score500: false,
      score1000: false,
      score3000: false,
      clear10Lines: false,
      clear50Lines: false,
      clear100Lines: false
    };
  });
  const [totalLinesCleared, setTotalLinesCleared] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);

  // 开始游戏
  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setPlayer({
      pos: { x: 3, y: 0 },
      shape: TETROMINOS.I.shape,
      color: TETROMINOS.I.color
    });
    setNextPiece(randomTetromino());
    setGameOver(false);
    setIsPlaying(true);
    setScore(0);
    setLevel(1);
    setDropTime(1000); // 初始下落速度：1秒
    setShowInstructions(false);
    setTheme('theme-1'); // 重置主题
    setTotalLinesCleared(0);

    // 检查并更新成就：第一次游戏
    if (!achievements.firstGame) {
      const newAchievements = { ...achievements, firstGame: true };
      setAchievements(newAchievements);
      localStorage.setItem('tetrisAchievements', JSON.stringify(newAchievements));
    }
  }, [achievements]);

  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    if (!gameOver) {
      setIsPlaying(prev => !prev);
    }
  }, [gameOver]);

  // 移动方块
  const movePlayer = useCallback((dir) => {
    if (!isPlaying || gameOver) return;

    if (dir === 'left' && !checkCollision(board, player, { x: -1, y: 0 })) {
      setPlayer(prev => ({
        ...prev,
        pos: { ...prev.pos, x: prev.pos.x - 1 }
      }));
    }
    if (dir === 'right' && !checkCollision(board, player, { x: 1, y: 0 })) {
      setPlayer(prev => ({
        ...prev,
        pos: { ...prev.pos, x: prev.pos.x + 1 }
      }));
    }
    if (dir === 'down' && !checkCollision(board, player, { x: 0, y: 1 })) {
      setPlayer(prev => ({
        ...prev,
        pos: { ...prev.pos, y: prev.pos.y + 1 }
      }));
    }
  }, [board, player, isPlaying, gameOver]);

  // 旋转方块
  const rotatePlayer = useCallback(() => {
    if (!isPlaying || gameOver) return;

    const rotatedShape = rotate(player.shape);
    if (!checkCollision(board, { ...player, shape: rotatedShape }, { x: 0, y: 0 })) {
      setPlayer(prev => ({
        ...prev,
        shape: rotatedShape
      }));
    }
  }, [board, player, isPlaying, gameOver]);

  // 硬降
  const hardDrop = useCallback(() => {
    if (!isPlaying || gameOver) return;

    let newY = player.pos.y;
    while (!checkCollision(board, player, { x: 0, y: newY - player.pos.y + 1 })) {
      newY++;
    }

    setPlayer(prev => ({
      ...prev,
      pos: { ...prev.pos, y: newY }
    }));
  }, [board, player, isPlaying, gameOver]);

  // 生成新方块
  const spawnNewPiece = useCallback(() => {
    const newPiece = nextPiece;
    setPlayer({
      pos: { x: 3, y: 0 },
      shape: newPiece.shape,
      color: newPiece.color
    });
    setNextPiece(randomTetromino());

    // 检查游戏是否结束
    if (checkCollision(board, { pos: { x: 3, y: 0 }, shape: newPiece.shape, color: newPiece.color }, { x: 0, y: 0 })) {
      setGameOver(true);
      setIsPlaying(false);
      setDropTime(null);
    }
  }, [nextPiece, board]);

  // 游戏主逻辑
  useEffect(() => {
    if (!isPlaying) return;

    const moveDown = () => {
      if (!checkCollision(board, player, { x: 0, y: 1 })) {
        setPlayer(prev => ({
          ...prev,
          pos: { ...prev.pos, y: prev.pos.y + 1 }
        }));
      } else {
        // 合并方块到游戏板
        const newBoard = mergeBoard(board, player);
        // 清除已满的行
        const { board: clearedBoard, linesCleared } = clearLines(newBoard);
        setBoard(clearedBoard);

        // 更新得分
        if (linesCleared > 0) {
          const linePoints = [0, 100, 300, 500, 800];
          const newScore = score + linePoints[linesCleared] * level;
          setScore(newScore);

          // 更新总消除行数
          const newTotalLines = totalLinesCleared + linesCleared;
          setTotalLinesCleared(newTotalLines);

          // 检查并更新最高分
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('tetrisHighScore', newScore.toString());
          }

          // 每清除10行升级
          const newLevel = Math.floor(newScore / 1000) + 1;
          if (newLevel > level) {
            setLevel(newLevel);
            setDropTime(1000 / newLevel);

            // 检查并更新等级成就
            let newAchievements = { ...achievements };
            if (newLevel >= 2 && !achievements.reachLevel2) {
              newAchievements.reachLevel2 = true;
            }
            if (newLevel >= 5 && !achievements.reachLevel5) {
              newAchievements.reachLevel5 = true;
            }
            if (newLevel >= 10 && !achievements.reachLevel10) {
              newAchievements.reachLevel10 = true;
            }

            // 保存成就
            if (JSON.stringify(newAchievements) !== JSON.stringify(achievements)) {
              setAchievements(newAchievements);
              localStorage.setItem('tetrisAchievements', JSON.stringify(newAchievements));
            }
          }

          // 检查并更新分数成就
          let newAchievements = { ...achievements };
          if (newScore >= 500 && !achievements.score500) {
            newAchievements.score500 = true;
          }
          if (newScore >= 1000 && !achievements.score1000) {
            newAchievements.score1000 = true;
          }
          if (newScore >= 3000 && !achievements.score3000) {
            newAchievements.score3000 = true;
          }

          // 检查并更新消除行数成就
          if (newTotalLines >= 10 && !achievements.clear10Lines) {
            newAchievements.clear10Lines = true;
          }
          if (newTotalLines >= 50 && !achievements.clear50Lines) {
            newAchievements.clear50Lines = true;
          }
          if (newTotalLines >= 100 && !achievements.clear100Lines) {
            newAchievements.clear100Lines = true;
          }

          // 保存成就
          if (JSON.stringify(newAchievements) !== JSON.stringify(achievements)) {
            setAchievements(newAchievements);
            localStorage.setItem('tetrisAchievements', JSON.stringify(newAchievements));
          }

          // 根据分数切换主题
          if (newScore < 1000) {
            setTheme('theme-1');
          } else if (newScore < 3000) {
            setTheme('theme-2');
          } else {
            setTheme('theme-3');
          }
        }

        // 生成新方块
        spawnNewPiece();
      }
    };

    const interval = setInterval(moveDown, dropTime);
    return () => clearInterval(interval);
  }, [board, player, isPlaying, dropTime, spawnNewPiece, score, level]);

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') movePlayer('left');
      if (e.key === 'ArrowRight') movePlayer('right');
      if (e.key === 'ArrowDown') movePlayer('down');
      if (e.key === 'ArrowUp') rotatePlayer();
      if (e.key === ' ') hardDrop();
      if (e.key === 'p') togglePause();
      if (e.key === 'r') startGame();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer, rotatePlayer, hardDrop, togglePause, startGame]);

  // 渲染游戏板
  const renderBoard = () => {
    const displayBoard = JSON.parse(JSON.stringify(board));

    // 添加当前方块
    for (let y = 0; y < player.shape.length; y++) {
      for (let x = 0; x < player.shape[y].length; x++) {
        if (player.shape[y][x] !== 0) {
          const boardY = player.pos.y + y;
          const boardX = player.pos.x + x;
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            displayBoard[boardY][boardX] = player.color;
          }
        }
      }
    }

    return displayBoard.map((row, y) =>
      row.map((cell, x) => (
        <div
          key={`${y}-${x}`}
          className={`cell ${cell !== 0 ? cell : ''}`}
        />
      ))
    );
  };

  // 渲染下一个方块
  const renderNextPiece = () => {
    const emptyBoard = Array(4).fill().map(() => Array(4).fill(0));
    const pieceBoard = JSON.parse(JSON.stringify(emptyBoard));

    for (let y = 0; y < nextPiece.shape.length; y++) {
      for (let x = 0; x < nextPiece.shape[y].length; x++) {
        if (nextPiece.shape[y][x] !== 0) {
          pieceBoard[y][x] = nextPiece.color;
        }
      }
    }

    return pieceBoard.map((row, y) =>
      row.map((cell, x) => (
        <div
          key={`next-${y}-${x}`}
          className={`cell ${cell !== 0 ? cell : ''}`}
        />
      ))
    );
  };

  return (
    <div className={theme}>
      <h1>俄罗斯方块</h1>
      <div className="game-container">
        <div className="game-board">
          {renderBoard()}
        </div>
        <div className="game-info">
          <div className="score">得分: {score}</div>
          <div className="high-score">最高分: {highScore}</div>
          <div className="level">等级: {level}</div>
          <div className="theme-indicator">主题: {theme.replace('theme-', '')}</div>
          <div>
            <h3>下一个方块</h3>
            <div className="next-piece">
              {renderNextPiece()}
            </div>
          </div>
          <div className="game-controls">
            {!isPlaying && !gameOver && (
              <button className="start-btn" onClick={startGame}>开始游戏</button>
            )}
            {isPlaying && (
              <button className="pause-btn" onClick={togglePause}>暂停</button>
            )}
            {(gameOver || isPlaying) && (
              <button className="restart-btn" onClick={startGame}>重新开始</button>
            )}
            <button className="achievements-btn" onClick={() => setShowAchievements(true)}>成就</button>
          </div>
        </div>
        {showAchievements && (
          <div className="achievements-modal">
            <div className="achievements-content">
              <h3>成就</h3>
              <div className="achievements-list">
                <div className={`achievement ${achievements.firstGame ? 'unlocked' : 'locked'}`}>首次游戏</div>
                <div className={`achievement ${achievements.reachLevel2 ? 'unlocked' : 'locked'}`}>达到2级</div>
                <div className={`achievement ${achievements.reachLevel5 ? 'unlocked' : 'locked'}`}>达到5级</div>
                <div className={`achievement ${achievements.reachLevel10 ? 'unlocked' : 'locked'}`}>达到10级</div>
                <div className={`achievement ${achievements.score500 ? 'unlocked' : 'locked'}`}>得分500</div>
                <div className={`achievement ${achievements.score1000 ? 'unlocked' : 'locked'}`}>得分1000</div>
                <div className={`achievement ${achievements.score3000 ? 'unlocked' : 'locked'}`}>得分3000</div>
                <div className={`achievement ${achievements.clear10Lines ? 'unlocked' : 'locked'}`}>消除10行</div>
                <div className={`achievement ${achievements.clear50Lines ? 'unlocked' : 'locked'}`}>消除50行</div>
                <div className={`achievement ${achievements.clear100Lines ? 'unlocked' : 'locked'}`}>消除100行</div>
              </div>
              <button className="close-btn" onClick={() => setShowAchievements(false)}>关闭</button>
            </div>
          </div>
        )}
      </div>
      {gameOver && (
        <div className="game-over">
          <h2>游戏结束</h2>
          <p>最终得分: {score}</p>
          <button className="restart-btn" onClick={startGame}>重新开始</button>
        </div>
      )}
      {showInstructions && (
        <div className="game-over">
          <h2>游戏控制说明</h2>
          <div style={{ textAlign: 'left', margin: '20px 0' }}>
            <p>← → 移动方块</p>
            <p>↓ 加速下落</p>
            <p>↑ 旋转方块</p>
            <p>空格 硬降</p>
            <p>P 暂停/继续</p>
            <p>R 重新开始</p>
          </div>
          <button className="start-btn" onClick={() => setShowInstructions(false)}>我已知晓</button>
        </div>
      )}
    </div>
  );
}

export default App;