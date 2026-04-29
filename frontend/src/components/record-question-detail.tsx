import { useEffect, useState } from "react";
import { HardestQuestion, QuestionsDetails, RecordData } from "../dto/record.dto"
import { RiArrowDownSLine } from "react-icons/ri";
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import axios from "axios";
import { API_URL } from "../config/config";
import Cookie from 'js-cookie';
interface Props {
    questiondetails:QuestionsDetails[];
    recordid:string;
}
export default function RecordQuestionDetail({questiondetails,recordid}:Props):JSX.Element{
    // const [activeQuestion, setActiveQuestion] = useState('');
    const token = Cookie.get('token');
    const [type, setType] = useState('');

    const handleActive = (uuid:string, type:string) =>{
        // setActiveQuestion(uuid);
        setType(type);
        setDropDown(false);
        
    }
    const [innerHeight, setInnerHeight] = useState(0);
    // useEffect(()=>{
    //     const container1 = document.getElementById('container1');
    //     const container2 = document.getElementById('container2');
        
    //     if(container1 && container2){
    //         if(questiondetails.length === 0){
    //             container1.style.display = 'none';
    //             container2.style.display = 'none';
    //         }
    //         else{
    //             container1.style.display = 'block';
    //             container2.style.display = 'block';
    //         }
    //         const firstcontainerheight = container1.offsetHeight;
    //         console.log("THE FIRSTCONTAINER HEIGHT", firstcontainerheight);
    //         let secondDivHeight = firstcontainerheight + (-20);
    //         if(secondDivHeight < 300){
    //             secondDivHeight = 400;
    //         }
    //         setInnerHeight(secondDivHeight*0.7);
    //         container2.style.height = `${secondDivHeight}px`;
    //     }
    // },[questiondetails,type]);

    const [phonemode, setPhoneMode] = useState(false);
    useEffect(() => {
      function checkWidth() {
          const width = window.innerWidth;
          if (width >= 550) {
              setPhoneMode(false);
          }else{
              setPhoneMode(true);
          }
      }
      checkWidth();
      window.addEventListener('resize', checkWidth);
      return () => {
      window.removeEventListener('resize', checkWidth);
      };
    }, []);
    const [dropdown, setDropDown] = useState(false);
    const [selectedOption, setSelectedOption] = useState(0);
    const [op1, setOp1] = useState(0);
    const [op2, setOp2] = useState(0);
    const [op3, setOp3] = useState(0);
    const [op4, setOp4] = useState(0);
    const [mostOp, setMostOp] = useState<string[]>([]);
    const [correctness, setCorrectness] = useState(0);

    const [chart1, setChart1] = useState<{option:string, player:number}[]>([{option:'',player:0}]);
    const [chart2, setChart2] = useState<{name:string, player:number}[]>([{name:'',player:0}]);
    
    const [playerrank, setPlayerRank] = useState<{username:string,correctness:number}[]>([]);


    useEffect(()=>{
        handleSelect(selectedOption);
        const getData = async () =>{
            setPlayerRank([]);
            try {
                const response = await axios.get(API_URL+`/record/data/${recordid}`, {headers:{Authorization:`Bearer ${token}`,"ngrok-skip-browser-warning": "69420"}});
                for(const player of response.data){
                    let newPlayer = {username:player.username, correctness:0};
                    for(const question of player.questionAndAnswers){
                        if(question.answer === question.playeranswer){
                            newPlayer.correctness++;
                        }
                    }
                    setPlayerRank(prevState => [...prevState, newPlayer])
                }
            } catch (error) {
                console.log(error);
            }
        }

        getData();
    },[questiondetails]);
    
    const [hardestquestion, setHardestQuestion] = useState<HardestQuestion>({
        uuid:'', 
        questiontitle: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: -1,
        correctanswer:-1});
    const getHardestQuestion = () => {
        setHardestQuestion(prevHardestQuestion => ({
            uuid: '',
            questiontitle: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            answer: -1,
            correctanswer: -1
        }));
    
        for (const each of questiondetails) {
            const data = Object.assign(each.question, { correctanswer: each.correctPlayers.length });
            const currentTotalCorrectPlayer = each.correctPlayers.length;
    
            setHardestQuestion(prevHardestQuestion => {
                if (prevHardestQuestion.correctanswer === -1 || currentTotalCorrectPlayer < prevHardestQuestion.correctanswer) {
                    return data;
                }
                return prevHardestQuestion;
            });
        }
    };
    
    useEffect(() => {
        getHardestQuestion();
    }, [questiondetails]);

    const handleSelect = (option:number) => {
        console.log('====click====');
        setChart1([]);
        setChart2([]);
        setMostOp([]);
        setDropDown(false);
        setSelectedOption(option);
        let Op1Counter = 0;
        let Op2Counter = 0;
        let Op3Counter = 0;
        let Op4Counter = 0;
        for(const player of questiondetails[option].correctPlayers ){
            if(player.playeranswer === 1) Op1Counter++;
            if(player.playeranswer === 2) Op2Counter++;
            if(player.playeranswer === 3) Op3Counter++;
            if(player.playeranswer === 4) Op4Counter++;
        }
        for(const player of questiondetails[option].incorrectPlayers ){
            if(player.playeranswer === 1) Op1Counter++;
            if(player.playeranswer === 2) Op2Counter++;
            if(player.playeranswer === 3) Op3Counter++;
            if(player.playeranswer === 4) Op4Counter++;
        }
        setOp1(Op1Counter);
        setOp2(Op2Counter);
        setOp3(Op3Counter);
        setOp4(Op4Counter);
        const maxOption = Math.max(Op1Counter, Op2Counter, Op3Counter, Op4Counter);
        if (maxOption === Op1Counter) {
            console.log('most1');
            setMostOp((prevMostOp) => [...prevMostOp, '1']);
        } 
        if (maxOption === Op2Counter) {
            console.log('most2');
            setMostOp((prevMostOp) => [...prevMostOp, '2']);
        }
        if (maxOption === Op3Counter) {
            console.log('most3');
            setMostOp((prevMostOp) => [...prevMostOp, '3']);
        }
        if (maxOption === Op4Counter) {
            console.log('most4');
            setMostOp((prevMostOp) => [...prevMostOp, '4']);  
        }
        
        //chart 1
        const chart1 = [
            { option: 'Option 1', player: Op1Counter },
            { option: 'Option 2', player: Op2Counter },
            { option: 'Option 3', player: Op3Counter },
            { option: 'Option 4', player: Op4Counter },
            { option: 'No Answer', player: questiondetails[option].noanswerPlayers.length}
        ];
        setChart1(chart1);

        //chart 2
        const chart2 = [
            { name:'Correct', player:questiondetails[option].correctPlayers.length},
            { name:'Incorrect', player:questiondetails[option].incorrectPlayers.length},
            { name:'No Answer', player:questiondetails[option].noanswerPlayers.length}
        ]
        setChart2(chart2);

        const totalplayer = questiondetails[option].correctPlayers.length + questiondetails[option].incorrectPlayers.length + questiondetails[option].noanswerPlayers.length;
        setCorrectness((questiondetails[option].correctPlayers.length*100)/totalplayer);
        handleActive(questiondetails[option].question.uuid, 'correct');
    };
    return(
        <div className="flex flex-col">
            <div className=" flex flex-col w-full h-[350px] px-10 py-5 mb-5 bg-[#FAFAFA] rounded-3xl shadow-md shadow-[#303C6C] text-[#263157]">
                <div className="text-center font-bold text-lg">Overall Player Ranking</div>
                <div className="w-full bg-[#303C6C] h-[2px] my-2"></div>
                <div className="flex items-center justify-center w-full h-full">
                    <ResponsiveContainer width="95%" height="85%">    
                        <BarChart data={playerrank}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="username" interval={0} tick={phonemode?{ fontSize: 9 }:{ }} dy={phonemode?10:0} angle={phonemode?-35:0}/>
                            <YAxis tick={phonemode?{ fontSize: 12 }:{ }}>
                                <Label value="Correct Answers" dx={phonemode?-10:-20} dy={0} angle={-90} style={phonemode?{ fontSize: 12 }:{ }}/>
                            </YAxis>
                            <Tooltip />
                            <Bar dataKey="correctness" fill="#303C6C" barSize={phonemode?25:50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* <div className="w-full px-10 py-5 mb-5 bg-[#263157] rounded-3xl shadow-md flex flex-col justify-center items-center text-[#FAFAFA]">
                <div className="text-center font-bold text-lg">Hardest Question</div>
                <div className="w-full bg-[#FAFAFA] h-[2px] my-2"></div>
                <div className=" w-11/12 flex flex-col justify-evenly bg-[#FAFAFA] px-10 py-5 mb-5 rounded-3xl font-bold">
                    <div className=" break-words rounded-2xl flex justify-center items-center pb-2"><span className="w-full">{hardestquestion.questiontitle}</span></div>
                    <div className="flex gap-3 my-1 items-center">
                        <div className={`w-4 h-4 rounded-lg  ${hardestquestion.answer === 1? 'bg-[#5DECBF]' : 'bg-[#BDC3D5]'}`}></div>
                        <div className="flex-1 px-3 rounded-2xl flex justify-center items-center overflow-auto break-words"><span className="w-full">{hardestquestion.option1}</span></div>
                    </div>

                    <div className="flex gap-3 my-1 items-center">
                        <div className={`w-4 h-4 rounded-lg  ${hardestquestion.answer === 2? 'bg-[#5DECBF]' : 'bg-[#BDC3D5]'}`}></div>
                        <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center overflow-auto break-words"><span className="w-full">{hardestquestion.option2}</span></div>
                    </div>

                    <div className="flex gap-3 my-1 items-center">
                        <div className={`w-4 h-4 rounded-lg  ${hardestquestion.answer === 3? 'bg-[#5DECBF]' : 'bg-[#BDC3D5]'}`}></div>
                        <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center overflow-auto break-words"><span className="w-full">{hardestquestion.option3}</span></div>
                    </div>

                    <div className="flex gap-3 my-1 items-center">
                        <div className={`w-4 h-4 rounded-lg  ${hardestquestion.answer === 4? 'bg-[#5DECBF]' : 'bg-[#BDC3D5]'}`}></div>
                        <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center overflow-auto break-words"><span className="w-full">{hardestquestion.option4}</span></div>
                    </div>
                </div>
                
            </div> */}
        
            <div onClick={()=>{setDropDown(!dropdown)}} className= {`cursor-pointer flex justify-between items-center w-full bg-[#FAFAFA] px-5 py-2 rounded-lg font-semibold border-2 shadow-sm shadow-[#303C6C] border-[#303C6C] ${dropdown?' border-opacity-100':'border-opacity-50'}`}>
                Question {selectedOption+1} : {questiondetails[selectedOption].question.questiontitle} 
                <RiArrowDownSLine className="text-xl " />
            </div>
            <div className="relative w-full">
                {dropdown && (
                    <div className=" z-10 absolute w-full mt-2 bg-[#FAFAFA] rounded-lg border-2 border-[#303C6C] py-2 shadow-lg shadow-[#303C6C]">
                        {questiondetails.map((each, index)=>(
                            <div key={index}>
                                <div  onClick={()=>{handleSelect(index)}} className={` cursor-pointer w-full px-5 py-2 hover:bg-[#F3F3F3] ${index === selectedOption?'font-semibold':''}`}>Question {index+1} : {each.question.questiontitle}</div>
                                {index+1 !== questiondetails.length && (
                                    <div className="w-full bg-[#303C6C] h-[2px] opacity-50"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex max-[550px]:flex-col max-[550px]:ustify-center max-[550px]:items-center mt-5">
                <div className="flex flex-1 w-[350px] flex-col">
                    <div className=" flex flex-col justify-evenly bg-[#FAFAFA] px-10 py-5 mb-5 rounded-3xl shadow-md shadow-[#303C6C] font-bold">
                        <div className=" break-words rounded-2xl text-[#263157] flex justify-center items-center pb-2"><span className="w-full">{questiondetails[selectedOption].question.questiontitle}</span></div>
                        <div className="flex gap-3 my-1 items-center">
                            <div className={`w-4 h-4 rounded-lg  ${questiondetails[selectedOption].question.answer === 1? 'bg-[#5DECBF]' : 'bg-[#BDC3D5]'}`}></div>
                            <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center overflow-auto break-words"><span className="w-full">{questiondetails[selectedOption].question.option1}</span></div>
                        </div>

                        <div className="flex gap-3 my-1 items-center">
                            <div className={`w-4 h-4 rounded-lg  ${questiondetails[selectedOption].question.answer === 2? 'bg-[#5DECBF]' : 'bg-[#BDC3D5]'}`}></div>
                            <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center overflow-auto break-words"><span className="w-full">{questiondetails[selectedOption].question.option2}</span></div>
                        </div>

                        <div className="flex gap-3 my-1 items-center">
                            <div className={`w-4 h-4 rounded-lg  ${questiondetails[selectedOption].question.answer === 3? 'bg-[#5DECBF]' : 'bg-[#BDC3D5]'}`}></div>
                            <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center overflow-auto break-words"><span className="w-full">{questiondetails[selectedOption].question.option3}</span></div>
                        </div>

                        <div className="flex gap-3 my-1 items-center">
                            <div className={`w-4 h-4 rounded-lg  ${questiondetails[selectedOption].question.answer === 4? 'bg-[#5DECBF]' : 'bg-[#BDC3D5]'}`}></div>
                            <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center overflow-auto break-words"><span className="w-full">{questiondetails[selectedOption].question.option4}</span></div>
                        </div>
                        
                    </div>
                    <div className="flex bg-[#FAFAFA] h-[300px] flex-grow px-10 py-5 mb-5 rounded-3xl shadow-md shadow-[#303C6C]">
                            <div className="flex flex-col w-full text-[#263157]">
                                <div className="text-center font-bold mb-1">Distribution of Player Choices</div>
                                <div className="text-center text-xs">Most chosen option by players : {mostOp.map((each, index)=>(<span key={index} className="font-semibold px-2 py-[2px] mx-[1px] rounded-lg text-[#FAFAFA] bg-[#303C6C]">Option {each}</span>))}</div>
                                <div className="w-full bg-[#303C6C] h-[2px] my-2"></div>
                                <div className="flex justify-evenly max-[550px]:text-xs">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div>Option 1</div>
                                        <div className="max-[550px]:px-4 min-[550px]:px-7 py-[1px] font-semibold rounded-xl shadow-inner shadow-[#303C6C]">{op1}</div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div>Option 2</div>
                                        <div className="max-[550px]:px-4 min-[550px]:px-7 py-[1px] font-semibold rounded-xl shadow-inner shadow-[#303C6C]">{op2}</div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div>Option 3</div>
                                        <div className="max-[550px]:px-4 min-[550px]:px-7 py-[1px] font-semibold rounded-xl shadow-inner shadow-[#303C6C]">{op3}</div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div>Option 4</div>
                                        <div className="max-[550px]:px-4 min-[550px]:px-7 py-[1px] font-semibold rounded-xl shadow-inner shadow-[#303C6C]">{op4}</div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <div>No Answer</div>
                                        <div className="max-[550px]:px-4 min-[550px]:px-7 py-[1px] font-semibold rounded-xl shadow-inner shadow-[#303C6C]">{questiondetails[selectedOption].noanswerPlayers.length}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center w-full h-full">
                                    <ResponsiveContainer width="95%" height="90%">    
                                        <BarChart data={chart1}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="option" interval={0} tick={phonemode?{ fontSize: 9 }:{ }} dy={phonemode?10:0} angle={phonemode?-35:0}/>
                                            <YAxis tick={phonemode?{ fontSize: 12 }:{ }}>
                                                <Label value="Number Of Player" dx={phonemode?-10:-20} dy={0} angle={-90} style={phonemode?{ fontSize: 12 }:{ }}/>
                                            </YAxis>
                                            <Tooltip />
                                            <Bar dataKey="player" fill="#303C6C" barSize={phonemode?25:50} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                
                            </div>
                    </div>
                </div>
                <div className="flex flex-col text-[#263157] max-[550px]:w-[350px] min-[550px]:w-[400px] h-[800px] bg-[#FAFAFA] rounded-3xl shadow-md shadow-[#303C6C] p-5 mb-5 min-[550px]:ml-5">
                        <div className="font-bold text-center">Distribution of Response Accuracy</div>
                        <div className="text-xs text-center ">{correctness.toFixed(2)}% of players answered correctly</div>
                        <div className="flex bg-[#FAFAFA] rounded-2xl p-2 justify-evenly w-full h-12 mx-auto my-3 gap-1 shadow-inner shadow-[#303C6C] font-bold">
                            <button onClick={()=>{handleActive(questiondetails[selectedOption].question.uuid, 'correct')}} className={` flex-1 rounded-xl px-2 py-1 max-[550px]:text-[10px] min-[550px]:text-xs transition-all duration-200 ${type === 'correct' ? 'bg-[#8E96B2] shadow-md shadow-[#303C6C]' :'hover:bg-[#D9DBE5]'}`}>Correct : {questiondetails[selectedOption].correctPlayers.length}</button>
                            <button onClick={()=>{handleActive(questiondetails[selectedOption].question.uuid, 'incorrect')}} className={` flex-1 rounded-xl px-2 py-1 max-[550px]:text-[10px] min-[550px]:text-xs transition-all duration-200 ${type === 'incorrect' ? 'bg-[#8E96B2] shadow-md shadow-[#303C6C]' :'hover:bg-[#D9DBE5]'}`}>Incorrect : {questiondetails[selectedOption].incorrectPlayers.length}</button>
                            <button onClick={()=>{handleActive(questiondetails[selectedOption].question.uuid, 'noanswer')}} className={` flex-1 rounded-xl px-2 py-1 max-[550px]:text-[10px] min-[550px]:text-xs transition-all duration-200 ${type === 'noanswer' ? 'bg-[#8E96B2] shadow-md shadow-[#303C6C]' :'hover:bg-[#D9DBE5]'}`}>NoAnswer : {questiondetails[selectedOption].noanswerPlayers.length}</button>
                        </div>
                        
                        {/* )} */}
                        {type === 'correct' &&(
                            <div className="flex flex-col justify-center items-center font-bold ">
                                {/* <div className="bg-[#F7F7F7] rounded-lg shadow-md px-5 py-2 mb-4">Question {selectedOption+1}</div> */}
                                {/* <div className="mb-2">Correct</div> */}
                                <div className=" w-full flex justify-center items-center">
                                    <div className  ="bg-[#202848] w-full h-[2px] rounded-md"></div>
                                </div>
                                <div className={`overflow-y-auto hide-scroll h-[350px] px-2`}>
                                    <div>
                                    {questiondetails[selectedOption].correctPlayers.length < 1 && (
                                        <div className="flex h-full justify-center items-center">
                                            <div className=" text-gray-400 font-bold text-center">No Players Are Found</div>
                                        </div>
                                    )}
                                    </div>
                                    {questiondetails[selectedOption].correctPlayers.map((player,index)=>(
                                        <div key={index} className="bg-[#F7F7F7] rounded-2xl shadow-md shadow-[#303C6C] w-[300px] h-[40px] flex justify-center items-center my-2">{player.username.length > 25 ? `${player.username.slice(0, 25)}...` : player.username}</div>
                                    ))}
                                </div>
                            </div>
                            //add graph chart if you want
                        )}
                        {type === 'incorrect' &&(
                            <div className="flex flex-col justify-center items-center font-bold ">
                                {/* <div className="bg-[#F7F7F7] rounded-lg shadow-md px-5 py-2 mb-4">Question {selectedOption+1}</div> */}
                                {/* <div className="mb-2">Incorrect</div> */}
                                <div className="w-full flex justify-center items-center">
                                    <div className  ="bg-[#202848] w-full h-[2px] rounded-md"></div>
                                </div>
                                <div className={`overflow-y-auto hide-scroll h-[350px] px-2`}>
                                    {questiondetails[selectedOption].incorrectPlayers.map((player,index)=>(
                                        <div key={index}  className="bg-[#F7F7F7] rounded-2xl shadow-md shadow-[#303C6C] w-[300px] h-[40px] flex justify-center items-center my-2">{player.username.length > 25 ? `${player.username.slice(0, 25)}...` : player.username}</div>
                                    ))}
                                </div>
                            </div>
                            //add graph chart if you want
                        )}
                        {type === 'noanswer' &&(
                            <div className="flex flex-col justify-center items-center font-bold">
                                {/* <div className="bg-[#F7F7F7] rounded-lg shadow-md px-5 py-2 mb-4">Question {selectedOption+1}</div> */}
                                {/* <div className="mb-2">NoAnswer</div> */}
                                <div className="w-full flex justify-center items-center">
                                    <div className  ="bg-[#202848] w-full h-[2px] rounded-md"></div>
                                </div>
                                <div className={`overflow-y-auto hide-scroll h-[350px] px-2`}>
                                    {questiondetails[selectedOption].noanswerPlayers.map((player,index)=>(
                                        <div key={index} className="bg-[#F7F7F7] rounded-2xl shadow-md shadow-[#303C6C] w-[300px] h-[40px] flex justify-center items-center my-2">{player.username.length > 25 ? `${player.username.slice(0, 25)}...` : player.username}</div>
                                    ))}
                                </div>
                            </div>
                            //add graph chart if you want
                        )}
                        <div className="flex justify-center items-center">
                            <div className  ="bg-[#202848] w-full h-[2px] rounded-md"></div>
                        </div>
                        <div className="flex items-center justify-center w-full h-full">
                            <ResponsiveContainer width="95%" height="90%">    
                                <BarChart data={chart2}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" interval={0} tick={phonemode?{ fontSize: 12 }:{ }} dy={phonemode?10:0} />
                                    <YAxis tick={phonemode?{ fontSize: 12 }:{ }}>
                                        <Label value="Number Of Player" dx={phonemode?-10:-20} dy={0} angle={-90} style={phonemode?{ fontSize: 12 }:{ }}/>
                                    </YAxis>
                                    <Tooltip />
                                    <Bar dataKey="player" fill="#303C6C" barSize={phonemode?25:50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                </div>
            </div>
            {/* <div>NEXT</div>
            <div>NEXT 2</div> */}
           {/* <div className="flex max-[550px]:flex-col">
                <div id="container1" className=" flex-1">   
                    {questiondetails.map((each,index)=>(
                        <div key={index} className="bg-[#FAFAFA] px-10 py-5 min-[550px]:mr-5 mb-5 rounded-3xl shadow-lg font-bold">
                            <div className="flex justify-between mb-1 gap-1">
                                <div className="flex justify-center items-center text-[#263157]  "><span className=" w-full">{index+1}.</span></div>
                                <div className="flex-1 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{each.question.questiontitle}</span></div>
                            </div>
                            <div className="flex gap-3 my-1 items-center">
                                <div className={`w-4 h-4 rounded-lg  ${each.question.answer === 1? 'bg-[#5DECBF]' : 'bg-[#BDC3D5]'}`}></div>
                                <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{each.question.option1}</span></div>
                            </div>

                            <div className="flex gap-3 my-1 items-center">
                                <div className={`w-4 h-4 rounded-lg  ${each.question.answer === 2? 'bg-[#5DECBF]' : 'bg-[#BDC3D5]'}`}></div>
                                <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{each.question.option2}</span></div>
                            </div>

                            <div className="flex gap-3 my-1 items-center">
                                <div className={`w-4 h-4 rounded-lg  ${each.question.answer === 3? 'bg-[#5DECBF]' : 'bg-[#BDC3D5]'}`}></div>
                                <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{each.question.option3}</span></div>
                            </div>

                            <div className="flex gap-3 my-1 items-center">
                                <div className={`w-4 h-4 rounded-lg  ${each.question.answer === 4? 'bg-[#5DECBF]' : 'bg-[#BDC3D5]'}`}></div>
                                <div className="flex-1 px-3 rounded-2xl text-[#263157] flex justify-center items-center"><span className="w-full">{each.question.option4}</span></div>
                            </div>
                            {phonemode?(
                                <div className="flex border-2 border-[#8E96B2] bg-[#FAFAFA] rounded-3xl p-1 justify-evenly w-[260px] h-12 mx-auto mt-2 gap-1 shadow-lg">
                                    <button onClick={()=>{handleActive(each.question.uuid, 'correct')}} className={` w-1/3 rounded-3xl px-2 py-1 text-[10px] transition-all duration-200 ${activeQuestion === each.question.uuid && type === 'correct' ? 'bg-[#8E96B2] shadow-lg' :'hover:bg-[#D9DBE5]'}`}>Correct : {each.correctPlayers.length}</button>
                                    <button onClick={()=>{handleActive(each.question.uuid, 'incorrect')}} className={` w-1/3 rounded-3xl px-2 py-1 text-[10px] transition-all duration-200 ${activeQuestion === each.question.uuid && type === 'incorrect' ? 'bg-[#8E96B2] shadow-lg' :'hover:bg-[#D9DBE5]'}`}>Incorrect : {each.incorrectPlayers.length}</button>
                                    <button onClick={()=>{handleActive(each.question.uuid, 'noanswer')}} className={` w-1/3 rounded-3xl px-2 py-1 text-[10px] transition-all duration-200 ${activeQuestion === each.question.uuid && type === 'noanswer' ? 'bg-[#8E96B2] shadow-lg' :'hover:bg-[#D9DBE5]'}`}>NoAnswer : {each.noanswerPlayers.length}</button>
                                </div>
                            ):(
                                <div className="flex border-2 border-[#8E96B2] bg-[#FAFAFA] rounded-3xl p-1 justify-evenly w-[400px] h-12 mx-auto mt-2 gap-1 shadow-lg">
                                                <button onClick={()=>{handleActive(each.question.uuid, 'correct')}} className={` flex-1 rounded-3xl px-2 py-1 text-xs transition-all duration-200 ${activeQuestion === each.question.uuid && type === 'correct' ? 'bg-[#8E96B2] shadow-lg' :'hover:bg-[#D9DBE5]'}`}>Correct : {each.correctPlayers.length}</button>
                                    <button onClick={()=>{handleActive(each.question.uuid, 'incorrect')}} className={` flex-1 rounded-3xl px-2 py-1 text-xs transition-all duration-200 ${activeQuestion === each.question.uuid && type === 'incorrect' ? 'bg-[#8E96B2] shadow-lg' :'hover:bg-[#D9DBE5]'}`}>Incorrect : {each.incorrectPlayers.length}</button>
                                    <button onClick={()=>{handleActive(each.question.uuid, 'noanswer')}} className={` flex-1 rounded-3xl px-2 py-1 text-xs transition-all duration-200 ${activeQuestion === each.question.uuid && type === 'noanswer' ? 'bg-[#8E96B2] shadow-lg' :'hover:bg-[#D9DBE5]'}`}>NoAnswer : {each.noanswerPlayers.length}</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {phonemode?(
                    <div id="container3" className=" w-full bg-[#FAFAFA] rounded-3xl shadow-lg p-5 mb-5">
                        {questiondetails.map((each,index)=>(
                            <div key={index}>
                                {activeQuestion === each.question.uuid && type === 'correct' &&(
                                    <div className="flex flex-col justify-center items-center font-bold ">
                                        <div className="bg-[#F7F7F7] rounded-lg shadow-md px-5 py-2 mb-2">Question {index+1}</div>
                                        <div className="mb-1">Correct</div>
                                        <div className="flex justify-center items-center">
                                            <div className  ="bg-[#202848] w-[300px] h-[2px] rounded-md"></div>
                                        </div>
                                        <div className={`overflow-y-auto hide-scroll`} style={{ height: `${innerHeight}px`}}>
                                            {each.correctPlayers.map((player,index)=>(
                                                <div key={index}  className="bg-[#F7F7F7] rounded-2xl shadow-md w-[300px] h-[40px] flex justify-center items-center my-1">{player.username.length > 25 ? `${player.username.slice(0, 25)}...` : player.username}</div>
                                            ))}
                                        </div>
                                    </div>
                                    //add graph chart if you want
                                )}
                                {activeQuestion === each.question.uuid && type === 'incorrect' &&(
                                    <div className="flex flex-col justify-center items-center font-bold ">
                                        <div className="bg-[#F7F7F7] rounded-lg shadow-md px-5 py-2 mb-2">Question {index+1}</div>
                                        <div className="mb-1">Incorrect</div>
                                        <div className="flex justify-center items-center">
                                            <div className  ="bg-[#202848] w-[300px] h-[2px] rounded-md"></div>
                                        </div>
                                        <div className={`overflow-y-auto hide-scroll`} style={{ height: `${innerHeight}px`}}>
                                            {each.incorrectPlayers.map((player,index)=>(
                                                <div key={index}  className="bg-[#F7F7F7] rounded-2xl shadow-md w-[300px] h-[40px] flex justify-center items-center my-1">{player.username.length > 25 ? `${player.username.slice(0, 25)}...` : player.username}</div>
                                            ))}
                                        </div>
                                    </div>
                                    //add graph chart if you want
                                )}
                                {activeQuestion === each.question.uuid && type === 'noanswer' &&(
                                    <div className="flex flex-col justify-center items-center font-bold">
                                        <div className="bg-[#F7F7F7] rounded-lg shadow-md px-5 py-2 mb-2">Question {index+1}</div>
                                        <div className="mb-1">NoAnswer</div>
                                        <div className="flex justify-center items-center">
                                            <div className  ="bg-[#202848] w-[300px] h-[2px] rounded-md"></div>
                                        </div>
                                        <div className={`overflow-y-auto hide-scroll`} style={{ height: `${innerHeight}px`}}>
                                            {each.noanswerPlayers.map((player,index)=>(
                                                <div key={index} className="bg-[#F7F7F7] rounded-2xl shadow-md w-[300px] h-[40px] flex justify-center items-center my-1">{player.username.length > 25 ? `${player.username.slice(0, 25)}...` : player.username}</div>
                                            ))}
                                        </div>
                                    </div>
                                    //add graph chart if you want
                                )}
                            </div>
                        ))}
                    </div>
                ):(
                    <div id="container2" className=" w-[400px] bg-[#FAFAFA] rounded-3xl shadow-lg p-5 mb-5">
                        {questiondetails.map((each,index)=>(
                            <div key={index}>
                                {activeQuestion === each.question.uuid && type === 'correct' &&(
                                    <div className="flex flex-col justify-center items-center font-bold ">
                                        <div className="bg-[#F7F7F7] rounded-lg shadow-md px-5 py-2 mb-4">Question {index+1}</div>
                                        <div className="mb-1">Correct</div>
                                        <div className="flex justify-center items-center">
                                            <div className  ="bg-[#202848] w-[350px] h-[2px] rounded-md"></div>
                                        </div>
                                        <div className={`overflow-y-auto hide-scroll`} style={{ height: `${innerHeight}px`}}>
                                            {each.correctPlayers.map((player,index)=>(
                                                <div key={index}  className="bg-[#F7F7F7] rounded-2xl shadow-md w-[300px] h-[40px] flex justify-center items-center my-1">{player.username.length > 25 ? `${player.username.slice(0, 25)}...` : player.username}</div>
                                            ))}
                                        </div>
                                    </div>
                                    //add graph chart if you want
                                )}
                                {activeQuestion === each.question.uuid && type === 'incorrect' &&(
                                    <div className="flex flex-col justify-center items-center font-bold ">
                                        <div className="bg-[#F7F7F7] rounded-lg shadow-md px-5 py-2 mb-4">Question {index+1}</div>
                                        <div className="mb-1">Incorrect</div>
                                        <div className="flex justify-center items-center">
                                            <div className  ="bg-[#202848] w-[350px] h-[2px] rounded-md"></div>
                                        </div>
                                        <div className={`overflow-y-auto hide-scroll`} style={{ height: `${innerHeight}px`}}>
                                            {each.incorrectPlayers.map((player,index)=>(
                                                <div key={index}  className="bg-[#F7F7F7] rounded-2xl shadow-md w-[300px] h-[40px] flex justify-center items-center my-1">{player.username.length > 25 ? `${player.username.slice(0, 25)}...` : player.username}</div>
                                            ))}
                                        </div>
                                    </div>
                                    //add graph chart if you want
                                )}
                                {activeQuestion === each.question.uuid && type === 'noanswer' &&(
                                    <div className="flex flex-col justify-center items-center font-bold">
                                        <div className="bg-[#F7F7F7] rounded-lg shadow-md px-5 py-2 mb-4">Question {index+1}</div>
                                        <div className="mb-1">NoAnswer</div>
                                        <div className="flex justify-center items-center">
                                            <div className  ="bg-[#202848] w-[350px] h-[2px] rounded-md"></div>
                                        </div>
                                        <div className={`overflow-y-auto hide-scroll`} style={{ height: `${innerHeight}px`}}>
                                            {each.noanswerPlayers.map((player,index)=>(
                                                <div key={index} className="bg-[#F7F7F7] rounded-2xl shadow-md w-[300px] h-[40px] flex justify-center items-center my-1">{player.username.length > 25 ? `${player.username.slice(0, 25)}...` : player.username}</div>
                                            ))}
                                        </div>
                                    </div>
                                    //add graph chart if you want
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
            </div> */}
        </div>
    )
}
