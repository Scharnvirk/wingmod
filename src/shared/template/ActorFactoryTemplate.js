var idMap = {
    %%%idMapTemplate%%%
};

function ActorFactory(context, actorDependencies){
    this.actorDependencies = actorDependencies;
    %%%requireTemplate%%%

    this.actorMap = {
        %%%actorMapTemplate%%%
    };
}

ActorFactory.prototype.create = function(config){
    if(!this.actorMap[config.classId]){
        throw new Error("Cannot create actor. Bad configuration!". config);
    }
    return new this.actorMap[config.classId](config, this.actorDependencies);
};

module.exports = function(context){
    var returnObject = {};

    returnObject.getInstance = function(dependencies){
        return new ActorFactory(context, dependencies);
    };

    Object.keys(idMap).forEach(function(key){
        returnObject[key] = idMap[key];
    });

    return returnObject;
};