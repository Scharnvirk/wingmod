class ModelLoader{
    constructor(){
        this.batch = {};
        Utils.mixin(this, THREE.EventDispatcher);
    }

    makeTexturePath(){

    }

    loadModels(modelPaths){
        if(!modelPaths) throw "ERROR: No model paths have been specified for the loader!";
        var loader = new THREE.JSONLoader();

        Promise.all(modelPaths.map(modelPath => {
            var willLoadModels = new Promise((resolve, reject) => {
                loader.load(modelPath, (geometry, material) => {
                    this.batch[this.getModelName(modelPath)] = {
                        geometry: geometry,
                        material: material,
                        texture: material.texture
                    };
                    resolve();
                }, this.getDefaultTexturePath(modelPath));
            });
            return willLoadModels;
        })).then(this.loadTextures.bind(this)).then(this.doneAction.bind(this));
    }

    loadTextures(){
        Promise.all(Object.keys(this.batch).map(modelKey => {
            var willLoadTextures = new Promise((resolve, reject) => {
                THREE.ImageUtils.loadTexture(this.batch[modelKey].texture, {}, (texture) => {
                    //this.batch[modelKey].material.map = texture;
                    resolve();
                });
            });
            return willLoadTextures;
        }));
    }

    getBatch(){
        return this.batch;
    }

    clearBatch(){
        this.batch = {};
    }

    doneAction(){
        this.dispatchEvent({type:'loaded'});
    }

    getModelName(path){
        var name = path.split('.')[0].split('/').pop();
        if(!name) throw 'ERROR: Bad model path: ' + path;
        return name;
    }

    //ścieżka taka sama jak dla pliku json - podmianka na png i tyle
    getDefaultTexturePath(path){
        return path.replace('json', 'png');
    }
}
