var ShowDamageMixin = {
    _mixinInstanceValues: {
        _lastHp: 0
    },
    showDamage: function(withFlash){
        if(withFlash){
            if(this.state.hp < this._lastHp){
                this.requestUiFlash('red');
            }
        }

        let damageRandomValue = Utils.rand(0, 100) - 100 * (this.state.hp / this.props.hp);
        if (damageRandomValue > 20){
            this.createPremade({premadeName: 'SmokePuffSmall'});
        }

        if (damageRandomValue > 50 && Utils.rand(0,100) > 95){
            this.createPremade({premadeName: 'BlueSparks'});
        }

        this._lastHp = this.state.hp;
    }
};

module.exports = ShowDamageMixin;