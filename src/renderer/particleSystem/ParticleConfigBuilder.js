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
             shading: THREE.FlatShading
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
        particleAddHUDSquare: new THREE.ShaderMaterial( {
             uniforms: {
                 map: { type: "t", value: new THREE.TextureLoader().load( window.location.href + "gfx/particleSquareAdd.png" )},
                 time: { type: "f", value: 1.0 },
             },
             vertexShader: ParticleShaders.vertexShader,
             fragmentShader: ParticleShaders.fragmentShader,
             blending: THREE.AdditiveBlending,
             transparent: true,
             depthTest: false,
        }),
        particleAdd: new THREE.ShaderMaterial( {
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
            maxParticles: 1000,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient
        },
        particleAdd: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 8000,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient,
        },
        particleAddHUD: {
            material: this.particleMaterialConfig.particleAddHUD,
            maxParticles: 100,
            positionZ: 20,
            resolutionCoefficient: config.resolutionCoefficient,
        },
        particleAddHUDSquare: {
            material: this.particleMaterialConfig.particleAddHUDSquare,
            maxParticles: 400,
            positionZ: 20,
            resolutionCoefficient: config.resolutionCoefficient,
        }
    };
}

ParticleConfigBuilder.prototype.getConfig = function(configName){
    return this.particleGeneratorConfig[configName];
};

ParticleConfigBuilder.prototype.getAllConfigs = function(){
    return this.particleGeneratorConfig;
};

ParticleConfigBuilder.prototype.buildPremades = function(){
    return {
        BlueSparks: require("renderer/particleSystem/premade/BlueSparks"),
        BlueLaserTrail: require("renderer/particleSystem/premade/BlueLaserTrail"),
        OrangeTrail: require("renderer/particleSystem/premade/OrangeTrail"),
        OrangeBoomTiny: require("renderer/particleSystem/premade/OrangeBoomTiny"),
        GreenTrail: require("renderer/particleSystem/premade/GreenTrail"),
        GreenBoomTiny: require("renderer/particleSystem/premade/GreenBoomTiny"),
        EngineGlowMedium: require("renderer/particleSystem/premade/EngineGlowMedium"),
        EngineGlowSmall: require("renderer/particleSystem/premade/EngineGlowSmall"),
        OrangeBoomLarge: require("renderer/particleSystem/premade/OrangeBoomLarge"),
        SmokePuffSmall: require("renderer/particleSystem/premade/SmokePuffSmall"),
        OrangeBoomMedium: require("renderer/particleSystem/premade/OrangeBoomMedium"),
        RedLaserTrail: require("renderer/particleSystem/premade/RedLaserTrail"),
        RedSparks: require("renderer/particleSystem/premade/RedSparks"),
        RedEye: require("renderer/particleSystem/premade/RedEye"),
        RedEyeBig: require("renderer/particleSystem/premade/RedEyeBig"),
        PurpleEye: require("renderer/particleSystem/premade/PurpleEye"),
        PurpleLaserTrail: require("renderer/particleSystem/premade/PurpleLaserTrail"),
        PurpleSparks: require("renderer/particleSystem/premade/PurpleSparks")
    };
};

module.exports = ParticleConfigBuilder;
