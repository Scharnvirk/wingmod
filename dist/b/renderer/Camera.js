"use strict";

function Camera(config) {
    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.VIEW_ANGLE = 45;
    this.ASPECT = this.WIDTH / this.HEIGHT;
    this.NEAR = 0.1;
    this.FAR = 10000;

    config = config || {};
    Object.assign(this, config);
    THREE.PerspectiveCamera.call(this, this.VIEV_ANGLE, this.ASPECT, this.NEAR, this.FAR);
    this.position.z = 300;
}

Camera.extend(THREE.PerspectiveCamera);

Camera.prototype.update = function () {
    if (this.actor) {
        this.position.x = this.actor.position[0];
        this.position.y = this.actor.position[1];
    }

    if (this.controls) {
        if (this.controls.moveState.scrollUp) {
            this.position.z += this.controls.moveState.scrollUp;
        }

        if (this.controls.moveState.scrollDown) {
            this.position.z -= this.controls.moveState.scrollDown;
        }
    }
};
//# sourceMappingURL=Camera.js.map
