import sound from '../musics/transition2.mp3';

const audio = new Audio(sound);
const Transition2SFX = {
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

export default Transition2SFX;