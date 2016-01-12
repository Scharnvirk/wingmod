"use strict";

function ShipActor() {
    BaseActor.apply(this, arguments);
}

ShipActor.prototype.createMesh = function () {
    return new ShipMesh();
};

ShipActor.extend(BaseActor);
//# sourceMappingURL=ShipActor.js.map
