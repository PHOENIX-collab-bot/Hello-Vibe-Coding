// 游戏配置
const config = {
    gridSize: 20,
    speed: 150,
    canvasWidth: 400,
    canvasHeight: 400
};

// 单词列表
const wordList = [
    'sky', 'moon', 'star', 'river', 'mountain',
    'forest', 'ocean', 'fire', 'wind', 'rain',
    'sun', 'cloud', 'flower', 'bird', 'butterfly',
    'dream', 'time', 'space', 'love', 'hope',
    'light', 'dark', 'shadow', 'echo', 'silence',
    'memory', 'future', 'past', 'present', 'eternity'
];

// 成就单词列表（10个科技主题的单词，符合黑客帝国风格）
const achievementWords = [
    'matrix',
    'algorithm',
    'neural',
    'digital',
    'cyber',
    'quantum',
    'binary',
    'encryption',
    'AI',
    'hacking'
];

// 游戏状态
let gameState = {
    snake: [],
    food: {},
    direction: 'right',
    score: 0,
    collectedWords: [],
    achievements: {
        unlockedCount: 0,
        unlockedWords: []
    },
    gameRunning: false,
    gameOver: false,
    gameLoop: null
};

// 初始化游戏
function initGame() {
    // 重置游戏状态
    gameState = {
        snake: [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ],
        food: generateFood(),
        direction: 'right',
        score: 0,
        collectedWords: [],
        achievements: {
            unlockedCount: 0,
            unlockedWords: []
        },
        gameRunning: false,
        gameOver: false,
        gameLoop: null
    };
    
    // 更新分数显示
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('finalScore').textContent = gameState.score;
    
    // 清空单词盒子
    document.getElementById('wordsBox').innerHTML = '';
    
    // 初始化诗歌和图像容器
    document.getElementById('poem').textContent = 'Collect 8 words to generate a poem...';
    document.getElementById('remixButton').style.display = 'none';
    document.getElementById('imageBox').innerHTML = '<div style="color: #0f0; text-align: center; padding: 50px;">Image will be generated after poem creation</div>';
    
    // 初始化成就面板
    updateAchievementPanel();
    
    // 隐藏游戏结束界面
    document.getElementById('gameOver').style.display = 'none';
    
    // 绘制初始状态
    draw();
}

// 生成食物
function generateFood() {
    const maxX = config.canvasWidth / config.gridSize;
    const maxY = config.canvasHeight / config.gridSize;
    
    let food;
    do {
        food = {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY),
            word: wordList[Math.floor(Math.random() * wordList.length)]
        };
    } while (isCollidingWithSnake(food));
    
    return food;
}

// 检查食物是否与蛇碰撞
function isCollidingWithSnake(position) {
    return gameState.snake.some(segment => segment.x === position.x && segment.y === position.y);
}

// 绘制游戏
function draw() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格背景
    drawGrid(ctx);
    
    // 绘制食物
    drawFood(ctx);
    
    // 绘制蛇
    drawSnake(ctx);
}

// 绘制网格
function drawGrid(ctx) {
    ctx.strokeStyle = '#030';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= config.canvasWidth; x += config.gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, config.canvasHeight);
        ctx.stroke();
    }
    
    for (let y = 0; y <= config.canvasHeight; y += config.gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(config.canvasWidth, y);
        ctx.stroke();
    }
}

// 绘制食物
function drawFood(ctx) {
    // 绘制食物背景
    ctx.fillStyle = '#0f0';
    ctx.fillRect(
        gameState.food.x * config.gridSize,
        gameState.food.y * config.gridSize,
        config.gridSize,
        config.gridSize
    );
    
    // 添加食物的发光效果
    ctx.shadowColor = '#0f0';
    ctx.shadowBlur = 10;
    ctx.fillRect(
        gameState.food.x * config.gridSize,
        gameState.food.y * config.gridSize,
        config.gridSize,
        config.gridSize
    );
    ctx.shadowBlur = 0;
    
    // 绘制单词
    ctx.fillStyle = '#000';
    ctx.font = '12px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        gameState.food.word,
        gameState.food.x * config.gridSize + config.gridSize / 2,
        gameState.food.y * config.gridSize + config.gridSize / 2
    );
}

