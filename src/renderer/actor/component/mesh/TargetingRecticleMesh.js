var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function TargetingRecticleMesh(config){
    BaseMesh.apply(this, arguments);
    this.distance = config.distance || 100;
    this.minDistance = 20;
    this.maxDistance = 400;
    this.yScale = 4;

    this.offset = 0;

    config = config || {};
    config.geometry = ModelStore.get('targetingRecticle').geometry;
    config.material = ModelStore.get('targetingRecticle').material;
    Object.assign(this, config);

    this.castShadow = false;
    this.receiveShadow = false;
    this.visible = false;
}

TargetingRecticleMesh.extend(BaseMesh);

TargetingRecticleMesh.prototype.customUpdate = function(){
    let offsetPosition = this.actor.getOffsetPosition(this.distance);
    this.position.x = this.position.x + offsetPosition[0];
    this.position.y = this.position.y + offsetPosition[1];

    for (let i = 0, l = 10; i < l; i++) {
        let offsetPosition = this.actor.getOffsetPosition(this.distance * i/10);
        this.actor.createParticle({
            particleClass: 'particleAdd',
            offsetPositionX: offsetPosition[0],
            offsetPositionY: offsetPosition[1],
            color: 'GREEN',
            alphaMultiplier: 0.7,
            scale: 1,
            particleVelocity: 1,
            alpha: 1,
            lifeTime: 1,
        });
    }
};

TargetingRecticleMesh.prototype.updateDistance = function(distance){        
    distance *= -1 / this.yScale;

    let offset;

    if (distance + this.offset < this.minDistance) {
        offset = this.minDistance - distance;
        if (offset > this.offset){
            this.offset = offset;
        }
    } else if (distance + this.offset > this.maxDistance){
        offset = this.maxDistance - distance;
        if (offset < this.offset){
            this.offset = offset;
        }
    }
    
    this.distance = distance + this.offset;    
};

module.exports = TargetingRecticleMesh;
