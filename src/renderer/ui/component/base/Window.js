import React, {Component} from 'react';

class Window extends Component {
    constructor(props, context) {
        super(props, context);        

        this.componentStyle = {
            window: {
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '90vmin',
                height: '60vmin' 
            },

            borderContainer: {
                opacity: 0.8
            },

            topBarLeft: {
                width: '30%',
                height: '0.5vmin',
                background: 'white',
                position: 'absolute'
            },

            topBarRight: {
                width: '30%',
                height: '0.5vmin',
                right: '0',
                background: 'white',
                position: 'absolute'
            },

            bottomBar: {
                width: '100%',
                height: '0.5vmin',
                bottom: '0',
                background: 'white',
                position: 'absolute'
            },

            leftTopSideBar: {
                width: '0.5vmin',
                height: '50px',
                background: 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))',
                position: 'absolute'
            },

            rightTopSideBar: {
                width: '0.5vmin',
                height: '50px',
                right: '0',
                background: 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))',
                position: 'absolute'                
            },

            leftBottomSideBar: {
                width: '0.5vmin',
                height: '50px',
                bottom: '0',
                background: 'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))',
                position: 'absolute'
            },

            rightBottomSideBar: {
                width: '0.5vmin',
                height: '50px',
                right: '0',
                bottom: '0',
                background: 'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))',
                position: 'absolute'                
            },

            titlebackgroundLeft: {
                width: '25%',
                maxWidth: '20%',
                left: '29.8%',                
                height: '10%',
                top: '-4.6%',
                backgroundImage: 'url("gfx/button_background_oneside.png")',
                backgroundSize: 'cover',
                position: 'absolute'   
            },

            titlebackgroundRight: {
                width: '25%',
                maxWidth: '20%',
                right: '29.8%',
                height: '10%',
                top: '-4.6%',
                backgroundImage: 'url("gfx/button_background_oneside.png")',
                backgroundSize: 'cover',
                transform: 'rotate(180deg)',
                position: 'absolute'
            },

            title: {
                textAlign: 'center',
                fontFamily: 'Oswald-Regular',
                fontSize: '4vmin',
                color: 'white',
                height: '10%',
                top: '-4.6%',
                margin: '0 auto',
                left: '0',
                right: '0',
                position: 'absolute'
            }
        };

        this.state = {
            visible: true
        };
    }

    render() {
        if (!this.state.visible) return null;

        let title = this.props.title || 'NO TITLE';

        return <div style={{position: 'relative'}}>
            <div style={this.componentStyle.borderContainer}>
                <div style={this.componentStyle.title}>{title}</div>
                <div style={this.componentStyle.titlebackgroundLeft}/>
                <div style={this.componentStyle.titlebackgroundRight}/>
                <div style={this.componentStyle.topBarLeft}/>
                <div style={this.componentStyle.topBarRight}/>
                <div style={this.componentStyle.leftTopSideBar}/>
                <div style={this.componentStyle.rightTopSideBar}/>
                <div style={this.componentStyle.bottomBar}/>
                <div style={this.componentStyle.leftBottomSideBar}/>
                <div style={this.componentStyle.rightBottomSideBar}/>
            </div>

            <div style={this.componentStyle.window}>
                {this.props.children}
            </div>
        </div>;
    }
    
}

module.exports = Window;
