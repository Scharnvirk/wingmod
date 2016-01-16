function ShipActor(){
    BaseActor.apply(this, arguments);
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMesh = function(){
    return new ShipMesh({actor: this, scaleX: 4, scaleY: 4, scaleZ: 4});
};
