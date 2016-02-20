function PillarActor(){
    BaseActor.apply(this, arguments);
}

PillarActor.extend(BaseActor);

PillarActor.prototype.createMesh = function(){
    return new PillarMesh({actor: this});
};
