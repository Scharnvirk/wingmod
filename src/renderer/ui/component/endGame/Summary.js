import React, {Component} from 'react';

class Summary extends Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {
            totalText: {
                fontFamily: 'Oswald-Regular',
                fontSize: '5vmin',
                color: 'white',
                textAlign: 'center'
            },

            flavourText: {
                fontFamily: 'Oswald-Regular',
                fontSize: '3vmin',
                color: 'white',
                textAlign: 'center'
            }
        };

        this.state = {
            visible: true,
            value: 0,
            flavourText: '',
            waitingForSummaries: -1
        };
    }

    componentWillMount() {
        PubSub.subscribe( 'addFinalPoints', (msg, data) => {
            this.setState({
                value: this.state.value + data
            });
        });
        PubSub.subscribe( 'summaryBegin', (msg, data) => {
            this.setState({
                waitingForSummaries: this.state.waitingForSummaries < 0 ? 1 : this.state.waitingForSummaries + 1
            });
        });
        PubSub.subscribe( 'summaryEnd', (msg, data) => {
            this.setState({
                waitingForSummaries: this.state.waitingForSummaries - 1
            });
            if (this.state.waitingForSummaries === 0){
                this.setState({
                    flavourText: this._createFlavourText(this.state.value)
                });
            }
        });
        PubSub.subscribe( 'summaryForceEnd', (msg, data) => {
            this.setState({
                flavourText: this._createFlavourText(this.state.value)
            });
        });
    }

    onChange(value) {
        this.setState({value: value});
    }

    render() {
        if (!this.state.visible) return null;
        return <div style={this.componentStyle.row}>            
            <div style={this.componentStyle.totalText}>{'TOTAL: ' + this.state.value + ' $'}</div>
            <div style={this.componentStyle.flavourText}>{this.state.flavourText}</div>
        </div>;
    }

    _createFlavourText(points){
        if (points === 0) {
            return 'You were not even trying!';
        } else if (points > 0 && points <= 100) {
            return 'First blood!';
        } else if (points > 100 && points <= 200) {
            return 'Do you know you have two weapons?';
        } else if (points > 200 && points <= 500) {
            return 'Maybe try strafing!';
        } else if (points > 500 && points <= 1000) {
            return 'Not bad, but I bet you can do better!';
        } else if (points > 1000 && points <= 2000) {
            return 'They are quite bent on killing you, aren\'t they?';
        } else if (points > 2000 && points <= 3000) {
            return 'You are getting good in this';
        } else if (points > 3000 && points <= 5000) {
            return 'Very good! Great shooting!';
        } else if (points > 5000 && points <= 7000) {
            return 'SUPERB! That is some serious score!';
        } else {
            return 'Out of measure. Seriously. Top notch!';
        }
    }
}

module.exports = Summary;
