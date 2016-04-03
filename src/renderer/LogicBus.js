function LogicBus(config){
    config = config || {};
    Object.assign(this, config);
    if(!this.logicWorker) throw new Error('No logicWorker object specified for LogicBus!');

    this.logicWorker.onmessage = this.handleMessage.bind(this);

    EventEmitter.apply(this, arguments);
}

LogicBus.extend(EventEmitter);

LogicBus.prototype.handleMessage = function(message){
    this.emit({
        type: message.data.type,
        data: message.data
    });
};

LogicBus.prototype.postMessage = function(type, message){
    message.type = type;
    this.logicWorker.postMessage(message);
};

module.exports = LogicBus;
