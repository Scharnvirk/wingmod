class MookActor extends BaseActor{
    constructor(config){
        super(config);
        Object.assign(this, config);

        this.mesh = this.createMesh();
        this.body = this.createBody();

        this.acceleration = 40;
        this.turnSpeed = 0.3;

        this.thrust = 0;
        this.rotationForce = 0;
    }

    customUpdate(){
        this.actorLogic();
        if(this.thrust !== 0){
            this.body.applyForceLocal([0, this.thrust * this.acceleration]);
        }

        if(this.rotationForce !== 0){
            this.body.angularVelocity = this.rotationForce * this.turnSpeed;
        } else {
            this.body.angularVelocity = 0;
        }
    }

    createMesh(){
        return new ShipMesh(this, this.diameter, Utils.makeRandomColor());
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

    actorLogic(){
        if(Utils.rand(0,100) === 100) this.rotationForce = Utils.rand(-2,2);
        if(Utils.rand(0,100) > 97){
            var thrustRand = Utils.rand(0,100);
            if (thrustRand > 20){
                this.thrust = 1;
            } else if (thrustRand <= 2) {
                this.thrust = -1;
            } else {
                this.thrust = 0;
            }
        }
    }
}
