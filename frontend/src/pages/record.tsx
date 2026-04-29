import axios from "axios";
import { startTransition, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { API_URL } from "../config/config";
import Cookie from 'js-cookie';
import { GameAttributes } from "../dto/game.dto";
import { QuestionsDetails, RecordAttributes } from "../dto/record.dto";
import SingleRecordDetail from "../components/record-single-detail";
import Navbar from "../components/navbar";
import '../css/record.css';
import GroupRecordDetail from "../components/record-group-detail";
import anime from "animejs";
import RecordQuestionDetail from "../components/record-question-detail";
import { RiDownload2Line } from "react-icons/ri";
import FileSaver from "file-saver";
import Excel from 'exceljs';
export default function RecordPage():JSX.Element{
    const token = Cookie.get('token');
    const navigate = useNavigate();
    const {gameid} = useParams();
    const [game, setGame] = useState<GameAttributes>();
    const [records, setRecords] = useState<RecordAttributes[]>([]);
    const [gametype, setGameType] = useState('');
    const [totalquestion, setTotalQuestion] = useState(-1);

    const [activeRecord, setActiveRecord] = useState('');
    const [activeRecordDate, setActiveRecordDate] = useState('');
    const handleRecord = (recordid:string, date:string) => {
        setActiveRecord(recordid);
        setActiveRecordDate(date);
        if(detail)handleDetailButton();
    }


    useEffect(()=>{
        if(!token){
            navigate('/');
        }
    },[token, navigate]);

    useEffect(()=>{
        const getRecords = async () => {
            try {
                const response = await axios.get(API_URL+`/record/allrecord/${gameid}`,{headers:{Authorization:`Berear ${token}`,"ngrok-skip-browser-warning": "69420"}});
                if(response){
                    setGame(response.data.game);
                    setRecords(response.data.records);
                    setActiveRecord(response.data.records[0].uuid);
                    setActiveRecordDate(`${response.data.records[0].date.slice(11,13)}-${response.data.records[0].date.slice(14,16)} ${response.data.records[0].date.slice(8,10)}-${response.data.records[0].date.slice(5,7)}-${response.data.records[0].date.slice(0,4)}`)
                    setTotalQuestion(response.data.totalquestions);
                    const gametype = response.data.game.groupnumber <= 1 ? 'single' : 'group';
                    setGameType(gametype);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getRecords();
        
    },[]);

    const [detail, setDetail] = useState(false);
    const [questiondetail, setQuestionDetail] = useState<QuestionsDetails[]>([]);
    const handleDetailButton = async () =>{
        
        const detailbutton = document.getElementById('detailbutton');
        if(!detail){
            if(activeRecord){
                const questionresponse = await axios.get(API_URL+`/record/questions/${gameid}/${activeRecord}`,{headers:{Authorization:`Berear ${token}`,"ngrok-skip-browser-warning": "69420"}})
                setQuestionDetail(questionresponse.data);
            }
            anime({
                targets:detailbutton,
                duration:300,
                easing: 'easeOutQuad',
                translateX: '24px'
            })
        }
        if(detail){
            anime({
                targets:detailbutton,
                duration:300,
                easing: 'easeOutQuad',
                translateX: '0'
            })
        }
        setDetail(!detail);
    }

    const handleExcel = async (recordid:string) => {
        try {
            const response = await axios.get(API_URL+`/record/excel/${gameid}/${recordid}`,{headers:{Authorization:`Berear ${token}`,"ngrok-skip-browser-warning": "69420"}});
            const { data: playerData, questions: questionTitles } = response.data;

            // Generate Excel file
            generateExcelFile(playerData, questionTitles);
        } catch (error) {
            console.error('Error generating Excel file:', error);
        }
    };

    const generateExcelFile = (playerData: any[], questionTitles: string[]) => {
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Record');
    
        const titleRow = worksheet.addRow(['TITLE',':',`${game?.gametitle}`]);
        titleRow.eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
        });
        const dateRow = worksheet.addRow(['DATE',':',`${activeRecordDate}`]);
        dateRow.eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
        });
        // Header Row
        const headerRow = worksheet.addRow(['RANK', 'PLAYERID', 'USERNAME', ...questionTitles, 'SCORE']);
        headerRow.eachCell(cell => {
            cell.font = { bold: true };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } }; // Yellow background color
            cell.alignment = { horizontal: 'center' };
        });
    
        // Player Data Rows
        playerData.forEach((player, index) => {
            const row = worksheet.addRow([
                player.ranking,
                player.playerid,
                player.username,
                ...player.answers,
                player.score
            ]);
            const fillColor = index % 2 === 0 ? 'FFFFFF' : 'F2F2F2'; // Alternating row colors
            row.eachCell(cell => {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }; // Add border
                cell.alignment = { horizontal: 'center' }; // Justify content to center
            });
        });
    
        // Auto-fit column widths
        // worksheet.columns.forEach(column => {
        //         column.eachCell((cell: Excel.Cell) => { // Ensure column is defined before calling eachCell
        //             const cellWidth = cell.value ? String(cell.value).length * 1.2 : 10; // Estimate cell width based on content length
        //             column.width = Math.max(column.width || 0, cellWidth); // Set column width to maximum of current width and estimated cell width
        //         });
        // });
    
        // Save Excel file
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `[ ${game?.gametitle} ] ${activeRecordDate}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };
    



    

    return(
        <div className="w-full h-screen bg-[#EDEFF7] overflow-y-auto hide-scroll">
            <Navbar/>
            <div className="flex flex-col max-[550px]:px-5 min-[550px]:px-10 bg-[#EDEFF7] ">
                <div className="text-center font-bold text-2xl mt-5">{game?.gametitle}</div>
                <div
                    className={`flex gap-2 my-5 bg-[#FAFAFA] py-2 px-2 rounded-3xl rounded-b-none overflow-x-auto shadow-md shadow-[#303C6C] ${records.length === 0 ? 'item-center justify-center' : ''}`}
                    onWheel={(e) => {
                        e.currentTarget.scrollLeft += e.deltaY;
                    }}
                    >
                    {records.length !== 0 ? (

                        records.map((record, index) => (
                            <button
                            onClick={() => {
                                handleRecord(record.uuid, `${record.date.slice(11,13)}-${record.date.slice(14,16)} ${record.date.slice(8,10)}-${record.date.slice(5,7)}-${record.date.slice(0,4)}`);
                            }}
                            key={index}
                            className={`flex-shrink-0 w-48 px-5 py-2 rounded-2xl shadow-md transition-all duration-200 ${
                                activeRecord === record.uuid ? 'bg-[#8E96B2] font-bold' : 'bg-[#D9DBE5]'
                            }`}
                            >
                            {record.date.slice(11,16)} {record.date.slice(8,10)}/{record.date.slice(5,7)}/{record.date.slice(0,4)}  
                            </button>
                        ))
                    ) : (
                        <span className="font-bold text-gray-400" >No Records are found</span>
                    )}
                </div>
                <div className="flex justify-between items-center mb-5">
                    <div className="shadow-sm shadow-[#303C6C] w-32 px-[2px] py-[2px] bg-[#FAFAFA] border-2 border-[#FAFAFA] rounded-3xl font-bold">
                        <button id="detailbutton" onClick={handleDetailButton} className="bg-[#202848] text-[#FAFAFA] w-24 py-2 rounded-3xl">{!detail?'Overall':'Details'}</button>
                    </div>
                    <div onClick={()=>{handleExcel(activeRecord)}} className="flex items-center justify-center px-5 py-2 bg-[#FAFAFA] rounded-md gap-2 shadow-md shadow-[#303C6C] active:shadow-inner hover:cursor-pointer max-[550px]:text-xs">
                        <RiDownload2Line />
                        <div>Download Excel File</div>
                    </div>
                </div>
                {!detail?(
                    <div className="">
                        {activeRecord && gametype === 'single' && (<SingleRecordDetail recordid={activeRecord} totalquestion={totalquestion}/>)}
                        {activeRecord && gametype === 'group' && (<GroupRecordDetail recordid={activeRecord} totalquestion={totalquestion}/>)}
                    </div>
                ):(
                    <div>
                        <RecordQuestionDetail questiondetails={questiondetail} recordid={activeRecord}/>
                    </div>
                )}
                
            </div>
        </div>
        
        
    )
}