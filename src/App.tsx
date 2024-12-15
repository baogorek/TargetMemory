import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Shot {
  x: number;
  y: number;
}

interface ShotProps {
  x: number;
  y: number;
  isTarget: boolean;
  onClick: () => void;
}

type GameState = 'ready' | 'playing' | 'memorizing' | 'gameover';

const Target = () => (
  <svg width="384" height="384" className="absolute">
    <circle cx="200" cy="200" r="150" fill="none" stroke="#e5e5e5" strokeWidth="2" />
    <circle cx="200" cy="200" r="120" fill="none" stroke="#e5e5e5" strokeWidth="2" />
    <circle cx="200" cy="200" r="90" fill="none" stroke="#e5e5e5" strokeWidth="2" />
    <circle cx="200" cy="200" r="60" fill="none" stroke="#e5e5e5" strokeWidth="2" />
    <circle cx="200" cy="200" r="30" fill="none" stroke="#e5e5e5" strokeWidth="2" />
    <circle cx="200" cy="200" r="10" fill="#e5e5e5" />
  </svg>
);

const Shot = ({ x, y, isTarget, onClick }: ShotProps) => {
  if (typeof x !== 'number' || typeof y !== 'number') return null;
  
  return (
    <div 
      className={`absolute h-4 w-4 rounded-full transform -translate-x-2 -translate-y-2 ${
        isTarget ? 'bg-red-500' : 'bg-black'
      }`}
      style={{ 
        left: `${x}px`,
        top: `${y}px`
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
};

const ShotMemoryTrainer = () => {
  const [shots, setShots] = useState<Shot[]>([]);
  const [visibleShots, setVisibleShots] = useState<Shot[]>([]);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const generateShot = () => {
    const r = Math.sqrt(-2 * Math.log(Math.random()));
    const theta = 2 * Math.PI * Math.random();
    return {
      x: 200 + (r * Math.cos(theta) * 30),
      y: 200 + (r * Math.sin(theta) * 30)
    };
  };

  const startGame = () => {
    const firstShot = generateShot();
    setShots([firstShot]);
    setVisibleShots([firstShot]);
    setGameState('playing');
    setScore(0);
  };

  const handleShotClick = (clickedIndex: number) => {
    if (gameState !== 'playing') return;
    
    const newestShotIndex = shots.length - 1;
    
    if (clickedIndex === newestShotIndex) {
      setGameState('memorizing');
      setVisibleShots([]);
      
      setTimeout(() => {
        const newShot = generateShot();
        setShots(prev => {
          const newShots = [...prev, newShot]);
          setVisibleShots(newShots);
           return newShots;
        });
        setScore(prev => prev + 1);
        setGameState('playing');
      }, 3000);
    } else {
      setGameState('gameover');
      setHighScore(prev => Math.max(prev, score));
      setVisibleShots(shots);
    }
  };

  const handleCanvasClick = () => {};

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Shot Pattern Memory Trainer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div>Current Score: {score}</div>
          <div>High Score: {highScore}</div>
        </div>
        <div className="relative w-96 h-96 mx-auto mb-4">
          {gameState === 'memorizing' ? (
            <div className="absolute inset-0 bg-black z-20 flex items-center justify-center text-white">
              Holding in Memory...
            </div>
          ) : (
            <>
              <Target />
              <div 
                className="absolute inset-0 border-2 border-gray-300 cursor-crosshair z-10"
                onClick={handleCanvasClick}
              >
                {visibleShots.map((shot, i) => (
                  <Shot 
                    key={i} 
                    x={shot.x} 
                    y={shot.y} 
                    isTarget={gameState === 'gameover' && i === shots.length - 1}
                    onClick={() => handleShotClick(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="text-center">
          {gameState === 'ready' && (
            <Button onClick={startGame}>Start Game</Button>
          )}
          {gameState === 'playing' && (
            <div>Click where you think the last shot was</div>
          )}
          {gameState === 'gameover' && (
            <>
              <div className="mb-4">Game Over! Final Score: {score}</div>
              <div className="mb-4">The red dot shows where the last shot was</div>
              <Button onClick={startGame}>Play Again</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShotMemoryTrainer;
