module.exports = function(config){
    for(let i = 0; i < 6; i++){
        let offsetPosition = Utils.rotationToVector(config.rotation, -i*0.3);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            color: 'WHITE',
            scale: 0.6,
            alpha: 1-0.1*i,
            alphaMultiplier: 0.8,
            particleVelocity: 2,
            particleRotation: config.rotation,
            lifeTime: 1
        });
    }

    for(let i = 0; i < 3; i++){
        let offsetPosition = Utils.rotationToVector(config.rotation, -i*0.9);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            color: 'ORANGE',
            scale: 1.8,
            alpha: 0.7-0.15*i,
            alphaMultiplier: 0.6,
            particleVelocity: 1.5,
            particleRotation: config.rotation,
            lifeTime: 1
        });
    }
};
