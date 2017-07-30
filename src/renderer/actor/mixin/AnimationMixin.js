const AnimationMixin = {
    initAnimation: function() {
        this._animationMixer = new THREE.AnimationMixer(this.getMeshAt(0));
        this._animationClock = new THREE.Clock();
        this._animationActions = this._createActions();
    },

    updateAnimation: function(){
        this._animationMixer.update(this._animationClock.getDelta());
    },

    playAnimation: function(animationName) {
        if (!this._animationActions.hasOwnProperty(animationName)) throw new Error(`This actor has no animation ${animationName}`);
        this._animationActions[animationName].play();
    },
    
    cloneGeometry: function(geometry) {
        let clonedGeometry = geometry.clone();
        let bones = JSON.parse(JSON.stringify(geometry.bones));
        let skinWeights = JSON.parse(JSON.stringify(geometry.skinWeights));
        let skinIndices = JSON.parse(JSON.stringify(geometry.skinIndices));
        let animations = geometry.animations;

        animations.forEach(animation => {
            console.log(animation.tracks[0]);          
            animation.uuid = Utils.generateUUID();
        });

        skinWeights = skinWeights.map(x => { return new THREE.Vector4().copy(x); });
        skinIndices = skinIndices.map(x => { return new THREE.Vector4().copy(x); });
        Object.assign(clonedGeometry, {bones, skinWeights, skinIndices, animations });
        return clonedGeometry;
    },

    _createActions: function() {
        let actions = {};
        let animationConfig = this.props.render.animation;
        const geometry = this.getMeshAt(0).geometry;

        if (!animationConfig.animations) animationConfig.animations = {};

        Object.keys(animationConfig.animations).forEach(animation => {
            actions[animation] = this._animationMixer.clipAction(geometry.animations[ animationConfig.animations[animation] ]);
            actions[animation].setEffectiveWeight(1);
            actions[animation].enabled = true;
        });
        
        console.log('mesh: ',  this.getMeshAt(0));
        return actions;        
    }
};

module.exports = AnimationMixin ;