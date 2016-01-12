function LightActor(configArray){
    configArray = configArray || [];
    BaseActor.apply(this, arguments);
}

LightActor.extend(BaseActor);
