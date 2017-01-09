var BaseActor = require('renderer/actor/BaseActor');

function ItemSpawnerActor(){
    BaseActor.apply(this, arguments);
}

ItemSpawnerActor.extend(BaseActor);

module.exports = ItemSpawnerActor;
