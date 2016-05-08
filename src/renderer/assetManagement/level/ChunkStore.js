var ChunkStore = {
    geometries: {},
    materials: {},
    hitmaps: {},

    get: function(name) {
        return {
            geometry: this.geometries[name],
            material: this.materials[name],
            hitmap: this.hitmaps[name]
        };
    },

    loadBatch: function(batch) {
        Object.keys(batch).forEach( function(chunkName){
            this.addHitmap(chunkName, batch[chunkName].hitmap);
            this.addGeometry(chunkName, batch[chunkName].geometry);
            this.addMaterial(chunkName, batch[chunkName].material);
        }.bind(this));
    },

    addHitmap: function(name, hitmap) {
        this.hitmaps[name] = hitmap;
    },

    addGeometry: function(name, geometry) {
        this.geometries[name] = geometry;
    },

    addMaterial: function(name, material) {
        this.materials[name] = material instanceof Array ? material[0] : material;
    },

    serializeHitmaps: function(){
        return JSON.stringify(this.hitmaps);
    }
};

module.exports = ChunkStore;
