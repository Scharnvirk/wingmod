var ParticleShaders = require("renderer/particleSystem/ParticleShaders");

function ParticleConfigBuilder(config){
    this.particleMaterialConfig = {
        smokePuffAlpha: new THREE.ShaderMaterial( {
             uniforms: { map: { type: "t", value: new THREE.TextureLoader().load( window.location.href + "gfx/smokePuffAlpha.png" ) }},
             vertexShader: ParticleShaders.vertexShader,
             fragmentShader: ParticleShaders.fragmentShader,
             transparent: true,
             depthWrite: false
        }),
        particleAdd: new THREE.ShaderMaterial( {
             uniforms: { map: { type: "t", value: new THREE.TextureLoader().load( window.location.href + "gfx/particleAdd.png" ) }},
             vertexShader: ParticleShaders.vertexShader,
             fragmentShader: ParticleShaders.fragmentShader,
             blending: THREE.AdditiveBlending,
             transparent: true,
             depthWrite: false
        }),
        mainExplosionAdd: new THREE.ShaderMaterial( {
             uniforms: { map: { type: "t", value: new THREE.TextureLoader().load( window.location.href + "gfx/particleAdd.png" ) }},
             vertexShader: ParticleShaders.vertexShader,
             fragmentShader: ParticleShaders.fragmentShader,
             blending: THREE.AdditiveBlending,
             transparent: true,
             depthWrite: false
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
            resolutionCoefficient: config.resolutionCoefficient
        },
        particleAddSplash: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 3000 * config.particleLimitMultiplier,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient
        },
        mainExplosionAdd: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 500 * config.particleLimitMultiplier,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient
        }
    };

    console.log(this.particleGeneratorConfig);
}

ParticleConfigBuilder.prototype.getConfig = function(configName){
    return this.particleGeneratorConfig[configName];
};

ParticleConfigBuilder.prototype.getAllConfigs = function(){
    return this.particleGeneratorConfig;
};

module.exports = ParticleConfigBuilder;
