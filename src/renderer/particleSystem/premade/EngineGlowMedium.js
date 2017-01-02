module.exports = function(config){
    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        color: 'BLUE',
        scale: Utils.rand(10,15),
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
        scale: Utils.rand(3,4),
        alpha: 1,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 1
    });
    
};
