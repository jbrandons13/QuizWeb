import sound1 from '../musics/question1.mp3';
import sound2 from '../musics/question2.mp3';
import sound3 from '../musics/question3.mp3';

const sounds = [sound1, sound2, sound3];
let audioInstance: HTMLAudioElement | null = null;
let standardvolume = 25;
const QuestionSFX = {
  playmusic: (index:number) => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }
    const randomAudio = new Audio(sounds[index]);
    randomAudio.volume = standardvolume * 0.01;;
    randomAudio.loop = true;
    randomAudio.play();
    audioInstance = randomAudio;
  },
  stopmusic: () => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }
  },
  setVolume: (volume: number) => {
    standardvolume = volume;
    if(audioInstance){
      audioInstance.volume = volume * 0.01;
    }
},
};

export default QuestionSFX;
