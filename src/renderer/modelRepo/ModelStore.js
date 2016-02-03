var ModelStore = {
    _materials: {},
    _geometries: {},

    get: function(name) {
        return {
            geometry: this._geometries[name],
            material: this._materials[name]
        };
    },

    loadBatch: function(batch) {
        Object.keys(batch).forEach( function(modelName){
            this._addGeometry(modelName, batch[modelName].geometry);
            this._addMaterial(modelName, batch[modelName].material);
        }.bind(this));
    },

    _addGeometry: function(name, geometry) {
        this._geometries[name] = geometry;
    },

    _addMaterial: function(name, material) {
        if (!material) throw 'ERROR - no material specified';
        this._materials[name] = material instanceof Array ? material[0] : material;
    }
};
