var Action = require('./Action');

const ActionLoop = function(frames, ...actions){
    for (let i = 0; i < frames; i++){
        actions.forEach(action => {
            if (!action instanceof Action) {
                console.warn("Supplied action is not of a class of Action");
            } else {
                action.run();
            }            
        });
    }
    actions.forEach(function(action){action.reset();});
};

module.exports = ActionLoop;