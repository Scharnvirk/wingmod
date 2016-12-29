import classnames from 'classnames';
import React from 'react';

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
        let blur = '';
        if(!this.state.noEffects){
            switch(this.props.blur){
                case 'start':
                    blur = 'blurStart';
                    break;
                case 'end':
                    setTimeout(function(){
                        this.setState({noEffects: true});
                    }.bind(this),2000);
                    blur = '';
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
