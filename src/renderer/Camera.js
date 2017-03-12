function Camera(config){
    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.VIEW_ANGLE = 45;
    this.ASPECT = this.WIDTH / this.HEIGHT;
    this.NEAR = 0.1;
    this.FAR = Constants.RENDER_DISTANCE;

    this.ZOOM_THRESHOLD = 0.995;
    this.zoomSpeed = 5;

    config = config || {};
    Object.assign(this, config);
    THREE.PerspectiveCamera.call(this, this.VIEV_ANGLE, this.ASPECT, this.NEAR, this.FAR);

    this.expectedPositionZ = this.position.z;
    this.rotation.reorder('ZXY');

    this.position.z = 0;
    this.rotation.x = 0;
    this.rotation.y = 0;

    this.zOffset = 60;
}

Camera.extend(THREE.PerspectiveCamera);

Camera.prototype.update = function(){
    let inputState = this.inputListener.inputState;
    
    if(this.actor){
        let rotation = this.actor.getRotation();
        let position = this.actor.getPosition();
        let offsetPosition = Utils.rotationToVector(rotation, -this.zOffset);

        this.rotation.z = rotation;
        this.position.x = position[0] + offsetPosition[0];
        this.position.y = position[1] + offsetPosition[1];
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
        if(this.inputListener && this.actor){
            if (inputState.scrollUp && this.position.z < 150) {
                this.position.z += inputState.scrollUp;
                this.rotation.x -= inputState.scrollUp * 0.01;
                this.zOffset -= inputState.scrollUp * 0.5;
            }

            if (inputState.scrollDown && this.position.z > 30) {
                this.position.z -= inputState.scrollDown;
                this.rotation.x += inputState.scrollDown * 0.01;
                this.zOffset += inputState.scrollDown * 0.5;
            }
        }
    }
};

Camera.prototype.setMovementZ = function(newPositionZ, zoomSpeed){
    this.zoomSpeed = zoomSpeed ? zoomSpeed : this.zoomSpeed;
    this.expectedPositionZ = newPositionZ;
};

Camera.prototype.setRenderDistance = function(renderDistance){
    this.far = renderDistance || Constants.RENDER_DISTANCE;
};

module.exports = Camera;
