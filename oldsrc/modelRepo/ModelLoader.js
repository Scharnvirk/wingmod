class ModelLoader{
    constructor(modelPaths){
        if(!modelPaths) throw "ERROR: No model paths have been specified for the loader!";
        this.modelPaths = modelPaths;
        this.batch = {};
        this.loaded = true;

        Utils.mixin(this, THREE.EventDispatcher);
    }

    loadModels(){
        if(!this.loaded) throw 'ERROR: ModelLoader is still busy loading previous batch!';

        this.loaded = false;

        var loader = new THREE.JSONLoader();
        this.modelPaths.forEach((modelPath, index)=>{
            this.batch[this._getModelName(modelPath)] = {
                geometry: null,
                material: null,
                loaded: false
            };

            loader.load(modelPath, (geometry, material) => {
                var model = this.batch[this._getModelName(modelPath)];
                model.geometry = geometry;
                model.material = material;
                model.loaded = true;

                if(this.checkIfLoaded()){
                    this._doneAction();
                }
            });
        });
    }

    checkIfLoaded(){
        var result = true;

        for (var modelName in this.batch) {
            if(!this.batch[modelName].loaded){
                result = false;
                return false;
            }
        }

        return result;
    }

    getBatch(){
        return this.batch;
    }

    clearBatch(){
        this.batch = {};
    }

    _doneAction(){
        this.loaded = true;
        this.dispatchEvent({type:'loaded'});
    }

    _getModelName(path){
        var name = path.split('.')[0].split('/').pop();
        if(!name) throw 'ERROR: Bad model path: ' + path;
        return name;
    }
}
