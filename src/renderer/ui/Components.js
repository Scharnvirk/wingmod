import classnames from 'classnames';
var PubSub = require('pubsub-js');

class UiButton extends React.Component {
    render() {
        let classes = classnames('button', ['button', 'buttonText', 'Oswald']);
        return <div
            onClick={()=>{
                PubSub.publish('buttonClick', 'start');
            }}
            className={classes}
        >
            {this.props.text}
        </div>;
    }
}

var UiToggleButton = React.createClass({
    getInitialState(){
        return {
            active: false
        };
    },
    render() {
        let classes = classnames('button', ['button', 'buttonText', 'Oswald']);
        return <div
            onClick={()=>{
                PubSub.publish('buttonToggle', 'toggle');
            }}
            className={classes}
        >
            {this.props.text}
        </div>;
    }
});

var FullScreenEffect = React.createClass({
    getInitialState(){
        return {
            noEffects: false
        };
    },

    componentWillReceiveProps(newProps){
        if(newProps.blur === 'start' && this.state.noEffects){
            this.setState({noEffects: false});
        }
    },

    render(){
        console.log("rendering FullScreenEffect", this.props.blur);
        let blur = '';
        if(!this.state.noEffects){
            switch(this.props.blur){
                case 'start':
                    blur = 'blurStart';
                    break;
                case 'end':
                    setTimeout(function(){
                        console.log('set to true');
                        this.setState({noEffects: true});
                    }.bind(this),2000);
                    blur = 'blurEnd';
                    break;
                case 'on':
                    blur = 'blur';
                    break;
                default:
                    blur = '';
            }
        }


        return <div className={classnames('class', ['fullScreen', blur])}>
            {this.props.children}
        </div>;
    }
});

class StyledText extends React.Component {
    render() {
        let classes = classnames('title', [this.props.style, 'Oswald', 'noSelect']);
        return <div className={classes}>
            {this.props.children}
        </div>;
    }
}

class Viewport extends React.Component {
    render() {
        return <div id={'viewport'} className={classnames('class', ['fullScreen', 'allPointerEvents', 'noSelect']) } />;
    }
}



module.exports = {
    StyledText: StyledText,
    UiButton: UiButton,
    UiToggleButton: UiToggleButton,
    FullScreenEffect: FullScreenEffect,
    Viewport: Viewport
};
