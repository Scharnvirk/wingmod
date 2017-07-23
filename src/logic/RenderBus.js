var WorkerBus = require('shared/WorkerBus');

function RenderBus(){
    WorkerBus.apply(this, arguments);
}

RenderBus.extend(WorkerBus);

//Worker bus events passed directly - too cpu-intensive for events
RenderBus.prototype.handleMessage = function(message){
    switch(message.data.type){
    case 'pause':
        this.core.onPause(message);
        break;
    case 'startGame':
        this.core.onStart(message);
        break;
    case 'aiImageDone':
        this.core.onAiImageDone(message); 
        break;
    case 'inputState':
        this.core.onInputState(message);
        break;
    case 'mapHitmapsLoaded':
        this.core.onMapHitmapsLoaded(message);
        break;
    case 'difficultyChange':
        this.core.onDifficultyChange(message);
        break;
    case 'gameUnpause':
        this.core.onUnpause(message);
        break;
    case 'gamePause':
        this.core.onPause(message);
        break;
    }
};


module.exports = RenderBus;

