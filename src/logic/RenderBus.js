function RenderBus(config){
    if(!config.worker) throw new Error('No worker object specified for Logic Render Bus');
    this.worker = config.worker;
    this.inputState = {};

    this.worker.onmessage = this.handleMessage.bind(this);

    EventEmitter.apply(this, arguments);
}

RenderBus.extend(EventEmitter);

RenderBus.prototype.postMessage = function(type, message){
    message.type = type;
    this.worker.postMessage(message);
};

RenderBus.prototype.handleMessage = function(message){
    this.emit({
        type: message.data.type,
        data: message.data
    });
};

module.exports = RenderBus;
