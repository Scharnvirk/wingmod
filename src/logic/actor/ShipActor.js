function ShipActor(configArray){
    configArray = configArray || [];
    BaseActor.apply(this, arguments);
}

ShipActor.extend(BaseActor);
