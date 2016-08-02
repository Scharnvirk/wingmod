function FlatHud(config){
    Object.assign(this, config);

    if(!this.sceneManager) throw new Error('No sceneManager defined for FlatHud!');
    if(!this.renderer) throw new Error('No renderer defined for FlatHud!');
}

FlatHud.prototype.update = function(){
    this.sceneManager.render('FlatHudScene');
};

module.exports = FlatHud;
