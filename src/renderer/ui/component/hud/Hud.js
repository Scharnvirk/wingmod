import classnames from 'classnames';

var PubSub = require('pubsub-js');

class Hud extends React.Component {

    constructor(properties) {
        super(properties);
        this.width = document.documentElement.clientWidth;
        this.height = document.documentElement.clientHeight;

        this.setupListener();
    }

    setupListener() {
        PubSub.subscribe('hud', (msg, data) => {

        });
    }

    render() {
        return <canvas
            id = {'hud'}
            width = {this.width}
            height = {this.height}
            className = {
                classnames(
                    'class',
                    ['fullScreen', 'noSelect']
                )
            }
        />;
    }

    onSetHudOpen(keyStatus) {

    }
}

module.exports = Hud;
