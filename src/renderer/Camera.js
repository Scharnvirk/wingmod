function Camera(config){
    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.VIEW_ANGLE = 45;
    this.ASPECT = this.WIDTH / this.HEIGHT;
    this.NEAR = 0.1;
    this.FAR = 1000;

    this.ZOOM_THRESHOLD = 0.995;
    this.zoomSpeed = 5;

    config = config || {};
    Object.assign(this, config);
    THREE.PerspectiveCamera.call(this, this.VIEV_ANGLE, this.ASPECT, this.NEAR, this.FAR);
    
    this.expectedPositionZ = this.position.z;
    this.rotation.reorder('ZXY');

    this.position.z = 800;
    this.rotation.x = 0.9;
    this.rotation.y = 0;
}

Camera.extend(THREE.PerspectiveCamera);

Camera.prototype.update = function(){
    let inputState = this.inputListener.inputState;

    if(this.actor){
        let offsetPosition = Utils.angleToVector(this.actor.angle, -50);

        this.rotation.z = this.actor.angle;

        this.position.x = this.actor.position[0] + offsetPosition[0];
        this.position.y = this.actor.position[1] + offsetPosition[1];
    }

    if(this.inputListener && this.actor){
        if (this.inputListener.inputState.scrollUp) {
            this.position.z += inputState.scrollUp;
        }

        if (this.inputListener.inputState.scrollDown) {
            this.position.z -= inputState.scrollDown;
        }
    }

    if(this.expectedPositionZ != this.position.z && this.expectedPositionZ > -1){
        if (this.expectedPositionZ / this.position.z > this.ZOOM_THRESHOLD){
            this.position.z = this.expectedPositionZ;
        } else {
            this.position.z += this.expectedPositionZ > this.position.z ?
            (this.expectedPositionZ + this.position.z) / this.zoomSpeed :
            (this.expectedPositionZ - this.position.z) / this.zoomSpeed;
        }
        this.updateProjectionMatrix();
    }else{
        this.expectedPositionZ = -1;
    }
};

Camera.prototype.setPositionZ = function(newPositionZ, zoomSpeed){
    this.zoomSpeed = zoomSpeed ? zoomSpeed : this.zoomSpeed;
    this.expectedPositionZ = newPositionZ;
};

module.exports = Camera;
