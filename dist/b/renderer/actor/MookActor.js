"use strict";

function MookActor() {
    BaseActor.apply(this, arguments);
}

MookActor.extend(BaseActor);

MookActor.prototype.createMesh = function () {
    return new ShipMesh({ actor: this });
};
//# sourceMappingURL=MookActor.js.map
