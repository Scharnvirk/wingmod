"use strict";

function WallActor(configArray) {
    configArray = configArray || [];
    BaseActor.apply(this, arguments);
}

WallActor.extend(BaseActor);

WallActor.prototype.createBody = function () {
    return new BaseBody({
        actor: this,
        mass: 0,
        sizeX: 400,
        sizeY: 2
    });
};
//# sourceMappingURL=WallActor.js.map
