module.exports = function(config){
    for(let i = 0; i < 5; i++){
        var offsetPosition = Utils.rotationToVector(config.rotation, -i*0.7);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 2.2-0.4*i,
            alpha: 1-0.19*i,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleRotation: config.rotation,
            lifeTime: 1
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 0.3,
        colorG: 1,
        colorB: 0.5,
        scale: Utils.rand(4,10),
        alpha: 0.5,
        alphaMultiplier: 0.6,
        particleVelocity: 1,
        particleRotation: config.rotation,
        lifeTime: 2
    });
};
