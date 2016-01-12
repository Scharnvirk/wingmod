function LightActor(){
    BaseActor.apply(this, arguments);
}

LightActor.extend(BaseActor);

LightActor.prototype.createLight = function(){
    return new BaseLight({actor: this, intensity: 0});
};
