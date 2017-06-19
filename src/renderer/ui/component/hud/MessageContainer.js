import classnames from 'classnames';
import React, {Component} from 'react';
var ReactUtils = require('renderer/ui/ReactUtils');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group'); 

class MessageContainer extends Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {
            container: {
                textAlign: 'center',
                position: 'fixed',
                marginLeft: 'auto',
                marginRight: 'auto',
                left: '0',
                right: '0',
                width: '100%',
                wordWrap: 'normal',
                top: '10vh',
                marginBottom: '20px'
            },
            
            message: {
                textAlign: 'center',
                letterSpacing: '4px',
                fontSize: '20px',
                color: 'white',
                textShadow: '8px 8px 8px rgba(0, 0, 0, 0.6)',
                whiteSpace: 'nowrap',
                userDrag: 'none',
                userSelect: 'none',        
                fontFamily: 'Oswald-ExtraLight',
                opacity: 1
            }
        };

        this.currentMessageIndex = 0;

        this.state = {
            messages: {},
            message: null
        };
    }

    componentWillMount() {
        PubSub.subscribe( 'hudStateChange', (msg, data) => {
            if(data.message){
                this.setState({
                    message: data.message
                });
            }            
        });
        PubSub.subscribe( 'hudShow', () => {
            this.setState({
                visible: true
            });
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        let clear = nextState.clear;
        nextState.clear = false;
        return clear || nextState.message || Object.keys(nextState.messages).length !== Object.keys(this.state.messages).length;
    }   

    deleteMessage(messageIndex) {
        delete this.state.messages[messageIndex];
        this.setState({
            messages: this.state.messages,
            clear: true
        });
        this.render();
    }

    addMessage(){
        this.state.message.index = this.currentMessageIndex;
        this.state.message.style = Object.assign({}, this.componentStyle.message);
        this.state.message.style.color = this.state.message.color;
        this.state.message.style.opacity = 1;
        this.state.messages[this.currentMessageIndex] = this.state.message;
        
        delete (this.state.message);            
        setTimeout(this.deleteMessage.bind(this, this.currentMessageIndex), 3000);            
        if(Object.keys(this.state.messages).length > 3){
            delete this.state.messages[this.currentMessageIndex - 3];
        }
        this.currentMessageIndex ++;
    }

    render() {
        let items = [];
        if (this.state.message){
            this.addMessage();
        }

        Object.keys(this.state.messages).forEach(messageIndex => {
            items.push(                
                <div key={this.state.messages[messageIndex].index} style={this.state.messages[messageIndex].style}>
                    <span>{this.state.messages[messageIndex].text}</span>
                </div>                      
            );
        });

        return <div style={this.componentStyle.container}>
            {items}        
        </div>;
    }
}

module.exports = MessageContainer;

