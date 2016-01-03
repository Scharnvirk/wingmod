class BasePhysics {
    constructor(actor, physicsProperties){
        this.actor = actor;

        this.angle = actor.angle;
        this.position = actor.position;
        this.speed = 0;

        this.friction = 0;
        this.acceleration = 0;
        this.deceleration = 0;

        this.velocityVector = new THREE.Vector2(0,0);
        //this.accelerationVector = new THREE.Vector2(0,0);

        this.updateProperties();

        this.clock = 0;
    }

    calculatePositionVector(){
        this.position.add(this.velocityVector);
    }

    setVelocity(angle, thrust){
        this.velocityVector.x = (this.velocityVector.x + Math.sin(Utils.degToRad(angle)) * thrust * this.acceleration) * (1-this.deceleration);
        this.velocityVector.y = (this.velocityVector.y + Math.cos(Utils.degToRad(angle)) * thrust * this.acceleration) * (1-this.deceleration);
        var length = this.velocityVector.length();
        this.velocityVector.setLength(length > this.friction ? length - this.friction : 0);
    }

    updateProperties(){
        Object.keys(this.actor.physicsProperties).forEach((property)=>{
            this[property] = this.actor.physicsProperties[property];
        });
    }

    update(position, angle, thrust){
        this.angle = angle;
        this.position = position;

        this.setVelocity(angle, thrust);

        this.calculatePositionVector();
        this.clock++;
    }
}
