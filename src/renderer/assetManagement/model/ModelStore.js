var ModelStore = {
    materials: {},
    geometries: {},

    get: function(name) {
        return {
            geometry: this.geometries[name],
            material: this.materials[name]
        };
    },

    loadBatch: function(batch) {
        Object.keys(batch).forEach( function(modelName){
            this.addGeometry(modelName, batch[modelName].geometry);
            this.addMaterial(modelName, batch[modelName].material);
        }.bind(this));
    },

    addGeometry: function(name, geometry) {
        this.geometries[name] = geometry;
    },

    addMaterial: function(name, material) {
        if (material) {
            this.materials[name] = material instanceof Array ? material[0] : material;
        }
    }
};

module.exports = ModelStore;
