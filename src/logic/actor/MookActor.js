function MookActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.acceleration = 100;
    this.turnSpeed = 0.8;

    this.thrust = 0;
    this.rotationForce = 0;

    this.hp = 4;

    this.weaponTimer = 0;
    this.shotsFired = 0;
}

MookActor.extend(BaseActor);

MookActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Convex({
            vertices: [[-5, 3], [0, 0], [5, 3], [0, 4]],
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
        this.shotsFired ++;
    }
    if(this.shotsFired >= 3){
        this.requestShoot = false;
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
    var weaponRand = Utils.rand(0,200);
    if (weaponRand === 199){
        this.shotsFired = 0;
        this.requestShoot = true;
    }
};

MookActor.prototype.shoot = function(){
    this.weaponTimer += 3;
    this.manager.addNew({
        classId: ActorFactory.MOLTENPROJECTILE,
        positionX: this.body.position[0],
        positionY: this.body.position[1],
        angle: this.body.angle,
        velocity: 100
    });
    this.body.applyForceLocal([0,-3000]);
};


MookActor.prototype.onDeath = function(){
    for(let i = 0; i < 10; i++){
        this.manager.addNew({
            classId: ActorFactory.CHUNK,
            positionX: this.body.position[0],
            positionY: this.body.position[1],
            angle: Utils.rand(0,360),
            velocity: Utils.rand(0,100)
        });
    }
    this.body.dead = true;
};

BaseActor.prototype.onSpawn = function(){};
