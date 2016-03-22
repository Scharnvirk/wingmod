function LogicBus(config){
    config = config || {};
    Object.assign(this, config);
    if(!this.logicWorker) throw new Error('No logicWorker object specified for LogicBus!');
    if(!this.actorManager) throw new Error('No actorManager object specified for LogicBus!');
    if(!this.core) throw new Error('No core object specified for LogicBus!');

    this.logicWorker.onmessage = this.handleMessage.bind(this);
}

LogicBus.prototype.handleMessage = function(message){
    switch(message.data.type){
        case 'updateActors':
            this.actorManager.updateFromLogic(message.data);
            break;
        case 'attachPlayer':
            this.actorManager.attachPlayer(message.data.actorId);
            break;
        case 'gameEnded':
            this.core.stopGame(message.data);
            break;
        case 'getAiImage':
            let imageObject = this.core.getAiImageObject(message.data);
            this.postMessage('aiImageDone', imageObject);
            break;
    }
};

LogicBus.prototype.postMessage = function(type, message){
    message.type = type;
    this.logicWorker.postMessage(message);
};

LogicBus.prototype.postMessageTransferrable = function(type, message, buffer){
    message.type = type;
    this.logicWorker.postMessage(message, [buffer]);
};

module.exports = LogicBus;
