function FlatHud(config){
    Object.assign(this, config);

    if(!this.sceneManager) throw new Error('No sceneManager defined for FlatHud!');
}

FlatHud.prototype.update = function(){
    this.sceneManager.render('FlatHudScene');
};

FlatHud.prototype.onPlayerActorAppeared = function(actor){
    this.actor = actor;
};

module.exports = FlatHud;
