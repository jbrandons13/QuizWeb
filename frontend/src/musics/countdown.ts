import sound from '../musics/countdown.mp3';

const audio = new Audio(sound);
const CountDownSFX = {
    playmusic: () => {
        // audio.volume = 0.7;
        audio.currentTime = 0
        audio.play();
    },
    stopmusic: () => {
        audio.pause();
        audio.currentTime = 0;
    },
    setVolume: (volume: number) => {
        audio.volume = volume * 0.007;
    },
};

export default CountDownSFX;