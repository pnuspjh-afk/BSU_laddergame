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

  // Initialize ladder
  const initGame = () => {
    setBars(generateLadder(playerCount, ROWS));
    setActivePaths({});
    setResults({});
  };

  useEffect(() => {
    initGame();
  }, [playerCount]);

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
    setResults(prev => ({ ...prev, [players[index]]: prizes[prizeIndex] }));
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val >= 2 && val <= 12) {
      setPlayerCount(val);
      setPlayers(Array.from({ length: val }, (_, i) => String.fromCharCode(65 + i)));
      setPrizes(Array.from({ length: val }, (_, i) => i === 0 ? '당첨' : '꽝'));
    }
  };

  return (
    <div className="ladder-container">
      <h1>🎡 사다리 타기</h1>
      
      <div className="setup-section">
        <div>
          <label>참여 인원: </label>
          <input 
            type="number" 
            value={playerCount} 
            onChange={handleCountChange} 
            min="2" 
            max="12" 
            className="player-input"
          />
          <button onClick={initGame} className="btn-primary" style={{ marginLeft: '10px' }}>
            다시 만들기
          </button>
          <button 
            onClick={() => {
              players.forEach((_, i) => handlePlayerClick(i));
            }} 
            className="btn-primary" 
            style={{ marginLeft: '10px', backgroundColor: '#51cf66' }}
          >
            모두 보기
          </button>
        </div>

        <div className="input-group">
          {players.map((p, i) => (
            <input
              key={`p-${i}`}
              value={p}
              onChange={(e) => {
                const newPlayers = [...players];
                newPlayers[i] = e.target.value;
                setPlayers(newPlayers);
              }}
              placeholder="이름"
              className="player-input"
            />
          ))}
        </div>
      </div>

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
          <g key={`gn-${i}`} onClick={() => handlePlayerClick(i)}>
            <rect
              x={PADDING + i * stepX - 30}
              y={5}
              width={60}
              height={40}
              fill="#f1f3f5"
              rx={8}
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
          <foreignObject
            key={`pz-${i}`}
            x={PADDING + i * stepX - 40}
            y={HEIGHT + 70}
            width={80}
            height={40}
          >
            <input
              value={prize}
              onChange={(e) => {
                const newPrizes = [...prizes];
                newPrizes[i] = e.target.value;
                setPrizes(newPrizes);
              }}
              className="prize-input"
              style={{ width: '100%', textAlign: 'center', backgroundColor: '#fffbe5' }}
            />
          </foreignObject>
        ))}
      </svg>

      {Object.keys(results).length > 0 && (
        <div className="result-overlay">
          <h3 style={{ marginTop: 0 }}>🏆 결과 요약</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
            {Object.entries(results).map(([name, prize]) => (
              <div key={name} style={{ background: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '12px', color: '#868e96' }}>{name}</div>
                <div style={{ fontSize: '16px', color: prize === '당첨' ? '#e03131' : '#1971c2' }}>{prize}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
