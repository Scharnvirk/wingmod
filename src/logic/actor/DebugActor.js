var BaseActor = require('logic/actor/BaseActor');
var BaseBody = require('logic/actor/component/body/BaseBody');

function DebugActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);
}

DebugActor.extend(BaseActor);

DebugActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Circle({
            radius: 0,
        }),
        actor: this,
        mass: 0
    });
};

module.exports = DebugActor;
