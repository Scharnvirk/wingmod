class PlayerActor extends BaseActor {
    constructor(config){
        super(config);
        Object.assign(this, config);

        this.controlsHandler = config.controlsHandler;
        this.mesh = this.createMesh();
        this.light = this.createLight();
        this.controls = this.createControls();
        this.body = this.createBody();

        this.acceleration = 75;
        this.turnSpeed = 1.5;

        this.diameter = 2;
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

    createBody(){
        return new BaseBody({
            actor: this,
            mass: 1,
            damping: 0.75,
            angularDamping: 0,
            position: this.position
        });
    }

    customUpdate(){
        if(this.thrust !== 0){
            this.body.applyForceLocal([0, this.thrust * this.acceleration]);
        }

        if(this.horizontalThrust !== 0){
            this.body.applyForceLocal([this.horizontalThrust * this.acceleration, 0]);
        }

        if(this.rotationForce !== 0){
            this.body.angularVelocity = this.rotationForce * this.turnSpeed;
        } else {
            this.body.angularVelocity = 0;
        }
    }
}
