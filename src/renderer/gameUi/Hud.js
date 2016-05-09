function Hud(config){
    Object.assign(this, config);

    if(!this.actorManager) throw new Error('No actorManager defined for MainContainer!');
    if(!this.particleManager) throw new Error('No particleManager defined for MainContainer!');

}

Hud.prototype.update = function(){
    if(this.actor && !this.actor.dead){
        for (let enemyId in this.actorManager.enemies ){
            let enemyActor = this.actorManager.enemies[enemyId];
            this.drawHealthBar(enemyActor);
            let angle = Utils.angleBetweenPoints(enemyActor.position, this.actor.position);
            let offsetPosition = Utils.angleToVector(angle + Math.PI, 12);
            this.particleManager.createParticle('particleAddHUD', {
                positionX: this.actor.position[0] + offsetPosition[0],
                positionY: this.actor.position[1] + offsetPosition[1],
                positionZ: -Constants.DEFAULT_POSITION_Z,
                colorR: 1,
                colorG: 0,
                colorB: 0,
                scale: 1.5,
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
    for (let i = 0; i < otherActor.initialHp; i++){
        let angle = (otherActor !== this.actor) ? Utils.angleBetweenPoints(otherActor.position, this.actor.position) : this.actor.angle;
        let offsetPosition = Utils.angleToVector(angle + Utils.degToRad(otherActor.initialHp/2*3) - Utils.degToRad(i*3) + Math.PI, 8);
        this.particleManager.createParticle('particleAddHUDSquare', {
            positionX: otherActor.position[0] + offsetPosition[0],
            positionY: otherActor.position[1] + offsetPosition[1],
            positionZ: otherActor !== this.actor ? -5 : -Constants.DEFAULT_POSITION_Z,
            colorR: i >= otherActor.hp ? 1 : 0,
            colorG: i < otherActor.hp ? 1 : 0,
            colorB: 0,
            scale: 1,
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: 0,
            particleAngle: angle,
            lifeTime: 1
        });
    }
};

module.exports = Hud;
