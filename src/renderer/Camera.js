function Camera(config){
    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.VIEW_ANGLE = 45;
    this.ASPECT = this.WIDTH / this.HEIGHT;
    this.NEAR = 0.1;
    this.FAR = 1000;

    config = config || {};
    Object.assign(this, config);
    THREE.PerspectiveCamera.call(this, this.VIEV_ANGLE, this.ASPECT, this.NEAR, this.FAR);
    this.position.z = 200;

    this.mousePosition = new THREE.Vector3(0,0,1);
}

Camera.extend(THREE.PerspectiveCamera);

Camera.prototype.update = function(){
    if(this.actor){
        this.position.x = this.actor.position[0];
        this.position.y = this.actor.position[1];
    }

    let inputState = this.inputListener.inputState;

    if(this.inputListener && this.actor){
        if (this.inputListener.inputState.scrollUp) {
            this.position.z += inputState.scrollUp;
        }

        if (this.inputListener.inputState.scrollDown) {
            this.position.z -= inputState.scrollDown;
        }
        //
        // if(isFinite(inputState.lookX) && isFinite(inputState.lookY)){
        //     this.position.x = (this.actor.position[0]*2 + this.inputListener.inputState.lookX) / 3;
        //     this.position.y = (this.actor.position[1]*2 + this.inputListener.inputState.lookY) / 3;
        // }
    }
};
