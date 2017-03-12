import React, {Component} from 'react';

var KillRow = require('renderer/ui/component/endGame/KillRow');
var DiedRow = require('renderer/ui/component/endGame/DiedRow');
var Summary = require('renderer/ui/component/endGame/Summary');

class EndGameWindow extends Component {
    constructor(props, context) {
        super(props, context);

        this.testKillStats = [
            {enemyIndex: 0, enemyName: 'M00-k', killCount: 5, pointWorth: 20},
            {enemyIndex: 1, enemyName: 'PEW2', killCount: 13, pointWorth: 30},
            {enemyIndex: 2, enemyName: 'ORBOT', killCount: 113, pointWorth: 10},
            {enemyIndex: 3, enemyName: 'BOUNCER', killCount: 5, pointWorth: 50},
            {enemyIndex: 4, enemyName: 'MADN-355', killCount: 5, pointWorth: 80},
            {enemyIndex: 5, enemyName: 'GATEWAY', killCount: 3, pointWorth: 1000}
        ];

        this.componentStyle = {
            window: {
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',      
                width: '60vw',
                height: '60vh' 
            },

            titleText: {
                fontFamily: 'Oswald-Regular',
                fontSize: '4vw',
                color: 'white'
            },

            killTable: {
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                height: '40vh'
            },

            header: {
                display: 'none', 
                flexDirection: 'column',
                alignItems: 'center',
                height: '15vh'
            },

            summary: {
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                height: '15vh'
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
        if (!this.state.visible) return null;
        return <div style={this.componentStyle.window}>
            <div style={this.componentStyle.header}>
                <DiedRow enemyCausingDeathIndex={this.props.enemyCausingDeathIndex}/>
            </div>
            <div style={this.componentStyle.killTable}>
                {this._createKillRows(this.props.killStats)}
            </div>
            <div style={this.componentStyle.summary}>
                <Summary/>
            </div>
        </div>;
    }

    _createKillRows(killData){
        killData = killData || [];

        if (killData.length === 0) {
            setTimeout(() => {
                PubSub.publish('summaryForceEnd');
            }, 500);            
        }

        let killRows = [];
        let i = 0;
        killData.forEach(killRow => {
            killRows.push(<KillRow 
                key={i}
                enemyIndex={killRow.enemyIndex} 
                enemyName={killRow.enemyName} 
                killCount={killRow.killCount} 
                pointWorth={killRow.pointWorth}
            />);
            i++;
        });

        return killRows;
    }
}

module.exports = EndGameWindow;
