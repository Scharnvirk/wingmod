function Weapon(config){
    this.burstCount = 1;
    this.burstCooldown = 0;
    this.cooldown = 100;
    this.recoil = 0;
    this.randomAngle = 0;
    this.projectileCount = 1;
    this.velocity = 10;
    this.sound = null;
    this.name = config.name || 'baseWeapon';
    this.gameState = config.gameState;    
    this.defaultEmptyTiming = 60;
    this.ammoConfig = {};
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

Weapon.prototype.update = function(){
    if (this.timer > 0) {
        this.timer --;
    } else {
        if (this.shooting) {
            let canShoot = !this.gameState || this.gameState.requestShoot(this.weaponName, this.ammoConfig);
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

Weapon.prototype.shoot = function(){
    if (this.noneType) return;
    this.shooting = true;
};

Weapon.prototype.stopShooting = function(){
    this.shooting = false;
};

Weapon.prototype.processActiveWeapon = function(){
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

Weapon.prototype.fireProjectile = function(firingPointConfig){
    var position = this.actor.getPosition();
    var angle = this.actor.getAngle();
    let randomAngle = Utils.degToRad(this.randomAngle);
    var offsetPosition = Utils.angleToVector(
        angle + Utils.degToRad(firingPointConfig.offsetAngle),
        firingPointConfig.offsetDistance
    );
    
    for (let i = 0; i < this.projectileCount;i++) {
        this.actor.manager.addNew({
            classId: this.projectileClass,
            positionX: position[0] + offsetPosition[0],
            positionY: position[1] + offsetPosition[1],
            angle: angle + firingPointConfig.fireAngle + Utils.rand(0, randomAngle*1000)/1000 - randomAngle/2,
            velocity: this.velocity
        });
    }    
};

Weapon.prototype.handleFiringSimultaneous = function(){
    this.firingPoints.forEach(this.fireProjectile.bind(this));
    this.timer += this.burstCooldown;
    this.actor.applyRecoil(this.recoil);

    if (this.sound){
        this.actor.playSound([this.sound], this.volume);
    }
};

Weapon.prototype.handleFiringAlternate = function(){
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

module.exports = Weapon;
