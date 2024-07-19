import './App.css';
import { useEffect } from 'react';
import { socket } from './socket';
import { Howl } from 'howler';

const soundFile = '/sounds/PhatSweepaDsharp1.wav';
const soundLoon = '/sounds/634857__robertcrosley__common-loon-dejarlais-lake-210702-t004.wav';
const soundBrass = '/sounds/MoogBrassFsharp4.wav';
const soundHold = '/sounds/Sync_HoldFsharp1.wav';

const sounds = {
  soundFile: new Howl({ src: [soundFile], volume: 1 / 3 }),
  soundLoon: new Howl({ src: [soundLoon], volume: 1 / 3 }),
  soundBrass: new Howl({ src: [soundBrass], volume: 1 / 3 }),
  soundHold: new Howl({ src: [soundHold], volume: 1 / 3 }),
};

function App() {
  const playSound = (sampleKey) => {
    sounds[sampleKey].play();
    socket.emit('playSound', sampleKey);
    console.log(`Sent ${sampleKey} playSound to server`);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('playSound', (sampleKey) => {
      sounds[sampleKey].play();
      console.log(`Received playSound event from server`);
    });

    socket.on('connect_error', (error) => {
      console.log('Connection Error:', error);
    });

    return () => {
      socket.off('playSound');
    };
  }, []);

  return (
    <>
      <h1>SOUND TOGETHER NOW</h1>
      <button onClick={() => playSound('soundFile')}>Moog</button>
      <button onClick={() => playSound('soundLoon')}>Loon</button>
      <button onClick={() => playSound('soundBrass')}>Brass</button>
      <button onClick={() => playSound('soundHold')}>Hold</button>
    </>
  );
}

export default App;
