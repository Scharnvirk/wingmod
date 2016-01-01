class PointLight extends BaseLight{
    constructor(actor, distance, color){
        super(actor);
        this._distance = distance;
        this._color = color;
        this.zOffset = 20;
        this.light = this.createLight();
    }

    createLight(){
        var light = new THREE.PointLight(this._color);
        light.position.z = 20;
        light.distance = this._distance;
        light.castShadow = false;
        light.shadowCameraNear = 1;
        light.shadowCameraFar = 200;
        light.shadowDarkness = 0.5;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 1024;
        light.shadowBias = 0.01;
        return light;
    }
}
