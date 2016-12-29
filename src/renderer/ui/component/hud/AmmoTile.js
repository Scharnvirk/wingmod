import React, {Component} from 'react';
import classnames from 'classnames';
import {Animate} from 'react-rebound';

var ReactUtils = require('renderer/ui/ReactUtils');
var imagePath = 'gfx/ammoHud.png';
var PubSub = require('pubsub-js');

class AmmoTile extends Component {
    constructor(props, context) {
        super(props, context);

        this.tileCount = 4;
        this.multiplier = 97.75; //investigate why - whould be 100

        this.iconIndexes = {
            plasma: 0,
            energy: 4,
            radioactive: 2,
            missileCore: 3,
            coolant: 1
        };

        this.colors = {
            plasma: '#00d681',
            energy: '#ffc04d',
            radioactive: '#8a4dff',
            missileCore: '#ff4d4d',
            coolant: '#8bc9ff'
        };

        this.componentStyle = {
            background: {
                width: '25vw',
                height: '4vw',
                position: 'relative',
                margin: '0.5vw 0.5vw 0.5vw 0.5vw',
            },
            icon: {
                height: '4vw',
                width: '4vw',
                position: 'absolute',
                right: '0',
                backgroundImage: 'url(' + imagePath + ')',
                backgroundSize: 'auto 100%',
            },
            text: {
                position: 'absolute',
                fontFamily: 'Oswald',
                fontSize: '2.5vw',
                right: '5vw',
                color: 'white'
            }
        };
    }

    componentWillReceiveProps(props) {}

    createIconStyle() {
        var positionOffset = ((this.iconIndexes[this.props.type] || 0 / this.tileCount) * this.multiplier) + '%';
        return Object.assign(
            this.componentStyle.icon,
            {
                backgroundPosition: positionOffset + ' 0'
            }
        );
    }

    createTextStyle() {
        return Object.assign(
            this.componentStyle.text,
            {
                color: this.colors[this.props.type || 'white']
            }
        );
    }

    render() {
        if (typeof this.props.amount === 'undefined') return null;

        var text = this.props.amount + (this.props.maxAmount ? ' / ' : ' ') + (this.props.maxAmount ? this.props.maxAmount : '');

        return <div style={this.componentStyle.background}>
            <div style={this.createIconStyle()}/>
            <div style={this.createTextStyle()}>{text}</div>
        </div>;
    }
}

module.exports = AmmoTile;
