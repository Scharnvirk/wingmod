import classnames from 'classnames';

var StartScreen = require('renderer/ui/component/StartScreen');
var EndScreen = require('renderer/ui/component/EndScreen');
var FullScreenEffect = require('renderer/ui/component/base/FullScreenEffect');
var Viewport = require('renderer/ui/component/base/Viewport');
var Hud = require('renderer/ui/component/hud/Hud');

var ReactUtils = require('renderer/ui/ReactUtils');

var InitialView = React.createClass({
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
                <Hud/>
            </FullScreenEffect>
            {UIcontent}
        </div>;
    }
});

module.exports = InitialView;
