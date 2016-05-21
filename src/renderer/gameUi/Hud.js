function Hud(config){
    Object.assign(this, config);

    if(!this.actorManager) throw new Error('No actorManager defined for MainContainer!');
    if(!this.particleManager) throw new Error('No particleManager defined for MainContainer!');

    this.defaultHpBarCount = 10;
}

Hud.prototype.update = function(){
    if(this.actor && !this.actor.dead){
        for (let enemyId in this.actorManager.enemies ){
            let enemyActor = this.actorManager.enemies[enemyId];
            let angle = Utils.angleBetweenPoints(enemyActor.position, this.actor.position);
            let offsetPosition = Utils.angleToVector(angle + Math.PI, 12);

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
                particleAngle: 0,
                lifeTime: 1
            });
        }
        this.drawHealthBar(this.actor);
    }
};

Hud.prototype.drawHealthBar = function(otherActor){
    var hpPercentage = otherActor.hp / otherActor.initialHp;
    var hpBarCount = otherActor.hpBarCount || this.defaultHpBarCount;
    for (let i = 0; i < hpBarCount; i++){
        let angle = (otherActor !== this.actor) ? Utils.angleBetweenPoints(otherActor.position, this.actor.position) : this.actor.angle;
        let offsetPosition = Utils.angleToVector(angle + Utils.degToRad(hpBarCount/2*3) - Utils.degToRad(i*3) + Math.PI, 8);
        this.particleManager.createParticle('particleAddHUDSquare', {
            positionX: otherActor.position[0] + offsetPosition[0],
            positionY: otherActor.position[1] + offsetPosition[1],
            positionZ: otherActor !== this.actor ? -5 : -Constants.DEFAULT_POSITION_Z,
            colorR: i >= hpPercentage * hpBarCount ? 1 : 0,
            colorG: i < hpPercentage * hpBarCount ? 1 : 0,
            colorB: 0,
            scale: 0.75,
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: 0,
            particleAngle: angle,
            lifeTime: 1
        });
    }
};

module.exports = Hud;
