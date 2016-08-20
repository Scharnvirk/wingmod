function Hud(config){
    Object.assign(this, config);

    if(!this.actorManager) throw new Error('No actorManager defined for Hud!');
    if(!this.particleManager) throw new Error('No particleManager defined for Hud!');

    this.defaultHpBarCount = 10;

    EventEmitter.apply(this, arguments);
}

Hud.extend(EventEmitter);

Hud.prototype.update = function(){
    if(this.actor && !this.actor.dead){
        this.drawRadar();
        this.drawHealthBar(this.actor);
    }
};

Hud.prototype.onPlayerActorAppeared = function(actor){
    this.actor = actor;
};

Hud.prototype.drawRadar = function(){
    for (let enemyId in this.actorManager.enemies ){
        let enemyActor = this.actorManager.enemies[enemyId];
        let rotation = Utils.rotationBetweenPoints(enemyActor.position, this.actor.position);
        let offsetPosition = Utils.rotationToVector(rotation + Math.PI, 12);

        this.drawHealthBar(enemyActor);

        this.particleManager.createParticle('particleAddHUD', {
            positionX: this.actor.position[0] + offsetPosition[0],
            positionY: this.actor.position[1] + offsetPosition[1],
            positionZ: -Constants.DEFAULT_POSITION_Z,
            colorR: 1,
            colorG: 0,
            colorB: 0,
            scale: 0.75,
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: 0,
            particleRotation: 0,
            lifeTime: 1
        });
    }
};

Hud.prototype.drawHealthBar = function(otherActor){
    var hpPercentage = otherActor.hp / otherActor.initialHp;
    var hpBarCount = otherActor.hpBarCount || this.defaultHpBarCount;
    for (let i = 0; i < hpBarCount; i++){
        let rotation = (otherActor !== this.actor) ? Utils.rotationBetweenPoints(otherActor.position, this.actor.position) : this.actor.rotation;
        let offsetPosition = Utils.rotationToVector(rotation + Utils.degToRad(hpBarCount/2*3) - Utils.degToRad(i*3) + Math.PI, 8);
        this.particleManager.createParticle('particleAddHUD', {
            positionX: otherActor.position[0] + offsetPosition[0],
            positionY: otherActor.position[1] + offsetPosition[1],
            positionZ: otherActor !== this.actor ? -15 + hpBarCount : -Constants.DEFAULT_POSITION_Z,
            colorR: i >= hpPercentage * hpBarCount ? 1 : 0,
            colorG: i < hpPercentage * hpBarCount ? 1 : 0,
            colorB: 0,
            scale: 0.75,
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: 0,
            particleRotation: rotation,
            lifeTime: 1,
            spriteNumber: 3
        });
    }
};

Hud.prototype.drawCrosshairs = function(actor){
    this.particleManager.createPremade('CrosshairBlue', {
        position: actor.position,
        positionZ: actor.positionZ - Constants.DEFAULT_POSITION_Z,
        rotation: actor.rotation,
        rotationOffset: 9,
        distance: 20
    });
    this.particleManager.createPremade('CrosshairBlue', {
        position: actor.position,
        positionZ: actor.positionZ - Constants.DEFAULT_POSITION_Z,
        rotation: actor.rotation,
        rotationOffset: -9,
        distance: 20
    });
    this.particleManager.createPremade('CrosshairGreen', {
        position: actor.position,
        positionZ: actor.positionZ - Constants.DEFAULT_POSITION_Z,
        rotation: actor.rotation,
        rotationOffset: 18,
        distance: 16
    });
    this.particleManager.createPremade('CrosshairGreen', {
        position: actor.position,
        positionZ: actor.positionZ - Constants.DEFAULT_POSITION_Z,
        rotation: actor.rotation,
        rotationOffset: -18,
        distance: 16
    });
};

module.exports = Hud;
