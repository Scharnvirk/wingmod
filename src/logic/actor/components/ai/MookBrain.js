var BaseBrain = require("logic/actor/components/ai/BaseBrain");

function MookBrain(config){
    Object.assign(this, config);
    BaseBrain.apply(this, arguments);

    this.timer = 0;
}

MookBrain.extend(BaseBrain);

MookBrain.prototype.update = function(){
    this.timer ++;

    if(this.timer % 2 === 0){
        this.orders.lookAtPlayer = !this.isWallBetween(this.actor.body.position, this.playerActor.body.position);

        let distance = Utils.distanceBetweenPoints(this.actor.body.position[0], this.playerActor.body.position[0], this.actor.body.position[1], this.playerActor.body.position[1]);
        this.orders.forward = distance > 90;
        this.orders.backward = distance < 40;
    }

};

module.exports = MookBrain;
