function Hud(config){
    Object.assign(this, config);

    if(!this.actorManager) throw new Error('No actorManager defined for MainContainer!');
    if(!this.particleManager) throw new Error('No particleManager defined for MainContainer!');

}

Hud.prototype.update = function(){
    if(this.actor){
        for (let enemyId in this.actorManager.enemies ){
            let enemyActor = this.actorManager.enemies[enemyId];
            let angle = Utils.angleBetweenPoints(enemyActor.position, this.actor.position);
            let offsetPosition = Utils.angleToVector(angle + Math.PI, 12);
            this.particleManager.createParticle('particleAddHUD', {
                positionX: this.actor.position[0] + offsetPosition[0],
                positionY: this.actor.position[1] + offsetPosition[1],
                colorR: 1,
                colorG: 0,
                colorB: 0,
                scale: 1,
                alpha: 1,
                alphaMultiplier: 1,
                particleVelocity: 0,
                particleAngle: 0,
                lifeTime: 1
            });
        }
    }
};

module.exports = Hud;
