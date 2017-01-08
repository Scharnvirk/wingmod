function WorkerBus(config){
    if(!config.worker) throw new Error('No worker object specified for Workerbus!');
    if(!config.core) throw new Error('No core object specified for Workerbus!');
    config = config || {};
    Object.assign(this, config);

    this.worker.onmessage = this.handleMessage.bind(this);

    EventEmitter.apply(this, arguments);
}

WorkerBus.extend(EventEmitter);

WorkerBus.prototype.postMessage = function(type, message){
    message.type = type;
    this.worker.postMessage(message);
};

WorkerBus.prototype.handleMessage = function(message){
    this.emit({
        type: message.data.type,
        data: message.data
    });
};

module.exports = WorkerBus;
