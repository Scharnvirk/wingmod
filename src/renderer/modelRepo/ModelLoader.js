function ModelLoader(){
    this.batch = {};
    Utils.mixin(this, THREE.EventDispatcher);

}

ModelLoader.prototype.loadModels = function(modelPaths){
    if(!modelPaths) throw "ERROR: No model paths have been specified for the loader!";
    var loader = new THREE.JSONLoader();

    Promise.all(modelPaths.map(modelPath => {
        var willLoadModels = new Promise((resolve, reject) => {
            loader.load(modelPath, (geometry, material) => {
                this.batch[this.getModelName(modelPath)] = {
                    geometry: geometry,
                    material: material
                };
                resolve();
            }, this.getDefaultTexturePath(modelPath));
        });
        return willLoadModels;
    })).then(this.doneAction.bind(this));
};

ModelLoader.prototype.getBatch = function(){
    return this.batch;
};

ModelLoader.prototype.clearBatch = function(){
    this.batch = {};
};

ModelLoader.prototype.doneAction = function(){
    this.dispatchEvent({type:'loaded'});
};

ModelLoader.prototype.getModelName = function(path){
    var name = path.split('.')[0].split('/').pop();
    if(!name) throw 'ERROR: Bad model path: ' + path;
    return name;
};

//ścieżka taka sama jak dla pliku json - podmianka na png i tyle
ModelLoader.prototype.getDefaultTexturePath = function(path){
    return path.replace('json', 'png');
};