// 绘制蛇
function drawSnake(ctx) {
    // 绘制蛇身
    ctx.fillStyle = '#0f0';
    gameState.snake.forEach((segment, index) => {
        ctx.fillRect(
            segment.x * config.gridSize,
            segment.y * config.gridSize,
            config.gridSize,
            config.gridSize
        );
        
        // 为蛇头添加特殊效果
        if (index === 0) {
            ctx.shadowColor = '#0f0';
            ctx.shadowBlur = 15;
            ctx.fillRect(
                segment.x * config.gridSize,
                segment.y * config.gridSize,
                config.gridSize,
                config.gridSize
            );
            ctx.shadowBlur = 0;
        }
    });
}

// 更新游戏状态
function update() {
    // 移动蛇头
    const head = { ...gameState.snake[0] };
    
    switch (gameState.direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }
    
    // 检查是否吃到食物
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        // 增加分数
        gameState.score += 10;
        document.getElementById('score').textContent = gameState.score;
        
        // 检查是否解锁新成就
        checkAchievements();
        
        // 收集单词
        gameState.collectedWords.push(gameState.food.word);
        updateWordsBox();
        
        // 检查是否收集了8个单词
        if (gameState.collectedWords.length >= 8) {
            generatePoem();
        }
        
        // 生成新食物
        gameState.food = generateFood();
        
        // 蛇身增长（不删除尾部）
        gameState.snake.unshift(head);
    } else {
        // 移动蛇（删除尾部，添加新头部）
        gameState.snake.unshift(head);
        gameState.snake.pop();
    }
    
    // 检查碰撞
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    // 绘制游戏
    draw();
}

// 检查成就解锁
function checkAchievements() {
    const newUnlockedCount = Math.min(Math.floor(gameState.score / 100), achievementWords.length);
    
    if (newUnlockedCount > gameState.achievements.unlockedCount) {
        // 解锁新单词
        for (let i = gameState.achievements.unlockedCount; i < newUnlockedCount; i++) {
            if (i < achievementWords.length) {
                gameState.achievements.unlockedWords.push(achievementWords[i]);
            }
        }
        gameState.achievements.unlockedCount = newUnlockedCount;
        updateAchievementPanel();
    }
}

