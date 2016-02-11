function ProjectileActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);

    this.hp = 1;
    this.collisionArmor = 0;

    //this.timeout = 30;
}

ProjectileActor.extend(BaseActor);

ProjectileActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Circle({
            radius: 3,
            collisionGroup: Constants.COLLISION_GROUPS.ENEMYPROJECTILE,
            collisionMask:
                Constants.COLLISION_GROUPS.SHIP |
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.SHIPPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN
        }),
        actor: this,
        mass: 0.1
    });
};

ProjectileActor.prototype.onDeath = function(){
    this.body.scheduleDestruction();
    this.manager.addNew({
        classId: ActorFactory.EXPLOSION,
        positionX: this.body.position[0],
        positionY: this.body.position[1],
        angle: 0,
        radius: 400,
        power: 1000
    });
};
