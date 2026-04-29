import { dotSpinner } from "ldrs";
dotSpinner.register();
export default function LoadingAnimationScreen():JSX.Element{
    return(
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-overlay fixed inset-0 bg-gray-600 opacity-50"></div>
            <div className="modal-container z-50">
                <l-dot-spinner size='40' speed='0.9' color='black'></l-dot-spinner>
            </div>
        </div>
    )
}