import classnames from 'classnames';

var StartScreen = require('renderer/ui/components/StartScreen');
var EndScreen = require('renderer/ui/components/EndScreen');
var FullScreenEffect = require('renderer/ui/components/base/FullScreenEffect');
var Viewport = require('renderer/ui/components/base/Viewport');

var ReactUtils = require('renderer/ui/ReactUtils');

var Ui = React.createClass({
    render(){
        let UIcontent = [];
        switch(this.props.mode || 'startScreen'){
            case 'startScreen':
                UIcontent.push(<StartScreen key={ReactUtils.generateKey()} />);
                break;
            case 'gameOverScreen':
                UIcontent.push(<EndScreen key={ReactUtils.generateKey()} scoreText={ReactUtils.multilinize(this.props.context.scoreText)} />);
                break;
        }

        let blurState;
        switch(this.props.mode){
            case 'running':
                blurState = 'end';
                break;
            case 'gameOverScreen':
                blurState = 'start';
                break;
            default:
                blurState = 'on';
        }

        return <div>
            <FullScreenEffect blur={blurState}>
                <Viewport/>
            </FullScreenEffect>
            {UIcontent}
        </div>;
    }
});

module.exports = Ui;
