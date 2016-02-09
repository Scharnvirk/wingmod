function MookActor(){
    BaseActor.apply(this, arguments);
}

MookActor.extend(BaseActor);

MookActor.prototype.createMesh = function(){
    return new ShipMesh({actor: this, scaleX: 2, scaleY: 2, scaleZ: 2});
};
