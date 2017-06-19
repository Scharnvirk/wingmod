import React, {Component} from 'react';

class DiedRow extends Component {
    constructor(props, context) {
        super(props, context);

        this.enemyIconScale = 20;

        this.componentStyle = {
            row: {
                display: 'flex', 
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
            },

            text: {
                fontFamily: 'Oswald-ExtraLight',
                fontSize: '5vmin',
                color: 'white'
            },

            enemyIcon: {
                background: 'url("gfx/enemiesIcons.png") -###vh 0px',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                width: this.enemyIconScale + 'vmin',
                height: this.enemyIconScale + 'vmin'
            }
        };

        this.state = {
            visible: true,
            value: 0
        };
    }

    onChange(value) {
        this.setState({value: value});
    }

    render() {
        let offset = this.props.enemyCausingDeathIndex * this.enemyIconScale;
        let enemyIconStyle = this.componentStyle.enemyIcon;
        enemyIconStyle.background = enemyIconStyle.background.replace(/###/g, offset);

        if (!this.state.visible) return null;
        return <div style={this.componentStyle.row}>            
            <div style={this.componentStyle.text}>{'OWNED BY'}</div>
            <div style={enemyIconStyle}></div>
        </div>;
    }
}

module.exports = DiedRow;
