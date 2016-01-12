class MapPointLight extends BaseLight{
    constructor(actor, distance, color){
        super(actor);
        this._distance = distance;
        this._color = color;
        this.inFrustum = false;
        this.zOffset = 20;
        this.light = this.createLight();
    }

    createLight(){
        var light = new THREE.PointLight(this._color);
        light.distance = this._distance;
        return light;
    }

    reset(){
        console.log("MPL reset");
    }
}
