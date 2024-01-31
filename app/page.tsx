'use client'

import { useState, useEffect, useRef } from 'react';

const Game = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 3, y: 0 });
  const [gravity, setGravity] = useState(1);
  const [isJumping, setIsJumping] = useState(false);
  const [isGrounded, setIsGrounded] = useState(true);
  const [isGroundedX, setIsGroundedX] = useState(true);
  const [cameraOffset, setCameraOffset] = useState(0); // Kamera ofseti
  const [camPos, setCamPos] = useState(0); // Kamera ofseti
  const [camSpeed, setCamSpeed] = useState(3); // Kamera ofseti
  const [moveCam, setMoveCam] = useState(false); // Kamera ofseti
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (!isJumping && isGrounded)) {
        setGravity(-gravity); // Yer çekimini tersine çevir
        setVelocity({ x: 3, y: gravity * 5 }); // Zıplama hızı
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

      if (position.x >= window.innerWidth / 16) {
        setMoveCam(true);
        setCamPos(position.x);
        setVelocity((oldVel) => ({...oldVel,x:0,y:oldVel.y}));
      }
      if(moveCam){
        setCamPos(camPos + camSpeed);
        setCameraOffset(camPos - window.innerWidth / 2);
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
        backgroundPosition: `${-cameraOffset * 1000}px 0`,
        overflow: 'hidden',
        left: `${-cameraOffset / (1080 * 10)}px`,
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