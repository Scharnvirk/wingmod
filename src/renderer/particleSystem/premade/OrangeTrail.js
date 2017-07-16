module.exports = function(config){
    var offsetPosition;
    for(let i = 0; i < 5; i++){
        offsetPosition = Utils.rotationToVector(config.rotation, -i*0.6);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            color: 'WHITE',
            scale: 2.5-0.25*i,
            alpha: 1-0.15*i,
            alphaMultiplier: 0.6,
            particleVelocity: 2,
            particleRotation: config.rotation,
            lifeTime: 1,
            spriteNumber: 2
        });
    }

    for(let i = 0; i < 3; i++){
        offsetPosition = Utils.rotationToVector(config.rotation, -i*2);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            color: 'ORANGE',
            scale: Utils.rand(5,11),
            alpha: 0.6-0.15*i,
            alphaMultiplier: 0.6,
            particleVelocity: 2,
            particleRotation: config.rotation,
            lifeTime: 1
        });
    }

    
};
