module.exports = function(config){
    for(let i = 0; i < 3; i++){
        var offsetPosition = Utils.angleToVector(config.angle, -i*0.6);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0],
            positionY: config.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 1.5,
            alpha: 1,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: config.angle,
            lifeTime: 1
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 0.3,
        colorB: 0.1,
        scale: 8,
        alpha: 0.8,
        alphaMultiplier: 0.6,
        particleVelocity: 1,
        particleAngle: config.angle,
        lifeTime: 1
    });
};
