function BaseWeapon(config){
    this.burstCount = 1;
    this.burstCooldown = 0;
    this.cooldown = 100;
    this.recoil = 0;
    this.velocity = 10;
    this.sound = null;
    this.name = config.name || 'baseWeapon';
    this.gameState = config.gameState;    
    this.defaultEmptyTiming = 60;

    this.ammoConfig = {};

    /*example:
        this.firingPoints = [
            {offsetAngle: 90, offsetDistance:20, fireAngle: 0}
            {offsetAngle: +90, offsetDistance:20, fireAngle: 0}
        ]
        this.firingMode = 'alternate' | 'simultaneous'
        all properties are relative to actor's body; this example will create
        a weapon firing two shots forward from side mounts.
    */

    this.firingPoints = [];
    this.firingMode = 'simultaneous';
    this.currentFiringPoint = 0;

    Object.assign(this, config);

    this.timer = 0;
    this.shooting = false;
    this.shotsFired = 0;

    if(!this.projectileClass) throw new Error('No projectile class for a Weapon!');
    if(!this.actor) throw new Error('No actor for a Weapon!');
}

BaseWeapon.prototype.update = function(){
    if (this.timer > 0) {
        this.timer --;
    } else {
        if (this.shooting) {
            let canShoot = !this.gameState || this.gameState.requestShoot(this.name, this.ammoConfig);
            if(canShoot){
                this.processActiveWeapon();
            } else {
                this.shotsFired = 99999;
                this.timer = this.defaultEmptyTiming;
                this.actor.playSound(['empty']);
            }
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
    switch (this.firingMode){
    case 'alternate':
        this.handleFiringAlternate();
        break;
    default:
        this.handleFiringSimultaneous();
    }
    this.shotsFired ++;
    if (this.shotsFired >= this.burstCount){
        this.shotsFired = 0;
        this.timer += this.cooldown;
    }
};

BaseWeapon.prototype.fireProjectile = function(firingPointConfig){
    var position = this.actor.getPosition();
    var angle = this.actor.getAngle();
    var offsetPosition = Utils.angleToVector(
        angle + Utils.degToRad(firingPointConfig.offsetAngle),
        firingPointConfig.offsetDistance
    );
    this.actor.manager.addNew({
        classId: this.projectileClass,
        positionX: position[0] + offsetPosition[0],
        positionY: position[1] + offsetPosition[1],
        angle: angle + firingPointConfig.fireAngle,
        velocity: this.velocity
    });
};

BaseWeapon.prototype.handleFiringSimultaneous = function(){
    this.firingPoints.forEach(this.fireProjectile.bind(this));
    this.timer += this.burstCooldown;
    this.actor.applyRecoil(this.recoil);

    if (this.sound){
        this.actor.playSound([this.sound], this.volume);
    }
};

BaseWeapon.prototype.handleFiringAlternate = function(){
    this.currentFiringPoint ++;
    if (this.currentFiringPoint >= this.firingPoints.length){
        this.currentFiringPoint = 0;
    }

    this.fireProjectile(this.firingPoints[this.currentFiringPoint]);
    this.timer += this.burstCooldown;
    this.actor.applyRecoil(this.recoil);

    if (this.sound){
        this.actor.playSound([this.sound], this.volume);
    }
};

module.exports = BaseWeapon;
