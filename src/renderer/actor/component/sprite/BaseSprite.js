function BaseSprite(config){
    THREE.Sprite.apply(this, arguments);

    config = config || {};
    Object.assign(this, config);

}

BaseSprite.extend(THREE.Sprite);

BaseSprite.prototype.update = function(){
    let position = this.actor.getPosition();
    if (this.actor) {
        this.position.x = position[0];
        this.position.y = position[1];
        this.position.z = this.actor._positionZ;
    }
};
