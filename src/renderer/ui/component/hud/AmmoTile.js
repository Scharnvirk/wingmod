import React, {Component} from 'react';
var imagePath = 'gfx/ammoHud.png';
var ReactUtils = require('renderer/ui/ReactUtils');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group'); 

class AmmoTile extends Component {
    constructor (props, context) {
        super (props, context);

        this.tileCount = 4;
        this.multiplier = 97.75; // investigate why - whould be 100
        this.gain = false;

        this.iconIndexes = {
            plasma: 0,
            energy: 4,
            rads: 2,
            missiles: 3,
            coolant: 1
        };

        this.colors = {
            plasma: '#00d681',
            energy: '#ffc04d',
            rads: '#8a4dff',
            missiles: '#ff4d4d',
            coolant: '#8bc9ff'
        };

        this.componentStyle = {
            background: {
                width: '9vw',
                height: '1.5vw',
                position: 'relative',
                margin: '0.5vw 0.5vw 0.5vw 0.5vw',
            },
            icon: {
                height: '2vw',
                width: '2vw',
                position: 'absolute',
                right: '0',
                backgroundImage: 'url(' + imagePath + ')',
                backgroundSize: 'auto 100%',
            },
            text: {
                position: 'absolute',
                fontFamily: 'Oswald-ExtraLight',
                fontSize: '1.25vw',
                right: '2.5vw',
                marginTop: '0.2vw'
            }
        };
    }

    componentWillReceiveProps() {}

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.amount > this.props.amount){
            this.gain = true;
        } else {
            this.gain = false;
        }
        return this.props.amount !== nextProps.amount;
    }   

    createIconStyle() {
        var positionOffset = ((this.iconIndexes[this.props.type] || 0 / this.tileCount) * this.multiplier) + '%';
        return Object.assign(
            this.componentStyle.icon,
            {
                backgroundPosition: positionOffset + ' 0',
                color: this.colors[this.props.type || 'white']
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
        let text = this.props.amount + (this.props.maxAmount ? ' / ' : ' ') + (this.props.maxAmount ? this.props.maxAmount : '');

        return <div style={this.componentStyle.background}>
            <div style={this.createIconStyle()}/>
            <div key={ReactUtils.generateKey()} style={this.createTextStyle()}>{text}</div>            
        </div>;
    }
}

module.exports = AmmoTile;
