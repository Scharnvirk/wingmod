class PlayerActor extends BaseActor {
    constructor(controlsHandler){
        super(null, null, 30, 30);
        this.controlsHandler = controlsHandler;
        this.mesh = this.createMesh();
        this.light = this.createLight();
        this.controls = this.createControls();

        this.physicsProperties = {
            friction: 0.01,
            acceleration: 0.1,
            deceleration: 0.04
        };

        this.physics = this.createPhysics();
    }

    createMesh(){
        return new ShipMesh(this, 7, 0xff0000);
    }

    createControls(){
        return new OctaControls(this, this.controlsHandler);
    }

    createLight(){
        return new PointLight(this, 120, 0x665522);
    }

    createPhysics(){
        return new BasePhysics(this);
    }

    customUpdate(){
    }
}
