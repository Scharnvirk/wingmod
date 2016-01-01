"use strict";

function Camera(actor) {
    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.VIEW_ANGLE = 45;
    this.ASPECT = this.WIDTH / this.HEIGHT;
    this.NEAR = 0.1;
    this.FAR = 10000;
    THREE.PerspectiveCamera.call(this, this.VIEV_ANGLE, this.ASPECT, this.NEAR, this.FAR);
    this.position.z = 300;

    if (actor) {
        this.actor = actor;
    }
}

Camera.extend(THREE.PerspectiveCamera);

Camera.prototype.update = function () {
    if (this.actor) {
        this.position.x = this.actor.position.x;
        this.position.y = this.actor.position.y;
    }
};
//# sourceMappingURL=Camera.js.map
