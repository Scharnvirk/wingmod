module.exports = function(config){
    for(let i = 0; i < 10; i++){
        let offsetPosition = Utils.rotationToVector(config.rotation, -i*0.6);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            color: 'WHITE',
            scale: 0.6,
            alpha: 1-0.05*i,
            alphaMultiplier: 0.8,
            particleVelocity: 3,
            particleRotation: config.rotation,
            lifeTime: 1
        });
    }

    for(let i = 0; i < 4; i++){
        let offsetPosition = Utils.rotationToVector(config.rotation, -i*1.8);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            color: 'DEEPRED',
            scale: 1.8,
            alpha: 0.7-0.1*i,
            alphaMultiplier: 0.6,
            particleVelocity: 4.5,
            particleRotation: config.rotation,
            lifeTime: 1
        });
    }
};
