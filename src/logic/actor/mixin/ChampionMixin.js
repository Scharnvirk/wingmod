const ChampionMixin = {
    _championConstants: {
        championSpawnChance: 0.02
    },

    handleChampionUpdate: function() {
        if (!this.props.logic.championConfig) return;

        if (!this.state.champion) this.state.champion = {};
        if (!this.state.champion.currentGuards) this.state.champion.currentGuards = 0;

        if (this.state.champion.currentGuards < this.props.logic.championConfig.guardianCount) {
            if (Utils.rand(0,100) < (this._championConstants.championSpawnChance * 100)) {
                this._createGuardian();
            }
        }
    },

    championGuardianDead: function() {
        if (this.parent) {
            this.parent.onChildDeath();
        }
    },
    
    onChildDeath: function() {
        this.state.champion.currentGuards --;
    },

    _createGuardian: function() {
        // this.spawn({        
        //     classId: ActorFactory.ENEMY,
        //     subclassId: EnemyConfig.getSubclassIdFor(this.props.logic.championConfig.guardianType),
        //     angle: [0, 360],
        //     velocity: [15, 20],
        //     onChildDeath: function(){console.log("asd", this.parent);}
        // });

        this.spawn({
            classId: ActorFactory.ENEMYSPAWNMARKER, 
            angle: [0, 0],
            velocity: [0, 0],
            customConfig: {
                props: {
                    enemyClass: this.props.logic.championConfig.guardianType
                }
            }
        });

        this.state.champion.currentGuards ++;
    }
};

module.exports = ChampionMixin;