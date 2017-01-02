module.exports = function(config){
    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        color: 'BLUE',
        scale: Utils.rand(6,11),
        alpha: 0.4,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 1
    });

    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        color: 'WHITE',
        scale: Utils.rand(2,3),
        alpha: 1,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 1
    });
};
