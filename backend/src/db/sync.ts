import Creator from '../model/creator.model';
import Game from '../model/game.model';
import Group from '../model/group.model';
import Player from '../model/player.model';
import Question from '../model/question.model';
import Record from '../model/record.model';
import Answer from '../model/answer.model';

async function syncAllModels() {
    // CREATOR-GAME
    Creator.hasMany(Game,{
      sourceKey: 'uuid',
      foreignKey: 'userid'
    })
    Game.belongsTo(Creator,{
        foreignKey: 'userid',
        targetKey: 'uuid'
    })
    // GAME-QUESTION
    Game.hasMany(Question,{
      sourceKey: 'uuid',
      foreignKey: 'gameid'
    })
    Question.belongsTo(Game,{
        foreignKey: 'gameid',
        targetKey: 'uuid'
    })
    // RECORD-PLAYER
    Record.hasMany(Player,{
      sourceKey: 'uuid',
      foreignKey: 'recordid'
    })
    Player.belongsTo(Record,{
        foreignKey: 'recordid',
        targetKey: 'uuid'
    })
    // GROUP-PLAYER
    Group.hasMany(Player,{
        sourceKey: 'uuid',
        foreignKey: 'groupid'
    })
    Player.belongsTo(Group,{
        foreignKey: 'groupid',
        targetKey: 'uuid'
    })
    // GAME-RECORD
    Game.hasMany(Record,{
        sourceKey: 'uuid',
        foreignKey: 'gameid'
    })
    Record.belongsTo(Game,{
        foreignKey: 'gameid',
        targetKey: 'uuid'
    })
    // PLAYER-ANSWER
    Player.hasMany(Answer,{
        sourceKey: 'uuid',
        foreignKey: 'playerid'
    })
    Answer.belongsTo(Player,{
        foreignKey: 'playerid',
        targetKey: 'uuid'
    })
    // QUESTION-ANSWER
    Question.hasMany(Answer,{
        sourceKey: 'uuid',
        foreignKey: 'questionid'
    })
    Answer.belongsTo(Question,{
        foreignKey: 'questionid',
        targetKey: 'uuid'
    })

    try {
      // Synchronize each model
      await Creator.sync();
      await Game.sync();
      await Question.sync();
      await Record.sync();
      await Group.sync();
      await Player.sync();
      await Answer.sync();
      
      console.log("----------------------------------\nAll models synchronized successfully.\n----------------------------------");
    } catch (error) {
      console.error("Error synchronizing models:", error);
    }
  };

export default syncAllModels;
