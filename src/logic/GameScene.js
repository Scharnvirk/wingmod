function GameScene(config){
    Object.assign(this, config);
    if(!this.world) throw new Error('No world specified for Logic GameScene');
    if(!this.actorManager) throw new Error('No actorManager specified for Logic GameScene');
}

GameScene.prototype.fillScene = function(){
    for (let i = 0; i < 500; i++){
        this.actorManager.addNew([ActorFactory.MOOK_ACTOR, Utils.rand(-150,150), Utils.rand(-150,150), Utils.rand(0,360)]);
    }
    this.actorManager.addNew([ActorFactory.WALL_ACTOR, 0, -200, 0]);
    this.actorManager.addNew([ActorFactory.WALL_ACTOR, 0, 200, 0]);
    this.actorManager.addNew([ActorFactory.WALL_ACTOR, 200, 0, Math.PI/2]);
    this.actorManager.addNew([ActorFactory.WALL_ACTOR, -200, 0, Math.PI/2]);
    var playerActor = this.actorManager.addNew([ActorFactory.SHIP_ACTOR, 0,0,0]);
    this.actorManager.setPlayerActor(playerActor);
    console.log("scene complete");
};
