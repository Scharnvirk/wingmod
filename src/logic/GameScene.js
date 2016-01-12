function GameScene(config){
    Object.assign(this, config);
    if(!this.world) throw new Error('No world specified for Logic GameScene');
    if(!this.actorManager) throw new Error('No actorManager specified for Logic GameScene');
}

GameScene.prototype.fillScene = function(){
    for (let i = 0; i < 1000; i++){
       this.actorManager.addNew([ActorFactory.MOOK_ACTOR, Utils.rand(-200,200), Utils.rand(-200,200), Utils.rand(0,360)]);
   }
   console.log("scene complete");
};
