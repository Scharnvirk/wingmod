'use strict';

function GameScene(config) {
    Object.assign(this, config);
    if (!this.world) throw new Error('No world specified for Logic GameScene');
    if (!this.actorManager) throw new Error('No actorManager specified for Logic GameScene');
}

GameScene.prototype.fillScene = function () {
    for (var i = 0; i < 1000; i++) {
        this.actorManager.addNew([ActorFactory.MOOK_ACTOR, Utils.rand(-200, 200), Utils.rand(-200, 200), Utils.rand(0, 360)]);
    }
    var playerActor = this.actorManager.addNew([ActorFactory.SHIP_ACTOR, 0, 0, 0]);
    this.actorManager.setPlayerActor(playerActor);
    console.log("scene complete");
};
//# sourceMappingURL=GameScene.js.map
