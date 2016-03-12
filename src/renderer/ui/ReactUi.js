import classnames from 'classnames';

var UiButton = require('renderer/ui/Components').UiButton;
var StyledText = require('renderer/ui/Components').StyledText;
var FullScreenEffect = require('renderer/ui/Components').FullScreenEffect;
var Viewport = require('renderer/ui/Components').Viewport;

var currentKey = 0;

function ReactUi(){
    Utils.mixin(this, THREE.EventDispatcher);
    this.Ui = <Ui/>;
    this.render();

}

ReactUi.prototype.render = function(){
    ReactDOM.render(
        this.Ui,
        document.getElementById('react-content')
    );
};

ReactUi.prototype.changeMode = function(newMode, context){
    var additionalConfig = context || null;
    this.Ui = <Ui mode={newMode} context={context}/>;
    this.render();
};

var generateKey = function(){
    return currentKey ++;
};

var multilinize = function(multilineString){
    return multilineString.split('\n').map(function(item) {
        return (
            <span key={generateKey()}>
            {item}
            <br/>
            </span>
        );
    });
};

var Ui = React.createClass({
    render(){
        let UIcontent = [];
        switch(this.props.mode || 'startScreen'){
            case 'startScreen':
                UIcontent.push(<StartScreen key={generateKey()} />);
                break;
            case 'gameOverScreen':
                UIcontent.push(<EndScreen key={generateKey()} scoreText={multilinize(this.props.context.scoreText)} />);
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

class StartScreen extends React.Component {
    render() {
        return <div className={classnames('class', ['centerHorizontal', 'centerVertical'])}>
            <StyledText style={'titleText'}>
                <span>{'WINGMOD'}</span>
                <span style={{color: 'red'}}>{'2'}</span>
            </StyledText>
            <UiButton text={'START'}/>
        </div>;
    }
}

class EndScreen extends React.Component {
    render() {
        return <div className={classnames('class', ['centerHorizontal', 'centerVertical'])}>
            <StyledText style={'titleText'}>
                {'GAME OVER'}
            </StyledText>
            <StyledText style={'scoreText'}>
                {this.props.scoreText}
            </StyledText>
        </div>;
    }
}

module.exports = ReactUi;

//https://blog.risingstack.com/the-react-way-getting-started-tutorial/
//http://hugogiraudel.com/2015/06/18/styling-react-components-in-sass/
//http://sass-guidelin.es/#architecture
//https://css-tricks.com/the-debate-around-do-we-even-need-css-anymore/
