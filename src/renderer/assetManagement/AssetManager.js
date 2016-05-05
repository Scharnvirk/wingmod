var ModelLoader = require("renderer/assetManagement/model/ModelLoader");
var ModelList = require("renderer/assetManagement/model/ModelList");
var ModelStore = require("renderer/assetManagement/model/ModelStore");
var CustomModelBuilder = require("renderer/assetManagement/model/CustomModelBuilder");

function AssetManager(config) {
    config = config || {};
    Object.assign(this, config);

    EventEmitter.apply(this, arguments);
}

AssetManager.extend(EventEmitter);

AssetManager.prototype.loadAll = function(){
    this.loadModels();
    this.loadLevels();
};

AssetManager.prototype.loadModels = function(){
    this.modelLoader = new ModelLoader();
    this.modelLoader.addEventListener('loaded', this.modelsLoaded.bind(this));
    this.modelLoader.loadModels(ModelList.models);

    this.customModelBuilder = new CustomModelBuilder();
    this.customModelBuilder.loadModels();
    ModelStore.loadBatch(this.customModelBuilder.getBatch());
};

AssetManager.prototype.modelsLoaded = function(event){
    ModelStore.loadBatch(this.modelLoader.getBatch());
    this.modelLoader.clearBatch();
    this.emit({
        type: 'assetsLoaded'
    });
};

AssetManager.prototype.loadLevels = function(){

};

module.exports = AssetManager;
