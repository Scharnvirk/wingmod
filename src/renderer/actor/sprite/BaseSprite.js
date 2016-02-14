function BaseSprite(config){
    THREE.Sprite.apply(this, arguments);

    config = config || {};
    Object.assign(this, config);

}

BaseSprite.extend(THREE.Sprite);

BaseSprite.prototype.update = function(){
    if(this.actor){
        this.position.x = this.actor.position[0];
        this.position.y = this.actor.position[1];
        this.position.z = this.actor.positionZ;
        //this.rotation.z = this.actor.angle + this.angleOffset;
    }
};
