var fs = require('fs');

BlenderExportFinisher = function(){
    this.propertiesToAlter = {
        transparent: false,
        DbgColor: null,
        DbgName: null,
        mapBumpScale: null,
        colorSpecular: [0.1, 0.1, 0.1],
        specularCoef: 50,
        mapBump:"map_256_B.png"
    };

    this.fileName = process.argv[2];

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

    this.alterProperties();

    this.resave();
};

BlenderExportFinisher.prototype.alterProperties = function(){
    this.objectConfig.materials.forEach(material => {
        for (var propertyName in this.propertiesToAlter){
            var property = this.propertiesToAlter[propertyName];
            if (property !== undefined && property !== null){
                material[propertyName] = property;
            } else {
                delete material[propertyName];
            }
        }
    });
};

BlenderExportFinisher.prototype.resave = function(){
    var newFileContent = JSON.stringify(this.objectConfig);
    fs.writeFileSync(this.fileName, newFileContent);
};


var cleaner = new BlenderExportFinisher();
cleaner.fixMaterials();
