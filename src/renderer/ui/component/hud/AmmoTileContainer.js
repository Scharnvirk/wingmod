import React, {Component} from 'react';
import classnames from 'classnames';
import {Animate} from 'react-rebound';

var ReactUtils = require('renderer/ui/ReactUtils');
var imagePath = 'gfx/ammoHud.png';
var AmmoTile = require('renderer/ui/component/hud/AmmoTile');

class AmmoTileContainer extends Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {
            background: {
                width: '26vw',
                height: '100%',
                right: '0px',
                position: 'fixed',
                display: 'flex',
                flexDirection: 'column'
            }
        };

        this.state = {
            ammo: [],
            visible: false
        };

        this.knownAmmoTypes = [
            'plasma', 'energy', 'rads', 'shells'
        ];
    }

    componentWillMount() {
        PubSub.subscribe( 'hudAmmoChange', (msg, data) => {
            this.setState({
                ammo: data
            });
        });
        PubSub.subscribe( 'hudShow', () => {
            this.setState({
                visible: true
            });
        });
    }

    componentWillReceiveProps(props) {}

    createAmmoTiles(ammoConfig) {
        if(!ammoConfig || ammoConfig.length === 0){
            return [];
        }
        var ammoConfigs = [];

        ammoConfigs = Object.keys(ammoConfig.ammo).map(ammoType => {
            if (this.knownAmmoTypes.indexOf(ammoType) < 0) return null;
            return <AmmoTile
                type={ammoType}
                amount={Math.ceil(ammoConfig.ammo[ammoType] || 0)}
                maxAmount={ammoConfig.ammoMax[ammoType]}
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
