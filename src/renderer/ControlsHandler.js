function ControlsHandler(config){
    if(!config.inputListener) throw new Error('No inputListener specified for the handler!');
    if(!config.logicBus) throw new Error('No logic bus specified for the handler!');

    Object.assign(this, config);

    this.inputListener = config.inputListener;
    this.logicBus = config.logicBus;
    this.oldInputState = {};
    this.inputState =  {};

    this.camera = config.camera;
    //this.cameraProjector = new THREE.Projector();
    this.mousePosition = new THREE.Vector3(0,0,1);
}

ControlsHandler.prototype.update = function(){
    Object.assign(this.oldInputState, this.inputState);
    Object.assign(this.inputState, this.inputListener.inputState);

    var pos = new THREE.Vector3(0, 0, 0);
    var pMouse = new THREE.Vector3(
        this.inputState.mouseX,
        this.inputState.mouseY,
        1);
    //

    pMouse.unproject(this.camera);

    var cam = this.camera.position;
    var m = pMouse.z / ( pMouse.z - cam.z );

    this.inputState.lookX = pMouse.x + ( cam.x - pMouse.x ) * m;
    this.inputState.lookY = pMouse.y + ( cam.y - pMouse.y ) * m;

    //console.log(this.inputState.lookX, this.inputState.lookY);

    //
    // this.mousePosition.x = this.inputState.mouseX;
    // this.mousePosition.y = this.inputState.mouseY;
    // //
    // console.log(this.mousePosition.x, this.mousePosition.y);
    // this.mousePosition.unproject(this.camera);
    // console.log(this.mousePosition.x, this.mousePosition.y);
    //
    // var pos = [0,0];
    // //var m = pMouse.y / ( pMouse.y - cam.y );
    //
    // pos[0] = this.mousePosition.x + ( this.camera.position.x - this.mousePosition.x );
    // pos[1] = this.mousePosition.y + ( this.camera.position.y - this.mousePosition.y );
    //
    // console.log(pos[0],pos[1], this.mousePosition.x, this.mousePosition.y);

    //
    // this.mousePosition[0] = this.inputState.mouseX;
    // this.mousePosition[1] = this.inputState.mouseY;
    //
    // this.cameraRaycaster.setFromCamera(this.mousePosition, this.camera);
    //
    // var intersects = raycaster.this.cameraRaycaster.(targetList);
    // if ( intersects.length > 0 )
    // {
    //     console.log(intersects[0].point);
    //     console.log("Hit @ " + toString( intersects[0].point ) );
    // }

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
