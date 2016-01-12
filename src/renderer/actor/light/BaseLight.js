function BaseLight(config){
    THREE.PointLight.apply(this, arguments);
    config = config || {};

    this.zOffset = 10;
    this.distance = 50;
    this.color = config.color || new THREE.Color(0xffffff);
    this.followActor = true;

    Object.assign(this, config);

    //UWAGA: trzeba wszystkim materialom ustawic needsUpdate na true kiedy dodaje sie *nowe* swiatlo do sceny!!!!!!!!!!!!!!!!
    if (this.color instanceof THREE.Color === false) throw new Error('No color for a light!');
}

BaseLight.extend(THREE.PointLight);

BaseLight.prototype.update = function(){
    if(this.actor && this.followActor){
        this.position.x = this.actor.position[0];
        this.position.y = this.actor.position[1];
        this.position.z = this.actor.positionZ + this.zOffset;
    }
};
