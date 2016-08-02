function FlatHudCamera(config){
    this.WIDTH = document.documentElement.clientWidth;
    this.HEIGHT = document.documentElement.clientHeight;
    this.VIEW_ANGLE = 45;
    this.ASPECT = this.WIDTH / this.HEIGHT;
    this.NEAR = 0.1;
    this.FAR = Constants.RENDER_DISTANCE;

    config = config || {};
    Object.assign(this, config);
    THREE.PerspectiveCamera.call(this, this.VIEV_ANGLE, this.ASPECT, this.NEAR, this.FAR);

    this.rotation.reorder('ZXY');

    this.position.z = 0;
    this.rotation.x = 1.0;
    this.rotation.y = 0;

    this.zOffset = 60;
}
Camera.extend(THREE.PerspectiveCamera);

module.exports = FlatHudCamera;
