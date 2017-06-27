module.exports = function(config){
    for (let i = 0; i < 80; i++){
        config.particleManager.createParticle('particleAdd',{
            positionX: config.position[0],
            positionY: config.position[1],
            color: 'RED',
            scale: 16,
            alpha: 0.5,
            alphaMultiplier: 0.75,
            particleVelocity: 4,
            particleRotation: Utils.rand(0,360),
            lifeTime: 14
        });
    }

    for (let i = 0; i < 30; i++){
        config.particleManager.createParticle('smokePuffAlpha',{
            positionX: config.position[0],
            positionY: config.position[1],
            color: 'GREY',
            scale: Utils.rand(40, 80),
            alpha: Utils.rand(0.4, 0.6),
            alphaMultiplier: 0.95,
            particleVelocity: Utils.rand(0,10) / 20,
            particleRotation: Utils.rand(0,360),
            speedZ: Utils.rand(-10,10) / 26,
            lifeTime: Utils.rand(80, 90)
        });
    }

    for (let i = 0; i < 30; i++){
        config.particleManager.createParticle('particleAdd',{
            positionX: config.position[0] + Utils.rand(-15,15),
            positionY: config.position[1] + Utils.rand(-15,15),
            color: 'WHITE',
            scale: Utils.rand(20, 30),
            alpha: Utils.rand(0.4, 0.9)/10 + 0.1,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(4,5) / 20,
            particleRotation: Utils.rand(0,360),
            speedZ: Utils.rand(-10,10) / 18,
            lifeTime: Utils.rand(20, 30)
        });
    }

    for (let i = 0; i < 30; i++){
        config.particleManager.createParticle('particleAdd',{
            positionX: config.position[0] + Utils.rand(-10,10),
            positionY: config.position[1] + Utils.rand(-10,10),
            color: 'ORANGE',
            scale: Utils.rand(25, 40),
            alpha: Utils.rand(0.4, 0.9)/10 + 0.1,
            alphaMultiplier: 0.92,
            particleVelocity: Utils.rand(4,5) /20,
            particleRotation: Utils.rand(0,360),
            speedZ: Utils.rand(-10,10) / 18,
            lifeTime: Utils.rand(20, 30)
        });
    }

    for (let i = 0; i < 30; i++){
        config.particleManager.createParticle('particleAdd',{
            positionX: config.position[0] + Utils.rand(-15,15),
            positionY: config.position[1] + Utils.rand(-15,15),
            color: 'RED',
            scale: Utils.rand(30, 60),
            alpha: Utils.rand(0.4, 0.9)/10 + 0.1,
            alphaMultiplier: 0.93,
            particleVelocity: Utils.rand(4,5) /20,
            particleRotation: Utils.rand(0,360),
            speedZ: Utils.rand(-10,10) / 18,
            lifeTime: Utils.rand(20, 30)
        });
    }

    for (let i = 0; i < 60; i++){
        config.particleManager.createParticle('particleAdd',{
            positionX: config.position[0],
            positionY: config.position[1],
            color: 'ORANGE',
            scale: 1.2,
            alpha: 1,
            alphaMultiplier: 0.95,
            particleVelocity: Utils.rand(1, 20) / 10,
            particleRotation: Utils.rand(0,360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10,50)
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        color: 'WHITE',
        scale: 150,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 20
    });

    
};
