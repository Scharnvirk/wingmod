'use strict';

if ('function' === typeof importScripts) {
    importScripts('../../../lib/p2.min.js');
    importScripts('../../../lib/threex.loop.js');

    importScripts('../Utils.js');

    importScripts('../logic/Core.js');
    importScripts('../logic/RenderBus.js');
    importScripts('../logic/World.js');
    importScripts('../logic/GameScene.js');

    importScripts('../logic/actorManagement/ActorManager.js');

    importScripts('../logic/actor/BaseActor.js');
    importScripts('../logic/actor/MookActor.js');
    importScripts('../logic/actor/ShipActor.js');
    importScripts('../logic/actor/LightActor.js');
    importScripts('../logic/actor/WallActor.js');

    importScripts('../logic/actor/body/BaseBody.js');

    importScripts('../renderer/actorManagement/ActorFactory.js');

    self.core = new Core(self);
}
//# sourceMappingURL=Init.js.map
