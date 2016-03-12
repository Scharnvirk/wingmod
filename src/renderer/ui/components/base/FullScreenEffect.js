import classnames from 'classnames';

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

module.exports = FullScreenEffect;
