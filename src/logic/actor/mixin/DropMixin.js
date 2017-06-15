var ActorFactory = require('shared/ActorFactory')('logic');

var DropMixin = {
    handleDrops: function(dropConfig){
        if ( !(dropConfig instanceof Array) ) return;

        dropConfig.forEach(drop => {
            this.spawn({
                amount: drop.amount || 1,
                probability: drop.probability || 1,
                classId: ActorFactory[drop.class],
                angle: [0, 360],
                velocity: [50, 100]
            });
        });        
    }
};

module.exports = DropMixin;