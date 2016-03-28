var ParticleShaders = require("renderer/particleSystem/ParticleShaders");

function ParticleConfigBuilder(config){
    this.particleMaterialConfig = {
        smokePuffAlpha: new THREE.ShaderMaterial( {
             uniforms: {
                 map: { type: 't', value: new THREE.TextureLoader().load( window.location.href + "gfx/smokePuffAlpha.png" )},
                 time: { type: "f", value: 1.0 },
             },
             vertexShader: ParticleShaders.vertexShader,
             fragmentShader: ParticleShaders.fragmentShader,
             transparent: true,
             depthWrite: false
        }),
        particleAdd: new THREE.ShaderMaterial( {
             uniforms: {
                 map: { type: "t", value: new THREE.TextureLoader().load( window.location.href + "gfx/particleAdd.png" )},
                 time: { type: "f", value: 1.0 },
             },
             vertexShader: ParticleShaders.vertexShader,
             fragmentShader: ParticleShaders.fragmentShader,
             blending: THREE.AdditiveBlending,
             transparent: true,
             depthWrite: false,
        }),
        particleAddHUD: new THREE.ShaderMaterial( {
             uniforms: {
                 map: { type: "t", value: new THREE.TextureLoader().load( window.location.href + "gfx/particleAdd.png" )},
                 time: { type: "f", value: 1.0 },
             },
             vertexShader: ParticleShaders.vertexShader,
             fragmentShader: ParticleShaders.fragmentShader,
             blending: THREE.AdditiveBlending,
             transparent: true,
             depthTest: false,
        }),
        mainExplosionAdd: new THREE.ShaderMaterial( {
             uniforms: {
                 map: { type: "t", value: new THREE.TextureLoader().load( window.location.href + "gfx/particleAdd.png" )},
                 time: { type: "f", value: 1.0 }
             },
             vertexShader: ParticleShaders.vertexShader,
             fragmentShader: ParticleShaders.fragmentShader,
             blending: THREE.AdditiveBlending,
             transparent: true,
             depthWrite: false,
        })
    };

    this.particleGeneratorConfig = {
        smokePuffAlpha: {
            material: this.particleMaterialConfig.smokePuffAlpha,
            maxParticles: 1500 * config.particleLimitMultiplier,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient
        },
        particleAddTrail: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 6000,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient,
        },
        particleAddSplash: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 3000 * config.particleLimitMultiplier,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient,
        },
        particleAddHUD: {
            material: this.particleMaterialConfig.particleAddHUD,
            maxParticles: 200,
            positionZ: 20,
            resolutionCoefficient: config.resolutionCoefficient,
        },
        mainExplosionAdd: {
            material: this.particleMaterialConfig.mainExplosionAdd,
            maxParticles: 500 * config.particleLimitMultiplier,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient
        }
    };
}

ParticleConfigBuilder.prototype.getConfig = function(configName){
    return this.particleGeneratorConfig[configName];
};

ParticleConfigBuilder.prototype.getAllConfigs = function(){
    return this.particleGeneratorConfig;
};

module.exports = ParticleConfigBuilder;
