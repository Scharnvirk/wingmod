var ParticleShaders = require("renderer/particleSystem/ParticleShaders");

function ParticleConfigCreator(config){
    this.particleMaterialConfig = {
        smokePuffAlpha: new THREE.ShaderMaterial( {
             uniforms: {
                 map: { type: 't', value: new THREE.TextureLoader().load( window.location.href + "gfx/smokePuffAlpha.png" )},
                 time: { type: "f", value: 1.0 },
                 spriteSheetLength: { type: "f", value: 1.0},
             },
             vertexShader: ParticleShaders.vertexShaderSpriteSheet,
             fragmentShader: ParticleShaders.fragmentShaderSpriteSheet,
             transparent: true,
             depthWrite: false
        }),
        symbolsAlpha: new THREE.ShaderMaterial( {
             uniforms: {
                 map: { type: 't', value: new THREE.TextureLoader().load( window.location.href + "gfx/symbols.png" )},
                 time: { type: "f", value: 72.0 },
             },
             vertexShader: ParticleShaders.symbolVertexShader,
             fragmentShader: ParticleShaders.symbolFragmentShader,
             transparent: true,
             depthWrite: false
        }),
        particleAdd: new THREE.ShaderMaterial( {
             uniforms: {
                 map: { type: "t", value: new THREE.TextureLoader().load( window.location.href + "gfx/shaderSpriteAdd.png" )},
                 time: { type: "f", value: 1.0 },
                 spriteSheetLength: { type: "f", value: 8.0},
             },
             vertexShader: ParticleShaders.vertexShaderSpriteSheet,
             fragmentShader: ParticleShaders.fragmentShaderSpriteSheet,
             blending: THREE.AdditiveBlending,
             transparent: true,
             depthWrite: false
        }),
        particleAddHUD: new THREE.ShaderMaterial( {
             uniforms: {
                 map: { type: "t", value: new THREE.TextureLoader().load( window.location.href + "gfx/shaderSpriteAdd.png" )},
                 time: { type: "f", value: 1.0 },
                 spriteSheetLength: { type: "f", value: 8.0},
             },
             vertexShader: ParticleShaders.vertexShaderSpriteSheet,
             fragmentShader: ParticleShaders.fragmentShaderSpriteSheet,
             blending: THREE.AdditiveBlending,
             transparent: true,
             depthTest: false
        })
    };

    this.particleGeneratorConfig = {
        smokePuffAlpha: {
            material: this.particleMaterialConfig.smokePuffAlpha,
            maxParticles: 2000,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient,
            scene: 'GameScene',
            generator: 'ParticleGenerator'
        },
        particleAdd: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 8000,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient,
            scene: 'GameScene',
            generator: 'ParticleGenerator'
        },
        particleAddHUD: {
            material: this.particleMaterialConfig.particleAddHUD,
            maxParticles: 500,
            positionZ: 20,
            resolutionCoefficient: config.resolutionCoefficient,
            scene: 'GameScene',
            generator: 'ParticleGenerator'
        },
        symbolsAlphaHUD: {
            material: this.particleMaterialConfig.symbolsAlpha,
            maxParticles: 1000,
            positionZ: 10,
            resolutionCoefficient: config.resolutionCoefficient,
            autoUpdate: false,
            scene: 'FlatHudScene',
            generator: 'FlatHudParticleGenerator'
        }
    };
}

ParticleConfigCreator.prototype.getConfig = function(configName){
    return this.particleGeneratorConfig[configName];
};

ParticleConfigCreator.prototype.getAllConfigs = function(){
    return this.particleGeneratorConfig;
};

ParticleConfigCreator.prototype.createPremades = function(){
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
        SmokePuffLargeLong: require("renderer/particleSystem/premade/SmokePuffLargeLong"),
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

module.exports = ParticleConfigCreator;
