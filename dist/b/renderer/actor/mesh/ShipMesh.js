'use strict';

function ShipMesh(config) {
    BaseMesh.apply(this, arguments);
    this.angleOffset = 180;

    config = config || {};
    config.geometry = ModelStore.get('ship').geometry;
    config.material = ModelStore.get('ship').material;
    Object.assign(this, config);
}

ShipMesh.extend(BaseMesh);
//# sourceMappingURL=ShipMesh.js.map
