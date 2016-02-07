function ShipActor(){
    BaseActor.apply(this, arguments);
    this.count = 0;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMesh = function(){
    return new RavierMesh({actor: this, scaleX: 6, scaleY: 6, scaleZ: 6});
};



ShipActor.prototype.customUpdate = function(){

    if(this.timer % 3 === 0){
        this.particleManager.createParticle('smokePuffAlpha',[this.position[0] + Utils.rand(-3,3), this.position[1] + Utils.rand(-3,3), 1,1,1, Utils.rand(5,20), 0.5, 60]);
    }





};
//     var naiveDistance = Math.abs(this.logicPosition[0] - this.logicPreviousPosition[0]) + Math.abs(this.logicPosition[1] - this.logicPreviousPosition[1]);
//
//     this.particleOptions.position.x = this.position[0];
//     this.particleOptions.position.y = this.position[1];
//
//     for (var x = 1; x < naiveDistance; x++) {
//           this.particleSystem.spawnParticle(this.particleOptions);
//           this.particleSystem.spawnParticle(this.particleOptions);
//           this.particleSystem.spawnParticle(this.particleOptions);
//           this.particleSystem.spawnParticle(this.particleOptions);
//     }
// };
