// import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';
import Player from '../model/mongooseplayermodel';
import Question from '../model/mongoosequestionmodel';
import { AnswerPayload } from '../dto/play.dto';
import { UUIDGenerator } from '../utils/generator';
import Group from '../model/mongoosegroupmodel';
import { setTimeout } from 'timers';
import { PlayerAttributes } from '../model/player.model';
import { PlayerFrontendAttributes } from '../dto/room.dto';

// Function to get unanswered question
const getUnansweredQuestion = async (gameid:string) => {
  return await Question.findOne({ gameid, flag: false });
};

// Function to get player rankings
const getPlayerRankings = async (gameid:string, recordid:string) => {
  const response = await Player.find({ gameid, recordid }).sort({ score: -1 }).exec();
  return response.map((player, index) => ({
    playerid: player.uuid,
    username: player.username,
    score: player.score,
    ranking: index + 1,
  }));
};

const getGroupRankings = async (gameid:string, recordid:string) => {
  const response = await Group.find({ gameid, recordid }).sort({ groupScore: -1 }).exec();
  return response.map((group, index) => ({
    groupid: group.groupid,
    players: group.players,
    groupnumber: group.groupnumber,
    groupscore: group.groupScore,
    ranking: index + 1,
  }));
};

const waitingRoomSocket = (io: Server) => (socket: Socket) => {

  // socket.on('rejoinplay', (data:{recordid:string})=>{
  //   const {recordid} = data;
  //   socket.join(recordid);
  // })

  socket.on('disconnectFromPlay',(data:{recordid:string})=>{
    const {recordid} = data;
    socket.leave(recordid);
  })
  
  socket.on('rejoinwaitingroom', async(data:{recordid:string,gameid:string})=>{
    const {recordid, gameid} = data;
    try{
    const players = await Player.find({ recordid: recordid, gameid: gameid, is_ready:false }, 'uuid username'); // Modify the projection
      const usernames = players.map(player => ({
          uuid: player.uuid,
          username: player.username
      }));
      const totalusernames = usernames.length;
      socket.join(recordid);
      io.to(recordid).emit('updatePlayers', {usernames:usernames, totalusernames:totalusernames, status:'join'});
    } catch (error) {
      console.error('Error Rejoining waiting room:', error);
    }
  })
  
  socket.on('joinWaitingRoom', async (data: {recordid:string, gameid:string, gamecode: string; username: string, uuid: string  }) => {
    const {recordid, gameid, gamecode, username, uuid } = data;
    console.log('player joining the room', gamecode, username, socket.id);
    try {
      console.log('-----------A-------------');
      const player = new Player({
        recordid:recordid,
        gameid:gameid,
        gamecode:gamecode,
        uuid:uuid,
        username:username,
        is_ready:false,
        is_ready_init:false,
        score:0,
        questionsAndAnswers:[]
      })
      await player.save();
      const players = await Player.find({ recordid: recordid, gameid: gameid, is_ready:false }, 'uuid username'); // Modify the projection
      console.log('-----------B------------');
      const usernames = players.map(player => ({
          uuid: player.uuid,
          username: player.username
      }));
      const totalusernames = usernames.length;
      console.log('this is the data that will be send to client', totalusernames);
      socket.join(recordid);
      console.log('-----------C-------------');
      io.to(recordid).emit('updatePlayers', {usernames:usernames, totalusernames:totalusernames, status:'join'});
    } catch (error) {
      console.error('Error joining waiting room:', error);
    }

  });

  socket.on('joinAsCreator', async (data: {recordid:string, gameid: string}) => {
    const {recordid, gameid} = data;
    try {
      console.log('creator joining the room');
      const players = await Player.find({ recordid: recordid, gameid: gameid, is_ready:false }, 'uuid username'); // Modify the projection

      const usernames = players.map(player => ({
          uuid: player.uuid,
          username: player.username
      }));
      const totalusernames = usernames.length;
      socket.join(recordid);
      io.to(recordid).emit('updatePlayers', {usernames:usernames, totalusernames:totalusernames, status:'join'});
    } catch (error) {
      console.error('Error updating players for the creator:', error);
    }

  });

  socket.on('waitingroomresendplayerdata', async (data: {recordid:string, gameid: string})=>{
    const {recordid, gameid} = data;
    try {
      console.log('resend the player data');
      const players = await Player.find({ recordid: recordid, gameid: gameid, is_ready:false }, 'uuid username'); // Modify the projection

      const usernames = players.map(player => ({
          uuid: player.uuid,
          username: player.username
      }));
      const totalusernames = usernames.length;
      socket.join(recordid);
      io.to(recordid).emit('updatePlayers', {usernames:usernames, totalusernames:totalusernames, status:'resend'});
    } catch (error) {
      console.error('Error resending players', error);
    }
  });

  socket.on('disconnectFromRoom', async (data: {recordid:string, gameid: string, username: string, playerid:string, gametype:string, groups:PlayerFrontendAttributes[][] }) => {
    const {recordid, gameid, username,playerid, gametype, groups } = data;
    let prevgroupindex = -1;
    let prevslotindex = -1;
    if(gametype ==='group'){
      groups.forEach((group, groupindex) => {
        const slotindex = group.findIndex((player) => player.uuid === playerid);
        if (slotindex !== -1) {
          group[slotindex] = { username: '', uuid: '' };
          prevgroupindex = groupindex;
          prevslotindex = slotindex;
        }
      });
    }
    try {
      await Player.findOneAndDelete({recordid:recordid, gameid:gameid, username:username});
      const players = await Player.find({ recordid: recordid, gameid: gameid, is_ready:false }, 'uuid username');
      const usernames = players.map(player => ({
        uuid: player.uuid,
        username: player.username
      }));
      const totalusernames = usernames.length;
      socket.leave(recordid);

      if(gametype === 'single'){
        io.to(recordid).emit('updatePlayers', {usernames:usernames, totalusernames:totalusernames, status:'exit'});
      }else if(gametype ==='group'){
        const status = 'remove';
        io.to(recordid).emit('LeaveupdatedSelectionGroup', {usernames, totalusernames, updatedIndex: { groupIndex: prevgroupindex, slotIndex: prevslotindex }, status});
      }
      
    } catch (error) {
      console.error('Error exiting waiting room:', error);
    }

  });

  socket.on('roomIsDeleted', async (data:{recordid:string, gameid:string}) => {
    try {
      const {recordid, gameid} = data;
      await Question.deleteMany({gameid:gameid});
      socket.leave(recordid);
      io.to(recordid).emit('updatePlayers', {usernames:[], totalusernames:0, status:'exit'});
      io.to(recordid).emit('roomDeleted');
      
    } catch (error) {
      
    }
  });

  socket.on('forceclosed', (data:{recordid:string, gameid:string})=>{
    const {recordid, gameid} = data;
    socket.leave(recordid);
    io.to(recordid).emit('updatePlayers', {usernames:[], totalusernames:0, status:'exit'});
    io.to(recordid).emit('roomDeleted');
  })
   
  socket.on('forcenextquestion', (data:{recordid:string}) => {
    const {recordid} = data;
    io.to(recordid).emit('forceNQ');
  })
  socket.on('navigate', (data) => {
    io.to(data.recordid).emit('navigateplayer', data);
  });

  socket.on('ready', async (data:{recordid:string, uuid:string})=>{
    const {recordid,uuid} = data;
    console.log("A PLAYER IS READY");
    await Player.findOneAndUpdate({recordid:recordid,uuid:uuid},{$set:{is_ready_init:true}});
    const response = await Player.count({recordid:recordid, is_ready_init:true});
    io.to(recordid).emit('playercount',{response});
  });

  socket.on('getQuestion', async (data) => {
    const {gametype, gameid, tag, recordid } = data;
    console.log("=============================GETQUESTION=================", tag);
  
    try {
      const totalQuestions = await Question.countDocuments({ gameid });
      const unansweredQuestion = await getUnansweredQuestion(gameid);

      if (unansweredQuestion) {
        // Mark the question as used
        unansweredQuestion.flag = true;
        await unansweredQuestion.save();

        const currentQuestionNumber = totalQuestions - (await Question.countDocuments({ gameid, flag: false }));
        const randomIndex = Math.floor(Math.random() * 3);
        io.to(recordid).emit('newQuestion', {
          question: unansweredQuestion,
          currentQuestionNumber,
          totalQuestions,
          randomIndex
        });
      } else {
        if(gametype === 'single'){
          const result = await getPlayerRankings(gameid, recordid);
          io.to(recordid).emit('SingleResult', { result });
        }else if(gametype === 'group'){
          const result = await getGroupRankings(gameid, recordid);
          io.to(recordid).emit('GroupResult', { result });
        }
        
        
      }
    } catch (error:any) {
      console.error("Error in getQuestion event:", error.message);
      io.to(recordid).emit('error', { message: "An error occurred while processing your request." });
    }
    
  });

  socket.on('getcurrentscore',async (data:{gameid:string,recordid:string,gametype:string})=>{
    const {gameid,recordid,gametype} = data;
    if(gametype === 'single'){
      const result = await getPlayerRankings(gameid, recordid);
      io.to(recordid).emit('currentranking', { result });
    }else if(gametype === 'group'){
      const result = await getGroupRankings(gameid, recordid);
      io.to(recordid).emit('currentgroupranking', { result });
    }
  });

  socket.on('sendAnswer', async (data:AnswerPayload) => {
    const {gametype, question, player} = data;
    const recordid = player.recordid;
    const playerid = player.playerid;
    console.log("=============================sendAnswer=================", player.username);
    let score = 0;
    //calculation
    if(question.answer === player.playeranswer){
      const baseScore = 10; 
      const speedScore = baseScore * (1 - player.duration / question.timer);
      score = Math.max(0, speedScore) * 100 ;
      score = Math.floor(score);  
    }
    const response = await Player.findOneAndUpdate(
      {
        recordid:player.recordid, 
        gameid:player.gameid,
        gamecode:player.gamecode,
        uuid:player.playerid,
        username:player.username
      },
      {
        $push:{
          questionsAndAnswers:{
            uuid:question.uuid,
            questiontitle:question.questiontitle,
            option1:question.option1,
            option2:question.option2,
            option3:question.option3,
            option4:question.option4,
            answer:question.answer,
            playeranswer:player.playeranswer
          }
        },
        $inc:{score:score}
      },
      {new:true}
    ).then()
    .catch((error) => {
      console.error('Error updating player with answer and score:', error); 
    });
    
    // update the group
    if(gametype ==='group'){

      const filter = {
        recordid: player.recordid,
        gameid: player.gameid,
        'players.playerid': player.playerid
      };
      
      const update = { $inc: { 'players.$.score': score } };
      
      try {
        const updatedGroup = await Group.findOneAndUpdate(filter, update, { new: true });
      
        if (updatedGroup) {
          const players = updatedGroup.players;
          const totalScores = players.reduce((acc, player) => acc + player.score, 0);
          // const averageScore = Math.floor(totalScores / players.length );
          
      
          // Update the average score in the group
          const updatedGroupWithAvg = await Group.findByIdAndUpdate(updatedGroup._id, {
            $set: { groupScore: totalScores }
          }, { new: true });
      
          if (updatedGroupWithAvg) {
            console.log('Updated group with new average score:', updatedGroupWithAvg);
            const players =updatedGroupWithAvg.players;
            const groupnumber = updatedGroupWithAvg.groupnumber;
            const groupscore = updatedGroupWithAvg.groupScore;
            io.to(recordid).emit('groupscore', {players,groupnumber,groupscore});
          } else {
            console.log('Error updating average score.');
          }
        } else {
          console.log('Group not found or player not in the group.');
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    }
    
    const totalscore = response? response.score : 0;

    io.to(recordid).emit('score', {playerid, score, totalscore});

  });

  socket.on('getrandomgroup', async (data: { recordid: string, gameid: string, groupcapacity: number }) => {
    const { recordid, gameid, groupcapacity } = data;
    const players = await Player.find({ recordid: recordid, gameid: gameid }, 'uuid username');

    const usernames = players.map(player => ({
        uuid: player.uuid,
        username: player.username
    }));

    const shuffledUsernames = usernames.sort(() => Math.random() - 0.5);

    const totalPlayers = shuffledUsernames.length;
    const totalGroups = Math.ceil(totalPlayers / groupcapacity);
    const playersPerGroup = Math.ceil(totalPlayers / totalGroups);

    const groups = [];
    let startIndex = 0;
    for (let i = 0; i < totalGroups; i++) {
        const endIndex = Math.min(startIndex + playersPerGroup, totalPlayers);
        const subgroup = shuffledUsernames.slice(startIndex, endIndex);
        groups.push(subgroup);
        startIndex = endIndex;
    }

    const score = 0;
    for(let i = 0; i < groups.length; i++){
        const subgroup = groups[i];
        const players = subgroup.map(player => ({
            playerid: player.uuid,
            username: player.username,
            score: score
        }));

        const newGroup = new Group({
            recordid: recordid,
            gameid: gameid,
            groupid: UUIDGenerator(),
            groupnumber: i + 1,
            players: players,
            groupScore: score
        });

        try {
            await newGroup.save();
            console.log('Group created:', newGroup);
        } catch (error) {
            console.error('Error creating group:', error);
        }
    }

    io.to(recordid).emit('sendrandomgroup', { groups });
});

  socket.on('initiateselectiongroup', (data:{recordid:string, totalPlayers:number, groupcapacity:number})=>{
    const {recordid, totalPlayers, groupcapacity} = data;
    const totalGroup = Math.ceil(totalPlayers / groupcapacity);
    const emptygroup = Array.from({ length: totalGroup }, () =>
    Array.from({ length: groupcapacity }, () => ({uuid:'',username:''}))
    );
    io.to(recordid).emit('initiatedselectiongroup', { emptygroup });
  });

  // 11/23 last updated
  socket.on('updateSelectionGroup', async (data:{recordid:string, gameid:string, groups:PlayerFrontendAttributes[][], groupIndex:number,slotIndex:number,username:string,uuid:string}) =>{
    const {recordid, gameid, groups, groupIndex, slotIndex, username, uuid } = data;

    let prevgroupindex = -1;
    let prevslotindex = -1;
    // find the player on any slots and remove it.
    groups.forEach((group, groupindex) => {
      const slotindex = group.findIndex((player) => player.uuid === uuid);
      if (slotindex !== -1) {
        group[slotindex] = { username: '', uuid: '' };
        prevgroupindex = groupindex;
        prevslotindex = slotindex;
      }
    });
    // add the player to the slot
    groups[groupIndex][slotIndex] = { username:username, uuid: uuid };

    await Player.findOneAndUpdate({recordid:recordid,gameid:gameid,uuid:uuid,username:username, is_ready:false},{$set:{is_ready:true}});
    const players = await Player.find({ recordid: recordid, gameid: gameid,is_ready:false }, 'uuid username'); // Modify the projection
    const usernames = players.map(player => ({
        uuid: player.uuid,
        username: player.username
    }));
    const totalusernames = usernames.length;
    const status = 'add';
    // io.to(recordid).emit('updatedSelectionGroup', {usernames,totalusernames, groups,status});
    io.to(recordid).emit('updatedSelectionGroup', {usernames,totalusernames, previousIndex:{prevgroupindex,prevslotindex}, updatedIndex: { groupIndex, slotIndex }, newuser:{username, uuid}, status: 'add' });
  });

  socket.on('confirmSelectionGroup',async (data:{recordid:string, gameid:string, groups:PlayerFrontendAttributes[][]}) =>{ 
    const {recordid, gameid, groups} = data;
    console.log("==========CONFIRMSELECTIONGROUP");
    // check if there are any player that is_ready == false means that he/she hasnt joined a group.
    

    for (let index = 0; index < groups.length; index++) {
      const group = groups[index];
      const score = 0;
      
      const players = group.filter(player => player.uuid !== '' && player.username !== '')
        .map(player => ({
          playerid: player.uuid,
          username: player.username,
          score: score
        }));
      if(players.length !== 0){
        const newGroup = new Group({
          recordid: recordid,
          gameid: gameid,
          groupid: UUIDGenerator(),
          groupnumber: index + 1,
          players: players,
          groupScore: score
        });
  
        try {
          await newGroup.save();
          console.log('Group created:', newGroup);
        } catch (error) {
          console.error('Error creating group:', error);
        }
      }
      
    }
  });

};


export default waitingRoomSocket;
