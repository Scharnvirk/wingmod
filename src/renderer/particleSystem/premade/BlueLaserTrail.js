module.exports = function(config){
    for(let i = 0; i < 15; i++){
        let offsetPosition = Utils.angleToVector(config.angle, -i*0.6);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 1,
            alpha: 1-0.05*i,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: config.angle,
            lifeTime: 1
        });
    }

    for(let i = 0; i < 5; i++){
        let offsetPosition = Utils.angleToVector(config.angle, -i*1.8);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0] + offsetPosition[0],
            positionY: config.position[1] + offsetPosition[1],
            colorR: 0.3,
            colorG: 0.3,
            colorB: 1,
            scale: 5,
            alpha: 0.7-0.1*i,
            alphaMultiplier: 0.6,
            particleVelocity: 2,
            particleAngle: config.angle,
            lifeTime: 1
        });
    }
};
