function ControlsHandler(config){
    if(!config.inputListener) throw new Error('No inputListener specified for the handler!');
    if(!config.logicBus) throw new Error('No logic bus specified for the handler!');

    Object.assign(this, config);

    this.inputListener = config.inputListener;
    this.logicBus = config.logicBus;
    this.oldInputState = {};
    this.inputState =  {};

    this.camera = config.camera;
    this.mousePosition = new THREE.Vector3(0,0,1);
}

ControlsHandler.prototype.update = function(){
    Object.assign(this.oldInputState, this.inputState);
    Object.assign(this.inputState, this.inputListener.inputState);

    this.setSceneMousePosition();

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

ControlsHandler.prototype.setSceneMousePosition = function(){
    if (!this.camera){
        return;
    }

    this.mousePosition.x = this.inputState.mouseX;
    this.mousePosition.y = this.inputState.mouseY;
    this.mousePosition.z = 1;

    this.mousePosition.unproject(this.camera);

    var heightModifier = this.mousePosition.z / ( this.mousePosition.z - this.camera.position.z );

    this.inputListener.inputState.lookX = this.mousePosition.x + ( this.camera.position.x - this.mousePosition.x ) * heightModifier;
    this.inputListener.inputState.lookY = this.mousePosition.y + ( this.camera.position.y - this.mousePosition.y ) * heightModifier;
};

module.exports = ControlsHandler;
