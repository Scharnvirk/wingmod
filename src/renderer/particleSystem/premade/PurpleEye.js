module.exports = function(config){
    config.particleManager.createParticle('particleAddTrail',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 1,
        colorG: 0,
        colorB: 1,
        scale: 5,
        alpha: 0.4,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1
    });

    config.particleManager.createParticle('particleAddTrail',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 1,
        colorG: 0.2,
        colorB: 1,
        scale: 1.5,
        alpha: 1,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleAngle: config.angle + Utils.degToRad(config.angleOffset),
        lifeTime: 1
    });
};
