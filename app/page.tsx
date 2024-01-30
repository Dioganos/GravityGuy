'use client'

import { useState, useEffect, useRef } from 'react';

const Game = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 5, y: 0 });
  const [gravity, setGravity] = useState(1);
  const [isJumping, setIsJumping] = useState(false);
  const [isGrounded, setIsGrounded] = useState(true);
  const [isGroundedX, setIsGroundedX] = useState(true);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (!isJumping && isGrounded)) {
        setGravity(-gravity); // Yer çekimini tersine çevir
        setVelocity({ x: 5, y: gravity * 5 }); // Zıplama hızı
        setPosition((prevPos) => ({
          ...prevPos,
          x: prevPos.x,
          y: prevPos.y + gravity * 5
        }));
        setIsJumping(true);
        setIsGrounded(false);
        setIsGroundedX(!isGroundedX);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gravity, isJumping, isGrounded]);

  useEffect(() => {
    const handleGameLoop = () => {

      if ((position.y == 0 || position.y == 400) && isJumping && !isGrounded) {
        setIsGrounded(true);
        setIsJumping(false);
        console.log(position.y);
      }

      setPosition((prevPosition) => ({
        ...prevPosition,
        x: prevPosition.x + velocity.x,
        y: Math.min(Math.max(prevPosition.y + velocity.y, 0), 400),
      }));

    };

    const gameLoopInterval = setInterval(handleGameLoop, 30);

    return () => {
      clearInterval(gameLoopInterval);
    };
  }, [gravity, isJumping, position.x, velocity]);

  return (
    <div
      style={{
        position: 'relative',
        top: "150px",
        height: '600px',
        width: '100%',
        background: 'url("https://media3.giphy.com/media/66jJ49FPwSRJ5Pt59T/giphy.gif")', // Arkaplan gif
        overflow: 'hidden',
      }}
    >
      <img
        src='https://i.redd.it/q8q8cmtvn3y71.gif'
        alt="Character"
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          bottom: `${position.y}px`,
          width: '200px',
          height: '200px',
          transform: isGroundedX ? 'scaleY(1)' : 'scaleY(-1)', // Zıplarken aynalama
        }}
      />
    </div>
  );
};

const Home = () => (
  <div>
    <h1>Gravity Guy Benzeri Oyun</h1>
    <Game />
  </div>
);

export default Home;