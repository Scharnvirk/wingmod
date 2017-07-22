var EnemyActor = require('renderer/actor/enemy/EnemyActor');

function ChampionEnemyActor(config){
    EnemyActor.apply(this, arguments);    
    this.props.spawnTime = 120;
}

ChampionEnemyActor.extend(EnemyActor); 

ChampionEnemyActor.prototype.customUpdate = function(){
    this.doBob();
    this.showDamage();
    this._doSpawnInitAnimation();
};

ChampionEnemyActor.prototype._doSpawnInitAnimation = function() {
    if (this.state.spawnTimer <= 0) return;

    this.state.spawnTimer --;

    const intensity = (this.state.spawnTime - this.state.spawnTimer) * 2;

    if (this.state.spawnTimer === 0) {
        this._doSpawnInitBlast();
    }

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'PURPLE',
        scale: Utils.rand(intensity/5, intensity/5 + 20),
        alpha: intensity/480,
        alphaMultiplier: 0.8,
        lifeTime: 2
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'WHITE',
        scale: Utils.rand(intensity/10, intensity/10 + 10),
        alpha: intensity/480,
        alphaMultiplier: 0.8,
        lifeTime: 2
    });

    for(let i = 0; i < intensity/15; i++){
        let rotation = Utils.rand(0,360);
        var offsetPosition = Utils.rotationToVector(rotation, Utils.rand(20,30));
        this.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPosition[0],
            offsetPositionY: offsetPosition[1],
            color: 'PURPLE',
            scale: 0.4 + intensity/300,
            alpha: 0.2,
            alphaMultiplier: 1.2,
            particleVelocity: -(Utils.rand(intensity/15, intensity/10)/10),
            particleRotation: rotation,
            speedZ: Utils.rand(-40, 40) / 100,
            lifeTime: 12,
            spriteNumber: 2
        });
    }
}

ChampionEnemyActor.prototype._doSpawnInitBlast = function(){
    var pointCount = 8;
    for (let i = 0; i < pointCount; i++){
        this.createParticle({
            particleClass: 'particleAdd',
            color: 'PURPLE',
            scale: 50,
            alpha: 0.25,
            alphaMultiplier: 0.7,
            particleVelocity: 2,
            particleRotation: (360/pointCount) * i,
            lifeTime: 5
        });

        this.createParticle({
            particleClass: 'particleAdd',
            color: 'WHITE',
            scale: 50,
            alpha: 0.25,
            alphaMultiplier: 0.7,
            particleVelocity: 2,
            particleRotation: (360/pointCount) * i,
            lifeTime: 5
        });
    }
}

module.exports = ChampionEnemyActor;