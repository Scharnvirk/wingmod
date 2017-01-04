function Hud(config){
    Object.assign(this, config);

    if(!this.actorManager) throw new Error('No actorManager defined for Hud!');
    if(!this.particleManager) throw new Error('No particleManager defined for Hud!');

    this.defaultHpBarCount = 10;

    EventEmitter.apply(this, arguments);
}

Hud.extend(EventEmitter);

Hud.prototype.update = function(){
    if(this.actor && this.actor.state.hp > 0){
        this.drawRadar();
        this.drawHealthBar(this.actor);
    }
};

Hud.prototype.onPlayerActorAppeared = function(actor){
    this.actor = actor;
};

Hud.prototype.drawRadar = function(){
    let actorPosition = this.actor.getPosition();
    let enemies = this.actorManager.getEnemies();
    for (let enemyId in enemies ){
        let enemyActor = enemies[enemyId];
        let rotation = Utils.rotationBetweenPoints(enemyActor.getPosition(), actorPosition);
        let offsetPosition = Utils.rotationToVector(rotation + Math.PI, 12);

        this.drawHealthBar(enemyActor);

        this.particleManager.createParticle('particleAddHUD', {
            positionX: actorPosition[0] + offsetPosition[0],
            positionY: actorPosition[1] + offsetPosition[1],
            positionZ: -Constants.DEFAULT_POSITION_Z,
            color: 'DEEPRED',
            scale: 0.75,
            alpha: 0.6,
            alphaMultiplier: 1,
            particleVelocity: 0,
            particleRotation: 0,
            lifeTime: 1
        });
    }
};

Hud.prototype.drawHealthBar = function(otherActor){
    let actorPosition = this.actor.getPosition();
    let actorRotation = this.actor.getRotation();
    let otherActorPosition = otherActor.getPosition();
    let hpPercentage = otherActor.state.hp / otherActor.props.hp;
    let hpBarCount = otherActor.props.hpBarCount || this.defaultHpBarCount;
    let positionZ = otherActor !== this.actor ? -15 + hpBarCount : -Constants.DEFAULT_POSITION_Z;
    let rotation = (otherActor !== this.actor) ? Utils.rotationBetweenPoints(otherActorPosition, actorPosition) : actorRotation;
    for (let i = 0; i < hpBarCount; i++){        
        let offsetPosition = Utils.rotationToVector(rotation + Utils.degToRad(hpBarCount/2*3) - Utils.degToRad(i*3) + Math.PI, 8);
        this.particleManager.createParticle('particleAddHUD', {
            positionX: otherActorPosition[0] + offsetPosition[0],
            positionY: otherActorPosition[1] + offsetPosition[1],
            positionZ: positionZ,
            color: i >= hpPercentage * hpBarCount ? 'DEEPRED' : 'WHITE',
            scale: 0.75,
            particleVelocity: 0,
            particleRotation: rotation,
            alpha: 1,
            alphaMultiplier: 1,
            lifeTime: 1,
            spriteNumber: 3
        });
    }
};

module.exports = Hud;
