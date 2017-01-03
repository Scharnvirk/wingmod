import React, {Component} from 'react';
import classnames from 'classnames';
import {Animate} from 'react-rebound';

var ReactUtils = require('renderer/ui/ReactUtils');
var imagePath = 'gfx/ammoHud.png';
var AmmoTile = require('renderer/ui/component/hud/AmmoTile');

class WeaponInfoContainer extends Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {
            background: {
                width: '10vw',
                height: '26vw%',
                left: this.props.x || '0',
                top: this.props.y || '0',
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
                       amount: Utils.rand(0,100)
                   },
                   {
                       type: 'energy',
                       amount: Utils.rand(0,100)
                   },
                   {
                       type: 'missileCore',
                        amount: Utils.rand(0,100)
                   }
               ],
               update: true
            });
        }, 500);
    }

    componentWillReceiveProps(props) {
    }

    shouldComponentUpdate(){
        if (this.state.update === true){
            this.state.update = false;
            return true;
        }
        return false;
    }

    createAmmoTiles(config) {
        var ammoConfigs = [];

        ammoConfigs = config.map(ammoConfig => {
            if (this.knownAmmoTypes.indexOf(ammoConfig.type) < 0) return null;
            return <AmmoTile
                type={ammoConfig.type}
                amount={ammoConfig.amount || 0}
            />;
        });

        return ammoConfigs;
    }

    render() {
        console.log("render");
        if (!this.state.visible) return null;

        return <div style={this.componentStyle.background}>
            {this.createAmmoTiles(this.state.ammo)}
        </div>;
    }
}

module.exports = WeaponInfoContainer;
