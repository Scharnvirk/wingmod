//PRAWDOPODOBNIE DEPRECATED
//bez deferred lightning shadera nie moge tego uzywac

function BaseLight(config){
    THREE.PointLight.apply(this, arguments);
    config = config || {};

    this.zOffset = 30;
    this.distance = 100;
    this.color = config.color || new THREE.Color(0xffffff);

    Object.assign(this, config);

    //UWAGA: trzeba wszystkim materialom ustawic needsUpdate na true kiedy dodaje sie *nowe* swiatlo do sceny!!!!!!!!!!!!!!!!
    if (this.color instanceof THREE.Color === false) throw new Error('No color for a light!');
}

BaseLight.extend(THREE.PointLight);

BaseLight.prototype.update = function(){
    if(this.actor){
        this.position.x = this.actor.position[0];
        this.position.y = this.actor.position[1];
        this.position.z = this.actor.positionZ + this.zOffset;
    }
};