// 更新成就面板
function updateAchievementPanel() {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const achievementWordsContainer = document.getElementById('achievementWords');
    
    // 更新进度条
    const progress = (gameState.achievements.unlockedCount / achievementWords.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${gameState.achievements.unlockedCount}/${achievementWords.length}`;
    
    // 更新成就单词
    achievementWordsContainer.innerHTML = '';
    achievementWords.forEach((word, index) => {
        const wordElement = document.createElement('div');
        wordElement.className = `achievement-word ${gameState.achievements.unlockedWords.includes(word) ? 'unlocked' : 'locked'}`;
        wordElement.textContent = word;
        achievementWordsContainer.appendChild(wordElement);
    });
}

// 更新单词盒子
function updateWordsBox() {
    const wordsBox = document.getElementById('wordsBox');
    wordsBox.innerHTML = '';
    
    gameState.collectedWords.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word-item';
        wordElement.textContent = word;
        wordsBox.appendChild(wordElement);
    });
}

// 生成诗歌
async function generatePoem() {
    const words = gameState.collectedWords;
    const prompt = `Write a short poem using these words: ${words.join(', ')}. The poem should be in a黑客帝国 style, dark and philosophical.`;
    
    try {
        // 显示加载状态
        document.getElementById('poem').textContent = 'Generating poem...';
        
        // 调用API生成诗歌
        const poem = await callLLMAPI(prompt);
        
        // 显示诗歌
        document.getElementById('poem').textContent = poem;
        document.getElementById('remixButton').style.display = 'inline-block';
        
        // 生成图像
        setTimeout(() => {
            generateImage(poem);
        }, 1000);
    } catch (error) {
        console.error('Error generating poem:', error);
        // 失败时使用备用方案
        const fallbackPoem = `In the ${words[0]} of ${words[1]},\nWhere ${words[2]}s dance in the ${words[3]},\nThe ${words[4]} whispers through the ${words[5]},\nAs ${words[6]} paints the ${words[7]}.`;
        document.getElementById('poem').textContent = fallbackPoem;
        document.getElementById('remixButton').style.display = 'inline-block';
        
        // 生成图像
        setTimeout(() => {
            generateImage(fallbackPoem);
        }, 1000);
    }
}

// 重新混合诗歌
async function remixPoem() {
    const words = gameState.collectedWords;
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const prompt = `Write a different short poem using these words: ${shuffledWords.join(', ')}. The poem should be in a黑客帝国 style, dark and philosophical.`;
    
    try {
        // 显示加载状态
        document.getElementById('poem').textContent = 'Remixing poem...';
        
        // 调用API生成新诗歌
        const poem = await callLLMAPI(prompt);
        
        // 显示新诗歌
        document.getElementById('poem').textContent = poem;
        
        // 生成新图像
        generateImage(poem);
    } catch (error) {
        console.error('Error remixing poem:', error);
        // 失败时使用备用方案
        const fallbackPoem = `Beneath the ${shuffledWords[0]} of ${shuffledWords[1]},\nThe ${shuffledWords[2]} sings to the ${shuffledWords[3]},\nThrough ${shuffledWords[4]} and ${shuffledWords[5]},\n${shuffledWords[6]} guides us to ${shuffledWords[7]}.`;
        document.getElementById('poem').textContent = fallbackPoem;
        
        // 生成新图像
        generateImage(fallbackPoem);
    }
}

// 调用LLM API
async function callLLMAPI(prompt) {
    // 这里使用模拟的API调用，实际项目中可以替换为真实的LLM API
    // 例如OpenAI的GPT API或其他LLM服务
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟API响应
    const mockResponses = [
        `The ${gameState.collectedWords[0]} whispers secrets to the ${gameState.collectedWords[1]},\nAs ${gameState.collectedWords[2]}s flicker in the digital void.\nThe ${gameState.collectedWords[3]} of consciousness flows through ${gameState.collectedWords[4]},\nWhere ${gameState.collectedWords[5]} and ${gameState.collectedWords[6]} dance in eternal code.`,
        `In the matrix of ${gameState.collectedWords[0]},\nThe ${gameState.collectedWords[1]} glows with artificial light.\n${gameState.collectedWords[2]}s of data weave through the ${gameState.collectedWords[3]},\nAs ${gameState.collectedWords[4]} and ${gameState.collectedWords[5]} collide in the digital realm.`,
        `Beneath the ${gameState.collectedWords[0]} of simulation,\nThe ${gameState.collectedWords[1]} holds the key to reality.\n${gameState.collectedWords[2]}s of code form the fabric of ${gameState.collectedWords[3]},\nWhere ${gameState.collectedWords[4]} and ${gameState.collectedWords[5]} merge in the quantum field.`
    ];
    
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
}

// 生成图像
function generateImage(poem) {
    // 使用模拟的图像生成，实际项目中可以调用图像生成API
    const imageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(poem)}&image_size=landscape_16_9`;
    
    // 显示图像
    const imageBox = document.getElementById('imageBox');
    imageBox.innerHTML = `<img src="${imageUrl}" alt="Generated image based on poem">`;
}

// 检查碰撞
function checkCollision() {
    const head = gameState.snake[0];
    
    // 检查边界碰撞
    if (
        head.x < 0 ||
        head.x >= config.canvasWidth / config.gridSize ||
        head.y < 0 ||
        head.y >= config.canvasHeight / config.gridSize
    ) {
        return true;
    }
    
    // 检查自身碰撞
    for (let i = 1; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// 游戏结束
function gameOver() {
    gameState.gameRunning = false;
    gameState.gameOver = true;
    clearInterval(gameState.gameLoop);
    
    // 显示游戏结束界面
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('gameOver').style.display = 'block';
}

// 开始游戏
function startGame() {
    if (!gameState.gameRunning) {
        gameState.gameRunning = true;
        gameState.gameLoop = setInterval(update, config.speed);
    }
}

// 重新开始游戏
function restartGame() {
    clearInterval(gameState.gameLoop);
    initGame();
}

// 处理键盘输入
function handleKeyPress(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (gameState.direction !== 'down') {
                gameState.direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (gameState.direction !== 'up') {
                gameState.direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (gameState.direction !== 'right') {
                gameState.direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (gameState.direction !== 'left') {
                gameState.direction = 'right';
            }
            break;
    }
}

// 初始化事件监听器
function initEventListeners() {
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
    document.getElementById('remixButton').addEventListener('click', remixPoem);
    document.getElementById('achievementButton').addEventListener('click', toggleAchievementPanel);
    document.addEventListener('keydown', handleKeyPress);
}

// 切换成就面板显示
function toggleAchievementPanel() {
    const achievementPanel = document.getElementById('achievementPanel');
    if (achievementPanel.style.display === 'none' || achievementPanel.style.display === '') {
        achievementPanel.style.display = 'block';
    } else {
        achievementPanel.style.display = 'none';
    }
}

// 初始化游戏
window.onload = function() {
    initGame();
    initEventListeners();
};