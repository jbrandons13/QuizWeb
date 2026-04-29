import axios from "axios";
import { useState } from "react"
import { API_URL } from "../config/config";
import { useParams } from "react-router-dom";
import Cookie from 'js-cookie';
import { QuestionAttributes } from "../dto/question.dto";

interface QuestionFormProps {
    onClose: ()=> void;
    updateQuestionList:(newQuestion:QuestionAttributes) => void;
}

export default function QuestionForm({onClose, updateQuestionList}:QuestionFormProps):JSX.Element{
    const {uuid} = useParams();
    const token = Cookie.get("token");

    const [selectedOption, setSelectedOption] = useState<string>("");
    const [isChecked, setIsCHecked] = useState(true);

    const [questiontitle, setQuestionTitle] = useState<string>('');
    const [option1, setOption1] = useState<string>('');
    const [option2, setOption2] = useState<string>('');
    const [option3, setOption3] = useState<string>('');
    const [option4, setOption4] = useState<string>('');
    const [mark1, setMark1] = useState<boolean>(false);
    const [mark2, setMark2] = useState<boolean>(false);
    const [mark3, setMark3] = useState<boolean>(false);
    const [mark4, setMark4] = useState<boolean>(false);
    const [answer, setAnswer] = useState<number>(0);
    const [timer, setTimer] = useState<number>(10);

    const handleQuestionTitle = (e:React.ChangeEvent<HTMLInputElement>) => {
        setQuestionTitle(e.target.value);
    }
    const handleOption1 = (e:React.ChangeEvent<HTMLInputElement>) => {
        setOption1(e.target.value);
    }
    const handleOption2 = (e:React.ChangeEvent<HTMLInputElement>) => {
        setOption2(e.target.value);
    }
    const handleOption3 = (e:React.ChangeEvent<HTMLInputElement>) => {
        setOption3(e.target.value);
    }
    const handleOption4 = (e:React.ChangeEvent<HTMLInputElement>) => {
        setOption4(e.target.value);
    }
    const handleTimer = (e:React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const parsedNumber = parseInt(inputValue, 10);
        setTimer(parsedNumber);
    }

    const handleMarkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
        
        //
        setIsCHecked(true);

        const name = event.target.name;

        switch (name) {
          case 'mark1':
            setAnswer(1);
            setMark1(true);
            setMark2(false);
            setMark3(false);
            setMark4(false);
            break;
          case 'mark2':
            setAnswer(2);
            setMark1(false);
            setMark2(true);
            setMark3(false);
            setMark4(false);
            break;
          case 'mark3':
            setAnswer(3);
            setMark1(false);
            setMark2(false);
            setMark3(true);
            setMark4(false);
            break;
          case 'mark4':
            setAnswer(4);
            setMark1(false);
            setMark2(false);
            setMark3(false);
            setMark4(true);
            break;
          default:
            break;
        }
      };

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        if(selectedOption === ""){
            setIsCHecked(false);
        }
        else{
            try {
                const response = await axios.post(API_URL+`/question/${uuid}`,
                {questiontitle,option1,option2,option3,option4,answer,timer},
                {headers:{Authorization:`Bearer ${token}`,"ngrok-skip-browser-warning": "69420"}});
                console.log("Question Created", response.data);
                updateQuestionList(response.data);
            } catch (error) {
                
            }
            onClose();
        }
        
    }

    return(
        <>
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-overlay fixed inset-0 bg-gray-600 opacity-50"></div>
            <div className="modal-container z-50 flex w-full justify-center items-center">
                <form onSubmit={handleSubmit} className=" flex flex-col w-11/12 bg-[#303C6C] rounded-3xl max-[550px]:p-5 min-[550px]:p-20 ">
                    <div className="flex justify-between max-[550px]:my-1 min-[550px]:my-2">
                        <div className="max-[550px]:text-lg min-[550px]:text-xl flex justify-center items-center text-[#FAFAFA] font-bold "><span>Question :</span></div>
                        <div className="">
                            <label htmlFor="timer" className="text-[#FAFAFA] max-[550px]:text-lg min-[550px]:text-xl mr-4 font-bold">Timer (sec) :</label>
                            <input required type="number" value={timer > 0 ? timer.toString() : ''} onChange={handleTimer} id="timer" className="bg-[#FAFAFA] w-28 h-12 px-3 rounded-2xl text-lg text-center border-2 border-[#263157]" />
                        </div>
                    </div>

                    <input required type="text" onChange={handleQuestionTitle} className="w-full h-12 px-3 min-[550px]:my-2 rounded-2xl bg-[#FAFAFA] text-lg text-[#263157] shadow-md"/>

                    <div className="max-[550px]:my-1 min-[550px]:h-12 flex justify-center items-center max-[550px]:text-lg min-[550px]:text-xl text-[#FAFAFA] font-bold"><span className="w-full">Options :</span></div>

                    <div className="flex gap-3 max-[550px]:my-1 min-[550px]:my-2">
                        <div className=" w-12 h-12 rounded-2xl shadow-md relative">
                            <label className={`w-full h-full absolute top-0 left-0 rounded-2xl bg-[#BDC3D5] transition-all duration-150 ${selectedOption==="mark1"?"bg-[#FF6B6B]":"hover:bg-[#9195A3] "}`}>
                                <input
                                type="radio"
                                name="mark1"
                                value="mark1"
                                checked={selectedOption === "mark1"}
                                onChange={handleMarkChange}
                                className="hidden"
                                />
                            </label>
                        </div>
                        <input required type="text" onChange={handleOption1} className="flex-1 h-12 px-3 rounded-2xl bg-[#FAFAFA] text-lg text-[#263157] shadow-md"  />
                    </div>

                    <div className="flex gap-3 max-[550px]:my-1 min-[550px]:my-2">
                        <div className=" w-12 h-12 rounded-2xl shadow-md relative">
                            <label className={`w-full h-full absolute top-0 left-0 rounded-2xl bg-[#BDC3D5] transition-all duration-150 ${selectedOption==="mark2"?"bg-[#FF6B6B]":"hover:bg-[#9195A3] "}`}>
                                <input
                                type="radio"
                                name="mark2"
                                value="mark2"
                                checked={selectedOption === "mark2"}
                                onChange={handleMarkChange}
                                className="hidden"
                                />
                            </label>
                        </div>
                        <input required type="text" onChange={handleOption2} className="flex-1 h-12 px-3 rounded-2xl bg-[#FAFAFA] text-lg text-[#263157] shadow-md"  />
                    </div>

                    <div className="flex gap-3 max-[550px]:my-1 min-[550px]:my-2">
                        <div className=" w-12 h-12 rounded-2xl shadow-md relative">
                            <label className={`w-full h-full absolute top-0 left-0 rounded-2xl bg-[#BDC3D5] transition-all duration-150 ${selectedOption==="mark3"?"bg-[#FF6B6B]":"hover:bg-[#9195A3] "}`}>
                                <input
                                type="radio"
                                name="mark3"
                                value="mark3"
                                checked={selectedOption === "mark3"}
                                onChange={handleMarkChange}
                                className="hidden"
                                />
                            </label>
                        </div>
                        <input required type="text" onChange={handleOption3} className="flex-1 h-12 px-3 rounded-2xl bg-[#FAFAFA] text-lg text-[#263157] shadow-md"  />
                    </div>

                    <div className="flex gap-3 max-[550px]:my-1 min-[550px]:my-2">
                        <div className=" w-12 h-12 rounded-2xl shadow-md relative">
                            <label className={`w-full h-full absolute top-0 left-0 rounded-2xl bg-[#BDC3D5] transition-all duration-150 ${selectedOption==="mark4"?"bg-[#FF6B6B]":"hover:bg-[#9195A3] "}`}>
                                <input
                                type="radio"
                                name="mark4"
                                value="mark4"
                                checked={selectedOption === "mark4"}
                                onChange={handleMarkChange}
                                className="hidden"
                                />
                            </label>
                        </div>
                        <input required type="text" onChange={handleOption4} className="flex-1 h-12 px-3 rounded-2xl bg-[#FAFAFA] text-lg text-[#263157] shadow-md"  />
                    </div>

                    <div className="flex max-[550px]:flex-col justify-end items-end gap-5 mt-5">
                        {!isChecked && (
                            <div className=" text-red-500 my-auto max-[550px]:w-full max-[550px]:text-center">Please check the correct answer</div>
                        )}
                        <div className="flex gap-5 max-[550px]:w-full">
                            <button onClick={onClose} className="flex text-[#263157] bg-[#F4976C] rounded-3xl text-lg items-center justify-center max-[550px]:w-1/2 min-[550px]:w-40 h-16 shadow-md font-bold transition-all duration-150 hover:bg-[#BD7553]">Cancel</button>
                            <button type="submit" className="flex text-[#263157] bg-[#FBE8A6] rounded-3xl text-lg items-center justify-center max-[550px]:w-1/2 min-[550px]:w-40 h-16 shadow-md font-bold transition-all duration-150 hover:bg-[#C3B27C]">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </>        
    )
}
