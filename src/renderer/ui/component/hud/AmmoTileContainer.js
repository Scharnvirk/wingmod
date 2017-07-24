import React, {Component} from 'react';

var ReactUtils = require('renderer/ui/ReactUtils');
var AmmoTile = require('renderer/ui/component/hud/AmmoTile');

class AmmoTileContainer extends Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {
            background: {
                height: '10%',
                right: '0px',
                position: 'fixed',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%'
            }
        };

        this.state = {
            ammo: [],
            visible: false
        };

        this.knownAmmoTypes = [
            'plasma', 'energy', 'missiles', 'coolant', 'rads', 'bullets'
        ];
    }

    componentWillMount() {
        PubSub.subscribe( 'hudStateChange', (msg, weaponInfo) => {
            this.setState({
                ammo: weaponInfo
            });
        });
        PubSub.subscribe( 'hudShow', () => {
            this.setState({
                visible: true
            });
        });
    }

    componentWillReceiveProps() {}

    createAmmoTiles(weaponInfo) {
        if(!weaponInfo || weaponInfo.length === 0){
            return [];
        }
        var ammoConfigs = [];

        ammoConfigs = Object.keys(weaponInfo.ammo).map(ammoType => {
            if (this.knownAmmoTypes.indexOf(ammoType) < 0) return null;
            return <AmmoTile
                key={ammoType}
                type={ammoType}
                amount={Math.ceil(weaponInfo.ammo[ammoType] || 0)}
                maxAmount={weaponInfo.ammoMax[ammoType]}
            />;
        });

        return ammoConfigs;
    }

    render() {
        if (!this.state.visible) return null;
        return <div style={this.componentStyle.background}>
            {this.createAmmoTiles(this.state.ammo)}
        </div>;
    }
}

module.exports = AmmoTileContainer;
