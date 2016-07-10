// Purpose of this tool is to construct an ActorFactory class file which can be parsed by browserify.
// Unlike raw node.js which accepts parameters for require function, browserify does not.
// Because actors live both in logic and rederer space
// but there is one unified factory for them, it has to know both context,
// thus the need to require them both.
// ...and because Actors list constantly evolves, I got tired of fixing it manually every time ;p

/*jslint node: true */
'use strict';

var sprintf = require('sprintf');
var fsp = require('fs-promise');
var actorList = require('../src/shared/ActorList');

function ActorFactoryBuilder(){
    this.actorFactoryTemplatePath = 'src/shared/template/ActorFactoryTemplate.js';
    this.actorFactoryOutputPath = 'src/shared/ActorFactory.js';

    this.idMapTemplateString = '%%%idMapTemplate%%%';
    this.requireTemplate = '%%%requireTemplate%%%';
    this.actorMapString = '%%%actorMapTemplate%%%';

    this.topComment = 'This is an auto-generated template file. Any changes will be overwritten!';

    return this;
}

ActorFactoryBuilder.prototype.build = function(){
    fsp.readFile(this.actorFactoryTemplatePath, 'utf-8').
    then(this.makeNewFactoryContents.bind(this), this.onError).
    then(this.saveFactory.bind(this), this.onError).
    then(result => {console.log("New actor factory built successfully!");}, this.onError);
};

ActorFactoryBuilder.prototype.makeNewFactoryContents = function(templateContent){
    var core = templateContent.replace(this.idMapTemplateString, this.buildIdMaps()).
    replace(this.requireTemplate, this.buildRequires()).
    replace(this.actorMapString, this.buildActorMaps());
    return sprintf('//%s\n\n%s', this.topComment, core);
};

ActorFactoryBuilder.prototype.saveFactory = function(newFactoryContent){
    return fsp.writeFile(this.actorFactoryOutputPath, newFactoryContent);
};

ActorFactoryBuilder.prototype.onError = function(error){
    console.log(error);
};


//desired output (1 line): SHIP: 1,
ActorFactoryBuilder.prototype.buildIdMaps = function(){
    var idMapString = '';
    var currentId = 1;

    actorList.forEach(actorPath => {
        let actorName = actorPath.split('/').pop().toUpperCase().replace('ACTOR', '');
        idMapString += sprintf('%s: %d,\n', actorName, currentId++);
    });

    return idMapString;
};

//desired output (1 line): ActorFactory.ShipActor = context === 'renderer' ? require("renderer/actor/player/ShipActor") : require("logic/actor/player/ShipActor");
ActorFactoryBuilder.prototype.buildRequires = function(){
    var requires = '';
    var constantPart = 'ActorFactory.%s = context === \'renderer\' ? require("renderer/%s") : require("logic/%s");\n';

    actorList.forEach(actorPath => {
        let actorClass = actorPath.split('/').pop();
        requires += sprintf(constantPart, actorClass, actorPath, actorPath);
    });

    return requires;
};

//desired output (1 line): [idMap.SHIP]: ActorFactory.ShipActor,
ActorFactoryBuilder.prototype.buildActorMaps = function(){
    var actorMaps = '';

    actorList.forEach(actorPath => {
        let actorClass = actorPath.split('/').pop();
        let actorName = actorPath.split('/').pop().toUpperCase().replace('ACTOR', '');
        actorMaps += sprintf('[idMap.%s]: ActorFactory.%s,\n', actorName, actorClass);
    });

    return actorMaps;
};


var builder = new ActorFactoryBuilder().build();
