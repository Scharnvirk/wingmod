'use strict';

var fs = require('fs');

var BlenderExportFinisher = function(){
    this.propertiesToAlter = {
        default: {
            mapSpecularWrap:["RepeatWrapping","RepeatWrapping"],
            mapDiffuseRepeat:[1,1],
            transparent:false,
            mapDiffuse:"map_256.png",
            DbgIndex:0,
            mapBump:"map_256_B.png",
            mapBumpScale: 3.5,
            wireframe:false,
            opacity:1,
            depthWrite:true,
            mapSpecularAnisotropy:0,
            mapBumpWrap:["RepeatWrapping","RepeatWrapping"],
            colorEmissive:[1,1,1],
            mapDiffuseAnisotropy:1,
            blending:"NormalBlending",
            colorDiffuse:[0.4,0.4,0.4],
            mapSpecularRepeat:[1,1],
            mapBumpAnisotropy:0,
            mapBumpRepeat: null,
            mapSpecular:"map_256_S.png",
            mapEmissive:"map_256_I.png",
            mapLightAnisotropy:0,
            mapLightWrap:["RepeatWrapping","RepeatWrapping"],
            visible:true,
            colorSpecular:[0.3,0.3,0.3],
            shading:"phong",
            specularCoef:40,
            mapDiffuseWrap:["RepeatWrapping","RepeatWrapping"],
            depthTest:true,
            mapEmissiveAnisotropy:0
        },
        terrain: {
            mapSpecularWrap:["RepeatWrapping","RepeatWrapping"],
            mapDiffuseRepeat:[10,10],
            transparent:false,
            mapDiffuse:"rock_512.png",
            DbgIndex:0,
            mapBump:"rock_512_B.png",
            mapBumpScale: 5,
            wireframe:false,
            opacity:1,
            depthWrite:true,
            mapSpecularAnisotropy:0,
            mapBumpWrap:["RepeatWrapping","RepeatWrapping"],
            mapDiffuseWrap:["RepeatWrapping","RepeatWrapping"],
            mapDiffuseAnisotropy:1,
            blending:"NormalBlending",
            colorDiffuse:[0.4,0.4,0.4],
            mapSpecularRepeat:[10,10],
            mapBumpAnisotropy:0,
            mapBumpRepeat:[10,10],
            mapSpecular:"rock_512_S.png",
            mapLightAnisotropy:0,
            visible:true,
            colorSpecular:[0.3,0.3,0.3],
            shading:"phong",
            specularCoef:40,
            depthTest:true,
            mapEmissiveAnisotropy:0
        }
    };

    this.fileName = process.argv[2];

    this.type = process.argv[3];

    if (!this.fileName){
        throw new Error("No filename for Blender Export Cleaner specified!");
    }

    var file = fs.readFileSync(this.fileName);
    this.objectConfig = JSON.parse(file);
};

BlenderExportFinisher.prototype.fixMaterials = function(){
    if (!this.objectConfig.materials){
        throw new Error("No materials in " + this.fileName);
    }

    let materialType = this.type || 'default';

    this.alterProperties(materialType);

    this.resave();
};

BlenderExportFinisher.prototype.alterProperties = function(materialType){
    this.objectConfig.materials.forEach(material => {
        for (var propertyName in this.propertiesToAlter[materialType]){
            var property = this.propertiesToAlter[materialType][propertyName];
            if (property !== undefined && property !== null){
                material[propertyName] = property;
            } else {
                delete material[propertyName];
            }
        }
    });
};

BlenderExportFinisher.prototype.resave = function(){
    var newFileContent = JSON.stringify(this.objectConfig, null, '\t');
    fs.writeFileSync(this.fileName, newFileContent);
};


var cleaner = new BlenderExportFinisher();
cleaner.fixMaterials();
