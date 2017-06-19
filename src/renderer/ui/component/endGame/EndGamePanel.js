import React, {Component} from 'react';

var KillRow = require('renderer/ui/component/endGame/KillRow');
var DiedRow = require('renderer/ui/component/endGame/DiedRow');
var Summary = require('renderer/ui/component/endGame/Summary');

class EndGamePanel extends Component {
    constructor(props, context) {
        super(props, context);

        this.testKillStats = [
            {enemyIndex: 0, enemyName: 'M00-k', killCount: 5, pointWorth: 20},
            {enemyIndex: 1, enemyName: 'PEW2', killCount: 13, pointWorth: 30},
            {enemyIndex: 2, enemyName: 'ORBOT', killCount: 13, pointWorth: 10},
            {enemyIndex: 3, enemyName: 'BOUNCER', killCount: 5, pointWorth: 50},
            {enemyIndex: 4, enemyName: 'MADN-355', killCount: 5, pointWorth: 80}
        ];

        this.componentStyle = {
            panel: {
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',    
                width: '90%',
                height: '90%' 
            },

            titleText: {
                fontFamily: 'Oswald-ExtraLight',
                fontSize: '6vmin',
                color: 'white'
            },

            killTable: {
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                height: '80%'
            },

            summary: {
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                height: '20%'
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
        return <div style={this.componentStyle.panel}>
            <div style={this.componentStyle.killTable}>
                {this._createKillRows(this.props.killStats)}
            </div>
            <div style={this.componentStyle.summary}>
                <Summary/>
            </div>
        </div>;
    }

    _createKillRows(killData){
        killData = killData || this.testKillStats;

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
                enemyCount={killData.length}
            />);
            i++;
        });

        return killRows;
    }
}

module.exports = EndGamePanel;
