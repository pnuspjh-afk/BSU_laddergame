import React, { useState, useEffect, useMemo } from 'react';
import './styles.css';
import { generateLadder, calculatePath, Bar, Point } from './ladderLogic';

const ROWS = 15;
const WIDTH = 600;
const HEIGHT = 500;
const PADDING = 50;

const App: React.FC = () => {
  const [playerCount, setPlayerCount] = useState(4);
  const [players, setPlayers] = useState<string[]>(['A', 'B', 'C', 'D']);
  const [prizes, setPrizes] = useState<string[]>(['꽝', '당첨', '꽝', '꽝']);
  const [bars, setBars] = useState<Bar[]>([]);
  const [activePaths, setActivePaths] = useState<{ [key: number]: Point[] }>({});
  const [results, setResults] = useState<{ [key: string]: string }>({});
  const [isStarted, setIsStarted] = useState(false);

  // Initialize ladder
  const initGame = () => {
    setBars(generateLadder(playerCount, ROWS));
    setActivePaths({});
    setResults({});
    setIsStarted(true);
  };

  const resetGame = () => {
    setIsStarted(false);
    setActivePaths({});
    setResults({});
  };

  useEffect(() => {
    if (!isStarted) {
      setPlayers(Array.from({ length: playerCount }, (_, i) => String.fromCharCode(65 + i)));
      setPrizes(Array.from({ length: playerCount }, (_, i) => i === 0 ? '당첨' : '꽝'));
    }
  }, [playerCount, isStarted]);

  const stepX = useMemo(() => (WIDTH - PADDING * 2) / (playerCount - 1), [playerCount]);
  const stepY = useMemo(() => HEIGHT / ROWS, []);

  const getCoord = (p: Point) => ({
    x: PADDING + p.x * stepX,
    y: 50 + (p.y + 0.5) * stepY
  });

  const handlePlayerClick = (index: number) => {
    if (activePaths[index]) return;

    const path = calculatePath(index, bars, playerCount, ROWS);
    setActivePaths(prev => ({ ...prev, [index]: path }));
    
    // Calculate result
    const lastPoint = path[path.length - 1];
    const prizeIndex = lastPoint.x;
    
    // 결과를 약간의 지연 후(애니메이션 완료 시점) 표시
    setTimeout(() => {
      setResults(prev => ({ ...prev, [players[index]]: prizes[prizeIndex] }));
    }, 1500);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val >= 2 && val <= 12) {
      setPlayerCount(val);
    }
  };

  return (
    <div className="ladder-container">
      <h1>🎡 사다리 타기</h1>
      
      {!isStarted ? (
        <div className="setup-section card">
          <h3>🎮 게임 설정</h3>
          <div className="input-row">
            <label>참여 인원 (2~12명): </label>
            <input 
              type="number" 
              value={playerCount} 
              onChange={handleCountChange} 
              min="2" 
              max="12" 
              className="player-input"
            />
          </div>

          <div className="names-grid">
            <div className="name-column">
              <h4>👤 플레이어 이름</h4>
              {players.map((p, i) => (
                <input
                  key={`p-${i}`}
                  value={p}
                  onChange={(e) => {
                    const newPlayers = [...players];
                    newPlayers[i] = e.target.value;
                    setPlayers(newPlayers);
                  }}
                  className="player-input"
                  style={{ width: '80%', marginBottom: '5px' }}
                />
              ))}
            </div>
            <div className="name-column">
              <h4>🎁 당첨 항목</h4>
              {prizes.map((p, i) => (
                <input
                  key={`pz-${i}`}
                  value={p}
                  onChange={(e) => {
                    const newPrizes = [...prizes];
                    newPrizes[i] = e.target.value;
                    setPrizes(newPrizes);
                  }}
                  className="prize-input"
                  style={{ width: '80%', marginBottom: '5px', backgroundColor: '#fffbe5' }}
                />
              ))}
            </div>
          </div>

          <button onClick={initGame} className="btn-start">
            사다리 생성하기 🚀
          </button>
        </div>
      ) : (
        <div className="game-section">
          <div className="game-controls">
            <button onClick={resetGame} className="btn-secondary">
              ← 다시 설정
            </button>
            <button 
              onClick={() => players.forEach((_, i) => handlePlayerClick(i))} 
              className="btn-primary"
            >
              모두 결과 보기
            </button>
          </div>

          <div className="svg-wrapper">
            <svg width={WIDTH} height={HEIGHT + 150} className="ladder-svg">
              {/* Vertical Lines */}
              {Array.from({ length: playerCount }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={PADDING + i * stepX}
                  y1={50}
                  x2={PADDING + i * stepX}
                  y2={HEIGHT + 50}
                  className="ladder-line"
                />
              ))}

              {/* Horizontal Bars */}
              {bars.map((bar, i) => (
                <line
                  key={`b-${i}`}
                  x1={PADDING + bar.lineIndex * stepX}
                  y1={50 + (bar.height + 1) * stepY}
                  x2={PADDING + (bar.lineIndex + 1) * stepX}
                  y2={50 + (bar.height + 1) * stepY}
                  className="ladder-bar"
                />
              ))}

              {/* Active Paths */}
              {Object.entries(activePaths).map(([playerIdx, path]) => {
                const d = path.map((p, i) => {
                  const { x, y } = getCoord(p);
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ');

                return (
                  <path
                    key={`path-${playerIdx}`}
                    d={d}
                    className="path-line"
                    stroke={['#ff6b6b', '#4dabf7', '#51cf66', '#fcc419', '#ae3ec9'][parseInt(playerIdx) % 5]}
                    strokeDasharray="2000"
                    strokeDashoffset="2000"
                  />
                );
              })}

              {/* Labels */}
              {players.map((name, i) => (
                <g key={`gn-${i}`} onClick={() => handlePlayerClick(i)} style={{ cursor: 'pointer' }}>
                  <rect
                    x={PADDING + i * stepX - 30}
                    y={5}
                    width={60}
                    height={40}
                    fill="#f1f3f5"
                    rx={8}
                    className="label-box"
                  />
                  <text
                    x={PADDING + i * stepX}
                    y={30}
                    textAnchor="middle"
                    className="player-label"
                  >
                    {name}
                  </text>
                </g>
              ))}

              {prizes.map((prize, i) => (
                <g key={`gpz-${i}`}>
                  <text
                    x={PADDING + i * stepX}
                    y={HEIGHT + 90}
                    textAnchor="middle"
                    className="prize-label-text"
                  >
                    {prize}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {Object.keys(results).length > 0 && (
            <div className="result-section">
              <h3>🏆 결과 요약</h3>
              <div className="result-grid">
                {Object.entries(results).map(([name, prize]) => (
                  <div key={name} className="result-card">
                    <span className="res-name">{name}</span>
                    <span className="res-arrow">→</span>
                    <span className="res-prize">{prize}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
