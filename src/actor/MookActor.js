class MookActor extends BaseActor{
    constructor(position){
        super(position, 0);
        this.mesh = this.createMesh();

        this.physicsProperties = {
            friction: 0.01,
            acceleration: 0.05,
            deceleration: 0.04
        };

        this.physics = this.createPhysics();

        this.diameter = 2;
        this.turning = 0;
        this.thrustSetting = 0;
    }

    customUpdate(){
        this.actorLogic();
    }

    createMesh(){
        return new ShipMesh(this, this.diameter, Utils.makeRandomColor());
    }

    createPhysics(){
        return new BasePhysics(this);
    }

    actorLogic(){
        switch(this.turning){
            case -1: this.angle --; break;
            case -2: this.angle -= 3; break;
            case 1: this.angle ++; break;
            case 2: this.angle += 3; break;
        }

        this.thrust = this.thrustSetting;

        if(Utils.rand(0,100) === 100) this.turning = Utils.rand(-2,2);
        if(Utils.rand(0,100) > 97){
            var thrustRand = Utils.rand(0,100);
            if (thrustRand > 20){
                this.thrustSetting = 1;
            } else if (thrustRand <= 2) {
                this.thrustSetting = -1;
            } else {
                this.thrustSetting = 0;
            }
        }
    }
}
