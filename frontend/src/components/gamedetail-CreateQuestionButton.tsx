import { useState } from "react"
import QuestionForm from "./question-form";
import { QuestionAttributes } from "../dto/question.dto";
interface CreateQuestionButtonProps {
    updateQuestionList: (newQuestion: QuestionAttributes) => void;
  }
export default function CreateQuestionButton({updateQuestionList}:CreateQuestionButtonProps):JSX.Element{
    
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const handleSetIsCreatingOn = () => {
        setIsCreating(true);
    }
    const handleSetIsCreatingOff = () => {
        setIsCreating(false);
    }

    return(
        <>
            <div className="flex w-full justify-center items-center">
                {/* <div className="text-[#263157] w-60 text-xl flex justify-center items-center"><span className="w-full">Questions</span></div> */}
                <button onClick={handleSetIsCreatingOn} className="text-[#EDEFF7] text-xl bg-[#303C6C] px-10 py-4 rounded-xl transition-all duration-150 hover:bg-[#202848] hover:text[#D2FDFF] shadow-md font-bold"><span className="mr-3">+</span>Add Question</button>
            </div>
            {isCreating && <QuestionForm onClose={handleSetIsCreatingOff} updateQuestionList={updateQuestionList}/>}
        </>
        
    )
}