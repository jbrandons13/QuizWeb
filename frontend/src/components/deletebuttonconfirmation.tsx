interface DeleteConfirmationProps {
    onConfirm:()=> void;
    onCancel:()=> void;
    text:string;
}

export default function DeleteConfirmation({onConfirm,onCancel,text}:DeleteConfirmationProps):JSX.Element{
    return (
        <>
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-overlay fixed inset-0 bg-gray-600 opacity-50"></div>
            <div className="modal-container z-50">
                <div className="px-24 py-12 rounded-3xl bg-[#F7FFF7] drop-shadow-xl flex flex-col justify-center items-center gap-y-8">
                    <p className="text-[#202848] text-xl font-bold">{text}</p>
                    <div className="flex justify-evenly w-full">
                        <button onClick={onConfirm} className="flex shadow-lg text-[#263157] font-bold bg-[#FBE8A6] rounded-lg text-md items-center justify-center w-24 h-10 transition-all duration-150 hover:bg-[#C3B27C] active:shadow-inner">Confirm</button>
                        <button onClick={onCancel} className="flex shadow-lg text-[#263157] font-bold bg-[#F4976C] rounded-lg text-md items-center justify-center w-24 h-10 transition-all duration-150 hover:bg-[#BD7553] active:shadow-inner">Cancel</button>
                    </div>
                    
                </div>
                
            </div>
        </div>
        </>
    )
}