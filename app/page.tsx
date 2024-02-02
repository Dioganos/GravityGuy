'use client'

import { useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
interface GravityBox {
  top?: string;
  bottom?: string;
  height: string;
  backgroundColor: string;
  width: string;
  left?: string;
  bottomLimit?: number;
  topLimit?: number;
}

class GravityBoxClass implements GravityBox {
  constructor(
    public height: string,
    public backgroundColor: string,
    public width: string,
    public top?: string,
    public bottom?: string,
    public left?: string,
    public bottomLimit?: number,
    public topLimit?: number,
  ) { }
}

const createGravityBox = (
  top: string | undefined,
  bottom: string | undefined,
  height: string,
  backgroundColor: string,
  width: string,
  left: string,
  bottomLimit: number,
  topLimit: number,
): GravityBox => {
  return new GravityBoxClass(height, backgroundColor, width, top, bottom, left, bottomLimit, topLimit);
};


let area = false;
const Game = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 5, y: 0 });
  const [gravity, setGravity] = useState(1);
  const [isJumping, setIsJumping] = useState(false);
  const [isGrounded, setIsGrounded] = useState(true);
  const [isGroundedX, setIsGroundedX] = useState(true);
  const [cameraOffset, setCameraOffset] = useState(0);
  const [camPos, setCamPos] = useState(0);
  const [camSpeed, setCamSpeed] = useState(5);
  const [moveCam, setMoveCam] = useState(false);
  const [bottomLimit, setbottomLimit] = useState(20);
  const [topLimit, settopLimit] = useState(400);
  const [groundHeight, setgroundHeight] = useState(20);
  const [gravityBoxes, setGravityBoxes] = useState<GravityBox[]>([]);
  const [boxIndex, setBoxIndex] = useState(1);
  const [scale, setScale] = useState(1);
  function changeLimits(bottom: any, top: any) {
    setbottomLimit(bottom);
    settopLimit(top);
  }

  const playAudio = () => {
    // Audio elemanına erişim sağlama ve tip belirtme
    const audioElement = document.getElementById('music') as HTMLAudioElement | null;

    // Audio elemanının varlığını kontrol etme ve çalma
    if (audioElement) {
      audioElement.play(); // Audio'yu oynat
    }
  };

  useEffect(() => {
    playAudio(); // Sayfa yüklendiğinde müziği otomatik çal
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (!isJumping && isGrounded)) {
        setGravity(-gravity); // Yer çekimini tersine çevir
        setVelocity((oldVel) => ({ ...oldVel, x: oldVel.x, y: gravity * 5 })); // Zıplama hızı
        setPosition((prevPos) => ({
          ...prevPos,
          x: prevPos.x,
          y: prevPos.y + gravity * 5
        }));
        setIsJumping(true);
        setIsGrounded(false);
        setScale((scale) => (scale * -1));
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gravity, isJumping, isGrounded]);

  useEffect(() => {
    const handleGameLoop = () => {
      if ((position.y == bottomLimit || position.y == topLimit) && isJumping && !isGrounded) {
        setIsGroundedX(!isGroundedX);
        setIsGrounded(true);
        setIsJumping(false);
      }
      if (position.x >= window.innerWidth / 16 && !moveCam) {
        setMoveCam(true);
        setCamPos(position.x - 100);
        setVelocity((oldVel) => ({ ...oldVel, x: 0, y: oldVel.y }));
      }
      if (moveCam) {
        setCamPos((oldPos) => (oldPos + camSpeed));
        //setCameraOffset(camPos - window.innerWidth / 2);
      }
      if (isGroundedX) {
        setPosition((prevPosition) => ({
          ...prevPosition,
          x: prevPosition.x + velocity.x,
          y: Math.min(Math.max(prevPosition.y + velocity.y, topLimit), bottomLimit),
        }));
      }
      else {
        setPosition((prevPosition) => ({
          ...prevPosition,
          x: prevPosition.x + velocity.x,
          y: Math.min(Math.max(prevPosition.y + velocity.y, bottomLimit), topLimit),
        }));
      }
      let interval = (camPos + 200) % 500;
      if (interval == 0) {
        changeLimits(gravityBoxes[boxIndex].bottomLimit, gravityBoxes[boxIndex].topLimit);
        setBoxIndex((last) => (last + 1))
      }
      if (position.y < 0 || position.y > 400) {

      }
      console.log(area)
      if (camPos > 1650 && camPos < 6150 || camPos > 7500 && camPos < 11000 || camPos > 14500 && camPos < 16000 || camPos > 19500 && camPos < 22500) {
        if (!area) {
          area = true;
          setCamSpeed((oldspeed) => (oldspeed * 2));
        }
      }
      else {
        if (area) {
          area = false;
          setCamSpeed((oldspeed) => (oldspeed / 2));
        }
      }
    };



    setGravityBoxes((oncekiKutular) => [
      createGravityBox('520px', '60px', `${groundHeight}px`, 'red', '500px', '0px', 20, 600),
      createGravityBox('540px', '40px', `${groundHeight}px`, 'red', '500px', '500px', 0, 600),
      createGravityBox('80px', undefined, `${groundHeight}px`, 'red', '500px', '1000px', -200, 360),
      createGravityBox('60px', undefined, `${groundHeight}px`, 'red', '500px', '1500px', -200, 380),
      createGravityBox('40px', undefined, `${groundHeight}px`, 'red', '500px', '2000px', -200, 400),
      createGravityBox('520px', '60px', `${groundHeight}px`, 'red', '500px', '2500px', 20, 600),
      createGravityBox('540px', '40px', `${groundHeight}px`, 'red', '500px', '3000px', 0, 600),
      createGravityBox('80px', undefined, `${groundHeight}px`, 'red', '500px', '3500px', -200, 360),
      createGravityBox('60px', undefined, `${groundHeight}px`, 'red', '500px', '4000px', -200, 380),
      createGravityBox('40px', undefined, `${groundHeight}px`, 'red', '500px', '4500px', -200, 400),
      createGravityBox('520px', '60px', `${groundHeight}px`, 'red', '500px', '5000px', 20, 600),
      createGravityBox('540px', '40px', `${groundHeight}px`, 'red', '500px', '5500px', 0, 600),
      createGravityBox('80px', undefined, `${groundHeight}px`, 'red', '500px', '6000px', -200, 360),
      createGravityBox('60px', undefined, `${groundHeight}px`, 'red', '500px', '6500px', -200, 380),
      createGravityBox('40px', undefined, `${groundHeight}px`, 'red', '500px', '7000px', -200, 400),
      createGravityBox('520px', '60px', `${groundHeight}px`, 'red', '500px', '7500px', 20, 600),
      createGravityBox('540px', '40px', `${groundHeight}px`, 'red', '500px', '8000px', 0, 600),
      createGravityBox('80px', undefined, `${groundHeight}px`, 'red', '500px', '8500px', -200, 360),
      createGravityBox('60px', undefined, `${groundHeight}px`, 'red', '500px', '9000px', -200, 380),
      createGravityBox('40px', undefined, `${groundHeight}px`, 'red', '500px', '9500px', -200, 400),
      createGravityBox('520px', '60px', `${groundHeight}px`, 'red', '500px', '10000px', 20, 600),
      createGravityBox('540px', '40px', `${groundHeight}px`, 'red', '500px', '10500px', 0, 600),
      createGravityBox('80px', undefined, `${groundHeight}px`, 'red', '500px', '11000px', -200, 360),
      createGravityBox('60px', undefined, `${groundHeight}px`, 'red', '500px', '11500px', -200, 380),
      createGravityBox('40px', undefined, `${groundHeight}px`, 'red', '500px', '12000px', -200, 400),
      createGravityBox('520px', '60px', `${groundHeight}px`, 'red', '500px', '12500px', 20, 600),
      createGravityBox('540px', '40px', `${groundHeight}px`, 'red', '500px', '13000px', 0, 600),
      createGravityBox('80px', undefined, `${groundHeight}px`, 'red', '500px', '13500px', -200, 360),
      createGravityBox('60px', undefined, `${groundHeight}px`, 'red', '500px', '14000px', -200, 380),
      createGravityBox('40px', undefined, `${groundHeight}px`, 'red', '500px', '14500px', -200, 400),
      createGravityBox('520px', '60px', `${groundHeight}px`, 'red', '500px', '15000px', 20, 600),
      createGravityBox('540px', '40px', `${groundHeight}px`, 'red', '500px', '15500px', 0, 600),
      createGravityBox('80px', undefined, `${groundHeight}px`, 'red', '500px', '16000px', -200, 360),
      createGravityBox('60px', undefined, `${groundHeight}px`, 'red', '500px', '16500px', -200, 380),
      createGravityBox('40px', undefined, `${groundHeight}px`, 'red', '500px', '17000px', -200, 400),
      createGravityBox('520px', '60px', `${groundHeight}px`, 'red', '500px', '17500px', 20, 600),
      createGravityBox('540px', '40px', `${groundHeight}px`, 'red', '500px', '18000px', 0, 600),
      createGravityBox('80px', undefined, `${groundHeight}px`, 'red', '500px', '18500px', -200, 360),
      createGravityBox('60px', undefined, `${groundHeight}px`, 'red', '500px', '19000px', -200, 380),
      createGravityBox('40px', undefined, `${groundHeight}px`, 'red', '500px', '19500px', -200, 400),
      createGravityBox('520px', '60px', `${groundHeight}px`, 'red', '500px', '20000px', 20, 600),
      createGravityBox('540px', '40px', `${groundHeight}px`, 'red', '500px', '20500px', 0, 600),
      createGravityBox('80px', undefined, `${groundHeight}px`, 'red', '500px', '21000px', -200, 360),
      createGravityBox('60px', undefined, `${groundHeight}px`, 'red', '500px', '21500px', -200, 380),
      createGravityBox('40px', undefined, `${groundHeight}px`, 'red', '500px', '22000px', -200, 400),
      createGravityBox('520px', '60px', `${groundHeight}px`, 'red', '500px', '22500px', 20, 600),
      createGravityBox('540px', '40px', `${groundHeight}px`, 'red', '500px', '23000px', 0, 600),

      // Gerekirse daha fazla kutu ekleyebilirsiniz
    ]);


    const gameLoopInterval = setInterval(handleGameLoop, 30);
    return () => {
      clearInterval(gameLoopInterval);
    };

  }, [gravity, isJumping, position, velocity, groundHeight, camPos, camSpeed, area]);

  return (
    <div
      style={{
        position: 'relative',
        top: "150px",
        height: '600px',
        width: '100%',
        background: 'url("https://media3.giphy.com/media/66jJ49FPwSRJ5Pt59T/giphy.gif")', // Arkaplan gif
        backgroundPosition: `${-camPos}px 0`,
        overflow: 'hidden',
        left: `${-camPos / (1080 * 10)}px`,
      }}>
      <div
        style={{
          position: 'relative',
          backgroundPosition: `${-camPos}px 0`,
          left: `${-camPos}px`,
        }}
      >

        {gravityBoxes.map((box, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: box.top,
              bottom: box.bottom,
              height: box.height,
              backgroundColor: box.backgroundColor,
              width: box.width,
              left: box.left,
            }}
          ></div>
        ))}

      </div>
      <img
        src='https://i.redd.it/q8q8cmtvn3y71.gif'
        id='character'
        alt="Character"
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          bottom: `${position.y}px`,
          width: '200px',
          height: '200px',
          transform: `scaleY(${scale})`,
        }}
      />

      <audio
        id='music'
        src="/game.mp3"
        controls
        hidden
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