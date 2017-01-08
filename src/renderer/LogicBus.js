var WorkerBus = require('shared/WorkerBus');

function LogicBus(){
    WorkerBus.apply(this, arguments);
    this.worker.onmessage = this.handleMessage.bind(this);
}

LogicBus.extend(WorkerBus);

//Worker bus events passed directly - too cpu-intensive for events
LogicBus.prototype.handleMessage = function(message){
    switch(message.data.type){
    case 'updateActors':
        this.core.onUpdateActors(message);
        break;
    case 'gameEnded':
        this.core.onGameEnded(message);
        break;
    case 'gameFinished':
        this.core.onGameFinished(message);
        break;
    case 'getAiImage':
        this.core.onGetAiImage(message);
        break;
    case 'actorStateChange':
        this.core.onActorStateChange(message);
        break;
    case 'mapDone':
        this.core.onMapDone(message);
        break;
    case 'playSound':
        this.core.onPlaySound(message);
        break;
    case 'gameStateChange':
        this.core.onGameStateChange(message);
        break;
    }
};


module.exports = LogicBus;
