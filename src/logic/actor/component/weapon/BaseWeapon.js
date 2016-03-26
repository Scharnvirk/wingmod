function BaseWeapon(config){
    this.BURST_COUNT = 1;
    this.BURST_COOLDOWN = 0;
    this.COOLDOWN = 100;
    this.RECOIL = 0;
    this.VELOCITY = 10;

    /*example:
        this.FIRING_POINTS = [
            {offsetAngle: 90, offsetDistance:20, fireAngle: 0}
            {offsetAngle: +90, offsetDistance:20, fireAngle: 0}
        ]
        all properties are relative to actor's body; this example will create
        a weapon firing two shots forward from side mounts.
    */

    this.firingPoints = [];

    Object.assign(this, config);

    this.timer = 0;
    this.shooting = false;
    this.shotsFired = 0;

    if(!this.PROJECTILE_CLASS) throw new Error('No projectile class for a Weapon!');
    if(!this.manager) throw new Error('No actor manager for a Weapon!');
    if(!this.actor) throw new Error('No actor for a Weapon!');
}

BaseWeapon.prototype.update = function(){
    if (this.timer > 0) {
        this.timer --;
    } else {
        if (this.shooting) {
            this.processActiveWeapon();
        }
    }
};

BaseWeapon.prototype.shoot = function(){
    this.shooting = true;
};

BaseWeapon.prototype.stopShooting = function(){
    this.shooting = false;
};

BaseWeapon.prototype.processActiveWeapon = function(){
    this.handleFiring();
    this.shotsFired ++;
    if (this.shotsFired >= this.BURST_COUNT){
        this.shotsFired = 0;
        this.timer += this.COOLDOWN;
    }
};

BaseWeapon.prototype.fireProjectile = function(firingPointConfig){
    var body = this.actor.body;
    var offsetPosition = Utils.angleToVector(
        body.angle + Utils.degToRad(firingPointConfig.offsetAngle),
        firingPointConfig.offsetDistance
    );
    this.manager.addNew({
        classId: this.PROJECTILE_CLASS,
        positionX: body.position[0] + offsetPosition[0],
        positionY: body.position[1] + offsetPosition[1],
        angle: body.angle + firingPointConfig.fireAngle,
        velocity: this.VELOCITY
    });
};

BaseWeapon.prototype.handleFiring = function(){
    this.firingPoints.forEach(this.fireProjectile.bind(this));
    this.timer += this.BURST_COOLDOWN;
    this.actor.body.applyForceLocal([0, -this.RECOIL]);
};

module.exports = BaseWeapon;
