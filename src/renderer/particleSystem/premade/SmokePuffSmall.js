module.exports = function(config){
    config.particleManager.createParticle('smokePuffAlpha',{
        positionX: config.position[0] + Utils.rand(-2,2),
        positionY: config.position[1] + Utils.rand(-2,2),
        color: 'WHITE',
        scale: Utils.rand(2,5),
        alpha: Utils.rand(0,3)/10 + 0.1,
        alphaMultiplier: 0.95,
        particleVelocity: Utils.rand(0,10) / 100,
        particleRotation: Utils.rand(0,360),
        speedZ: Utils.rand(0,10) / 100,
        lifeTime: 120
    });
};
