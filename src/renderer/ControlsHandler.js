function ControlsHandler(config){
    if(!config.inputListener) throw new Error('No inputListener specified for the handler!');
    if(!config.logicBus) throw new Error('No logic bus specified for the handler!');

    Object.assign(this, config);

    this.inputListener = config.inputListener;
    this.logicBus = config.logicBus;
    this.oldInputState = {};
    this.inputState =  {};
}

ControlsHandler.prototype.update = function(){
    Object.assign(this.oldInputState, this.inputState);
    Object.assign(this.inputState, this.inputListener.inputState);

    var changed = false;

    for (let key in this.inputState){
        if(this.inputState[key] != this.oldInputState[key]){
            changed = true;
        }
    }

    if(changed) this.sendUpdate();
};

ControlsHandler.prototype.sendUpdate = function(){
    this.logicBus.postMessage('inputState', this.inputState);
};
