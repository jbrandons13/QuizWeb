import ClickSFX from "./click";
import CountDownSFX from "./countdown";
import LBGM from "./loading1";
import PASFX from "./playeranswer";
import PlayerJoinSFX from "./playerjoin";
import PopSFX from "./pop";
import QuestionSFX from "./questionmsc";
import ResultSFX from "./result1";
import ScoreSFX from "./score1";
import StartButtonSFX from "./startbutton";
import Transition1SFX from "./transition1";
import Transition2SFX from "./transition2";
import WRBGM from "./waitingroommusic";

function SoundManager(volume:number){
    WRBGM.setVolume(volume);
    Transition1SFX.setVolume(volume);
    Transition2SFX.setVolume(volume);
    StartButtonSFX.setVolume(volume);
    ScoreSFX.setVolume(volume);
    ResultSFX.setVolume(volume);
    QuestionSFX.setVolume(volume);
    PlayerJoinSFX.setVolume(volume);
    PASFX.setVolume(volume);
    LBGM.setVolume(volume);
    CountDownSFX.setVolume(volume);
    ClickSFX.setVolume(volume);
    PopSFX.setVolume(volume);
}
function TurnOffAllSound(){
    WRBGM.stopmusic();
    Transition1SFX.stopmusic();
    Transition2SFX.stopmusic();
    StartButtonSFX.stopmusic();
    ScoreSFX.stopmusic();
    ResultSFX.stopmusic();
    QuestionSFX.stopmusic();
    PlayerJoinSFX.stopmusic();
    PASFX.stopmusic();
    LBGM.stopmusic();
    CountDownSFX.stopmusic();
    ClickSFX.stopmusic();
    PopSFX.stopmusic();
}

export {SoundManager, TurnOffAllSound};