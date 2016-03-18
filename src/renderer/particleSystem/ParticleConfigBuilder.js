var ParticleShaders = require("renderer/particleSystem/ParticleShaders");

function ParticleConfigBuilder(config){

    this.particleFamilyTypeConfigs = {
        particleAdd: {
            lightGreenTrail: {
                colorR: 0.7,
                colorG: 1,
                colorB: 0.9,
                scale: 2,
                alpha: 1,
                alphaMultiplier: 0.4,
                lifetime: 5
            },
            whiteFlashSmall: {
                colorR: 1,
                colorG: 1,
                colorB: 1,
                scale: 3,
                alpha: 1,
                alphaMultiplier: 0.4,
                lifetime: 2
            },
            greenFlashBig: {
                colorR: 0.3,
                colorG: 1,
                colorB: 0.5,
                scale: 10,
                alpha: 0.3,
                alphaMultiplier: 0.91,
                lifetime: 2
            },
        }
    };

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
                // types: { type: 'fv1', value: this.buildTypeParameters('particleAdd')},
             },
             vertexShader: ParticleShaders.vertexShader,
             fragmentShader: ParticleShaders.fragmentShader,
             blending: THREE.AdditiveBlending,
             transparent: true,
             depthWrite: false,
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
            types: this.buildTypeList('particleAdd')
        },
        particleAddSplash: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 3000 * config.particleLimitMultiplier,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient,
            types: this.buildTypeList('particleAdd')
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

ParticleConfigBuilder.prototype.buildTypeParameters = function(particleFamilyName){
    var particleFamilyConfig = this.particleFamilyTypeConfigs[particleFamilyName];
    var i = 0;
    var configArray = [];

    for (var typeConfig in particleFamilyConfig){
        for (var particleProperty in particleFamilyConfig[typeConfig]){
            configArray[i] = particleFamilyConfig[typeConfig][particleProperty];
            i++;
        }
    }

    if (configArray.length > Constants.MAX_SHADER_UNIFORM_SIZE){
        throw ('ERROR: Exceeded max shader uniform size! Got ' + configArray.length + ' and max allowed is ' +  Constants.MAX_SHADER_UNIFORM_SIZE);
    }

    console.log(configArray);

    return configArray;
};

ParticleConfigBuilder.prototype.buildTypeList = function(particleFamilyName){
    var particleFamilyConfig = this.particleFamilyTypeConfigs[particleFamilyName];
    var i = 0;
    var configList = {};

    for (var typeConfig in particleFamilyConfig){
        configList[typeConfig] = i;
        i++;
    }
    return configList;
};

module.exports = ParticleConfigBuilder;
