module.exports = function(config){
    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0] + Utils.rand(-3,3)/5,
        positionY: config.position[1] + Utils.rand(-3,3)/5,
        positionZ: config.positionZ,
        color: 'GREEN',
        scale: Utils.rand(8,14),
        alpha: 0.2,
        alphaMultiplier: 0.75,
        particleVelocity: config.distance,
        speedZ: 0.4,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 5
    });

    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0] + Utils.rand(-3,3)/5,
        positionY: config.position[1] + Utils.rand(-3,3)/5,
        positionZ: config.positionZ,
        color: 'WHITE',
        scale: Utils.rand(3,4),
        alpha: 0.6,
        alphaMultiplier: 0.75,
        particleVelocity: config.distance,
        speedZ: 0.4,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 5
    });

    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        color: 'GREEN',
        scale: 20,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 1
    });

    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        color: 'GREEN',
        scale: 14,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 1
    });
};
