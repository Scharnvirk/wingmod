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
            'plasma', 'energy', 'coolant', 'missileCore', 'radioactive'
        ];
    }

    componentWillMount() {
        PubSub.subscribe( 'reactHudAmmoChange', (msg, data) => {
            this.setState({
                ammo: data
            });
        });
        PubSub.subscribe( 'reactHudAmmoChange', (msg, data) => {
            this.setState({
                ammo2: data
            });
        });
        PubSub.subscribe( 'reactHudShow', () => {
            this.setState({
                visible: true
            });
        });

        setInterval(() =>{
            this.setState ({
                ammo: [
                   {
                       type: 'plasma',
                       amount: Utils.rand(0,100),
                       maxAmount: 100
                   },
                   {
                       type: 'energy',
                       amount: 100,
                   },
                   {
                       type: 'missileCore',
                       amount: 0,
                       maxAmount: 10
                   }
               ]
            });
        }, 16);
    }

    componentWillReceiveProps(props) {
    }

    createAmmoTiles(config) {
        var ammoConfigs = [];

        ammoConfigs = config.map(ammoConfig => {
            if (this.knownAmmoTypes.indexOf(ammoConfig.type) < 0) return null;
            return <AmmoTile

                type={ammoConfig.type}
                amount={ammoConfig.amount || 0}
                maxAmount={ammoConfig.maxAmount}
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
