function MookActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.acceleration = 200;
    this.turnSpeed = 0.8;

    this.thrust = 0;
    this.rotationForce = 0;

    this.hp = 4;

    this.weaponTimer = 0;
}

MookActor.extend(BaseActor);

MookActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Convex({
            vertices: [[-10, 6], [0, 0], [10, 6], [0, 8]],
            collisionGroup: Constants.COLLISION_GROUPS.ENEMY,
            collisionMask:
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN |
                Constants.COLLISION_GROUPS.SHIPEXPLOSION
        }),
        actor: this,
        mass: 2,
        damping: 0.75,
        angularDamping: 0,
        inertia: 10
    });
};

MookActor.prototype.customUpdate = function(){
    this.actorLogic();

    if(this.thrust !== 0){
        this.body.applyForceLocal([0, this.thrust * this.acceleration]);
    }

    if(this.rotationForce !== 0){
        this.body.angularVelocity = this.rotationForce * this.turnSpeed;
    } else {
        this.body.angularVelocity = 0;
    }

    this.processWeapon();
};

MookActor.prototype.processWeapon = function(){
    if(this.weaponTimer > 0){
        this.weaponTimer --;
    }
    if(this.requestShoot && this.weaponTimer === 0){
        this.shoot();
    }
};

MookActor.prototype.actorLogic = function(){
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
    var weaponRand = Utils.rand(0,100);
    if (weaponRand > 98){
        this.requestShoot = true;
    }
    if (weaponRand < 10){
        this.requestShoot = false;
    }
};

MookActor.prototype.shoot = function(){
    this.weaponTimer += 20;
    this.manager.addNew({
        classId: ActorFactory.MOLTENPROJECTILE,
        positionX: this.body.position[0],
        positionY: this.body.position[1],
        angle: this.body.angle,
        velocity: 200
    });
    this.body.applyForceLocal([0,2000]);
};
