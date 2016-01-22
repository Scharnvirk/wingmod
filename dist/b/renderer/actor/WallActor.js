"use strict";

function WallActor() {
    BaseActor.apply(this, arguments);
}

WallActor.extend(BaseActor);

WallActor.prototype.createMesh = function () {
    return new WallMesh({ actor: this });
};
//# sourceMappingURL=WallActor.js.map
