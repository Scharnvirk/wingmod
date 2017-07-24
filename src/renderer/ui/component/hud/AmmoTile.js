import React, {Component} from 'react';
var imagePath = 'gfx/ammoHud.png';
var ReactUtils = require('renderer/ui/ReactUtils');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group'); 

class AmmoTile extends Component {
    constructor (props, context) {
        super (props, context);

        this.tileCount = 6;
        this.gain = false;

        /*
        Investigate why - should be 100.
        I offer a good beer to the one who solves that; for 5 tiles it was 0.975... 
        If it is 100 then all the icons are slightly but noticeably offset. What is interesting is that offset *decreased* when added one new icon.
        Refer to line 88 (or its victinity) for usage.
        Bizzare. 
        */
        this.multiplier = 0.984; 
        
        this.iconIndexes = {
            plasma: 0,
            energy: 1,
            rads: 3,
            missiles: 2,
            coolant: 4,
            bullets: 5,
        };

        this.colors = {
            plasma: '#00d681',
            energy: '#ffc04d',
            rads: '#8a4dff',
            missiles: '#ff4d4d',
            coolant: '#8bc9ff',
            bullets: '#d4d4d4'
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
        /**
         * 
         * 0: 0%
            1: 20%
            2: 40%
            3: 60%
            4: 80%
            5: 100%
         */

        const oneTileOffset = 100 / (this.tileCount - 1);
        const positionOffset = this.iconIndexes[this.props.type] * oneTileOffset * this.multiplier + '%';
        
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
