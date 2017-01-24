function Hud(config){
    Object.assign(this, config);

    if(!this.actorManager) throw new Error('No actorManager defined for Hud!');
    if(!this.particleManager) throw new Error('No particleManager defined for Hud!');

    this.defaultHpBarCount = 5;
    this.defaultShieldBarCount = 5;

    EventEmitter.apply(this, arguments);
}

Hud.extend(EventEmitter);

Hud.prototype.update = function(){
    if(this.actor && this.actor.state.hp > 0){
        this.drawRadar();
        this.drawHealthBarPlayer();
        this.drawShieldBarPlayer();  
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
        
        let color = 'DEEPRED', scale = 0.6, distance = 10;

        switch (enemyActor.props.danger){
        case 1: color = 'DEEPGREEN'; break;            
        case 2: color = 'DEEPYELLOW'; break;
        case 3: color = 'DEEPRED'; break;
        case 4: color = 'PURPLE'; scale = 0.8; distance = 12; break;
        }

        let offsetPosition = Utils.rotationToVector(rotation + Math.PI, distance);

        this.drawHealthBarEnemy(enemyActor);
        if (enemyActor.props.shield) {
            this.drawShieldBarEnemy(enemyActor);
        }

        this.particleManager.createParticle('particleAddHUD', {
            positionX: actorPosition[0] + offsetPosition[0],
            positionY: actorPosition[1] + offsetPosition[1],
            positionZ: -13,
            color: color,
            scale: scale,
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: 0,
            particleRotation: 0,
            lifeTime: 1,
            spriteNumber: 6
        });
    }
};

Hud.prototype.drawHealthBarEnemy = function(otherActor){
    let actorRotation = this.actor.getRotation();
    let otherActorPosition = otherActor.getPosition(); 
    let hpPercentage = otherActor.state.hp / otherActor.props.hp;
    let hpBarCount = otherActor.props.hpBarCount || this.defaultHpBarCount;    
    let positionZ = -5;
    for (let i = 0; i < hpBarCount; i++){
        let offsetPosition = Utils.rotationToVector(actorRotation + Utils.degToRad((hpBarCount - 1)/2*12) - Utils.degToRad(i*12), 8);
        let rest = (hpPercentage * 1000) % (1000/hpBarCount);
        this.particleManager.createParticle('particleAddHUD', {
            positionX: otherActorPosition[0] + offsetPosition[0],
            positionY: otherActorPosition[1] + offsetPosition[1],
            positionZ: positionZ + otherActor.props.barHeight || 0,
            color: ((rest <= 1000 / (hpBarCount * 2)) && rest !== 0) && i+1 >= hpPercentage * hpBarCount || i >= hpPercentage * hpBarCount  ? 'DEEPRED' : 'DEEPGREEN',
            scale: 1.4,
            particleVelocity: 0,
            particleRotation: 0,
            alpha: 1.2,
            alphaMultiplier: 1,
            lifeTime: 1,
            spriteNumber: i >= (hpPercentage * hpBarCount) ? 4 : 5
        });
    }
};

Hud.prototype.drawShieldBarEnemy = function(otherActor){    
    let actorRotation = this.actor.getRotation();
    let otherActorPosition = otherActor.getPosition(); 
    let shieldPercentage = otherActor.state.shield / otherActor.props.shield;
    let shieldBarCount = otherActor.props.shieldBarCount || this.defaultShieldBarCount;
    let positionZ = -4;
    for (let i = 0; i < shieldBarCount; i++){
        let offsetPosition = Utils.rotationToVector(actorRotation + Utils.degToRad((shieldBarCount - 1)/2*12) - Utils.degToRad(i*12), 9);
        let rest = (shieldPercentage * 1000) % (1000/shieldBarCount);
        this.particleManager.createParticle('particleAddHUD', {
            positionX: otherActorPosition[0] + offsetPosition[0],
            positionY: otherActorPosition[1] + offsetPosition[1],
            positionZ: positionZ + otherActor.props.barHeight || 0, 
            color: ((rest <= 1000 / (shieldBarCount * 2)) && rest !== 0) && i+1 >= shieldPercentage * shieldBarCount || i >= shieldPercentage * shieldBarCount  ? 'DEEPRED' : 'DEEPBLUE',
            scale: 1.4,
            particleVelocity: 0,
            particleRotation: 0,
            alpha: 1.2,
            alphaMultiplier: 1,
            lifeTime: 1,
            spriteNumber: i >= (shieldPercentage * shieldBarCount) ? 4 : 5
        });
    }
};

Hud.prototype.drawHealthBarPlayer = function(){
    let actorRotation = this.actor.getRotation();
    let actorPosition = this.actor.getPosition(); 
    let hpPercentage = this.actor.state.hp / this.actor.props.hp;
    let hpBarCount = this.actor.props.hpBarCount || this.defaultHpBarCount;
    let positionZ = -13;
    let rotationOffset = Math.PI/6 * 4;
    for (let i = 0; i < hpBarCount; i++){
        let offsetPosition = Utils.rotationToVector(actorRotation + Utils.degToRad((hpBarCount - 1)/2*5) - Utils.degToRad(i*5) + rotationOffset, 8);
        let rest = (hpPercentage * 1000) % (1000/hpBarCount);
        this.particleManager.createParticle('particleAddHUD', {
            positionX: actorPosition[0] + offsetPosition[0],
            positionY: actorPosition[1] + offsetPosition[1],
            positionZ: positionZ,
            color: ((rest <= 1000 / (hpBarCount * 2)) && rest !== 0) && i+1 >= hpPercentage * hpBarCount || i >= hpPercentage * hpBarCount  ? 'DEEPRED' : 'DEEPGREEN',
            scale: 0.8,
            particleVelocity: 0,
            particleRotation: 0,
            alpha: 1.2,
            alphaMultiplier: 1,
            lifeTime: 1,
            spriteNumber: i >= (hpPercentage * hpBarCount) ? 4 : 5
        });
    }
};

Hud.prototype.drawShieldBarPlayer = function(){
    let actorRotation = this.actor.getRotation();
    let actorPosition = this.actor.getPosition(); 
    let shieldPercentage = this.actor.state.shield / this.actor.props.shield;
    let shieldBarCount = this.actor.props.hpBarCount || this.defaultHpBarCount;
    let positionZ = -13;
    let rotationOffset = -Math.PI/6 * 4; 
    for (let i = 0; i < shieldBarCount; i++){
        let offsetPosition = Utils.rotationToVector(actorRotation + Utils.degToRad((shieldBarCount - 1)/2*5) - Utils.degToRad(i*5) + rotationOffset, 8);
        let rest = (shieldPercentage * 1000) % (1000/shieldBarCount);
        this.particleManager.createParticle('particleAddHUD', {
            positionX: actorPosition[0] + offsetPosition[0],
            positionY: actorPosition[1] + offsetPosition[1],
            positionZ: positionZ,
            color: ((rest <= 1000 / (shieldBarCount * 2)) && rest !== 0) && i+1 >= shieldPercentage * shieldBarCount || i >= shieldPercentage * shieldBarCount  ? 'DEEPRED' : 'DEEPBLUE',
            scale: 0.8,
            particleVelocity: 0,
            particleRotation: 0,
            alpha: 1.2,
            alphaMultiplier: 1,
            lifeTime: 1,
            spriteNumber: i >= (shieldPercentage * shieldBarCount) ? 4 : 5
        });
    }
};

module.exports = Hud;
