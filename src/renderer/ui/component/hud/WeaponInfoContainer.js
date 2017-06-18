import React, {Component} from 'react';
import classnames from 'classnames';

const WeaponConfig = require('shared/WeaponConfig');

class WeaponInfoContainer extends Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {

            background: {
                position: 'fixed',
                display: 'flex',
                width: '100%',
                height: '10%',
                justifyContent: 'space-between'
            },

            leftWeaponBox: {
                width: '50%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '0.5vw'
            },

            rightWeaponBox: {
                width: '50%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                marginRight: '0.5vw'
            },

            activeWeapon: {
                fontFamily: 'Oswald',
                fontSize: '2vw',
                color: 'rgba(255, 255, 255, 0.8)'
            },

            inactiveWeapon: {
                fontFamily: 'Oswald',
                fontSize: '1.5vw',
                color: 'rgba(255, 255, 255, 0.4)'
            }
        };

        this.state = {
            weapons: {
                primaryActive: 'NONE',
                primaryInactive: 'NONE',
                secondaryActive: 'NONE',
                secondaryInactive: 'NONE'   
            },
            visible: false
        };
    }

    componentWillMount() {
        PubSub.subscribe( 'hudStateChange', (msg, weaponInfo) => {

            const activePrimaryWeaponIndex = weaponInfo.weaponSystems[0].currentWeaponIndex;
            const activeSecondaryWeaponIndex = weaponInfo.weaponSystems[1].currentWeaponIndex;

            const inactivePrimaryWeaponIndex = activePrimaryWeaponIndex === 0 ? 1 : 0;
            const inactiveSecondaryWeaponIndex = activeSecondaryWeaponIndex === 0 ? 1 : 0;

            this.setState({
                weapons: {
                    primaryActive: WeaponConfig[weaponInfo.weaponSystems[0].weapons[activePrimaryWeaponIndex]].name,
                    primaryInactive: WeaponConfig[weaponInfo.weaponSystems[0].weapons[inactivePrimaryWeaponIndex]].name,
                    secondaryActive: WeaponConfig[weaponInfo.weaponSystems[1].weapons[activeSecondaryWeaponIndex]].name,
                    secondaryInactive: WeaponConfig[weaponInfo.weaponSystems[1].weapons[inactiveSecondaryWeaponIndex]].name   
                },
            });
        });
        PubSub.subscribe( 'hudShow', () => {
            this.setState({
                visible: true
            });
        });
    }

    componentWillReceiveProps() {}

    render() {
        if (!this.state.visible) return null;

        return <div style={this.componentStyle.background}>
            <div style={this.componentStyle.leftWeaponBox}>
                <div style={this.componentStyle.activeWeapon}>{this.state.weapons.primaryActive}</div>
                <div style={this.componentStyle.inactiveWeapon}>{this.state.weapons.primaryInactive}</div>
            </div>

            <div style={this.componentStyle.rightWeaponBox}>
                <div style={this.componentStyle.activeWeapon}>{this.state.weapons.secondaryActive}</div>
                <div style={this.componentStyle.inactiveWeapon}>{this.state.weapons.secondaryInactive}</div>
            </div>
        </div>;
    }
}

module.exports = WeaponInfoContainer;
