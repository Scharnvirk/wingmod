var ModelLoader = require("renderer/assetManagement/model/ModelLoader");
var ModelList = require("renderer/assetManagement/model/ModelList");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

var CustomModelBuilder = require("renderer/assetManagement/model/CustomModelBuilder");

var ChunkLoader = require("renderer/assetManagement/level/ChunkLoader");
var ChunkList = require("renderer/assetManagement/level/ChunkList");
var ChunkStore = require("renderer/assetManagement/level/ChunkStore");

var SoundLoader = require("renderer/assetManagement/sound/SoundLoader");

function AssetManager(config) {
    config = config || {};
    Object.assign(this, config);

    this.modelStore = ModelStore;
    this.chunkStore = ChunkStore;
    this.soundLoader = new SoundLoader();

    EventEmitter.apply(this, arguments);
}

AssetManager.extend(EventEmitter);

AssetManager.prototype.loadAll = function(){
    this.soundLoader.loadSounds();

    var loaders = [this.loadModels, this.loadChunks];

    var willLoadModels = new Promise((resolve, reject)=>{
        this.loadModels(resolve);
    });

    var willLoadChunks = new Promise((resolve, reject)=>{
        this.loadChunks(resolve);
    });

    Promise.all([willLoadModels, willLoadChunks]).then(()=>{
        this.modelsLoaded();
        this.chunksLoaded();
        this.emit({
            type: 'assetsLoaded'
        });
    });
};

AssetManager.prototype.loadModels = function(resolve){
    this.modelLoader = new ModelLoader();
    this.modelLoader.on('loaded', resolve);
    this.modelLoader.loadModels(ModelList.models);

    this.customModelBuilder = new CustomModelBuilder();
    this.customModelBuilder.loadModels();
    ModelStore.loadBatch(this.customModelBuilder.getBatch());
};

AssetManager.prototype.modelsLoaded = function(event){
    ModelStore.loadBatch(this.modelLoader.getBatch());
    this.modelLoader.clearBatch();
};

AssetManager.prototype.loadChunks = function(resolve){
    this.chunkLoader = new ChunkLoader();
    this.chunkLoader.on('loaded', resolve);
    this.chunkLoader.loadChunks(ChunkList.chunks);
};

AssetManager.prototype.chunksLoaded = function(event){
    ChunkStore.loadBatch(this.chunkLoader.getBatch());
    this.chunkLoader.clearBatch();
};

module.exports = AssetManager;
