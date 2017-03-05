var HitmapLoader = require('renderer/assetManagement/level/HitmapLoader');


function ChunkLoader(){ 
    this.batch = {};
 
    this.hitmapLoader = new HitmapLoader();
    this.jsonLoader = new THREE.JSONLoader();

    EventEmitter.apply(this, arguments);  
}

ChunkLoader.extend(EventEmitter);

ChunkLoader.prototype.loadChunks = function(chunks){
    var loaders  = [];
  
    chunks.forEach(chunk => {
        var chunkObject = this.batch[this.getModelName(chunk.model)] = {};

        if (chunk.hitmap){
            var hitmapLoader = new Promise((resolve, reject) => {
                this.hitmapLoader.load(chunk.hitmap, (faceObject) => {
                    chunkObject.hitmap = faceObject;
                    resolve();
                });
            });
            loaders.push(hitmapLoader);
        }

        var modelLoader = new Promise((resolve, reject) => {
            this.jsonLoader.load(chunk.model, (geometry, material) => {
                chunkObject.geometry = geometry;
                chunkObject.material = material;
                resolve();
            });
        });        
        loaders.push(modelLoader);
    });

    Promise.all(loaders).then(this.doneAction.bind(this));
};

ChunkLoader.prototype.doneAction = function(){
    this.emit({type:'loaded'});
};

ChunkLoader.prototype.getBatch = function(){
    return this.batch;
};

ChunkLoader.prototype.clearBatch = function(){
    this.batch = {};
};

ChunkLoader.prototype.getModelName = function(path){
    var name = path.split('.')[0].split('/').pop();
    if(!name) throw 'ERROR: Bad model path: ' + path;
    return name;
};

module.exports = ChunkLoader;
