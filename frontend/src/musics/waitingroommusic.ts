import sound from '../musics/waitingroombgmsc.mp3';

const audio = new Audio(sound);
const WRBGM = {
    playmusic: () => {
        // audio.volume = 1;
        audio.loop = true;
        audio.play();
    },
    stopmusic: () => {
        audio.pause();
        audio.currentTime = 0;
    },
    setVolume: (volume: number) => {
        audio.volume = volume * 0.01;
    },
};

export default WRBGM;