import classnames from 'classnames';

var StyledText = require('renderer/ui/components/base/StyledText');
var Button = require('renderer/ui/components/base/Button');
var ToggleButton = require('renderer/ui/components/base/ToggleButton');
var ReactUtils = require('renderer/ui/ReactUtils');

var BOTTOM_TEXT = ReactUtils.multilinize(
    'Wingmod 2 is a little experimental project aimed at learning'+
    '\nand experimenting with various web technologies.\n'+
    '\n'+
    'Please note that this project depends very heavily on WebGL, so it works best on a PC.\n'+
    'No mobile support is planned as keyboard and mouse are essential, but for debug you can try it.\n'+
    '\n'+
    'Some frameworks were surely and painfully harmed in the making of this... thing.\n'
);

class StartScreen extends React.Component {
    render() {
        return <div>
            <div
                className={ classnames('class', ['centerHorizontal', 'centerVertical', 'verticalSpacing']) }
            >
                <StyledText style={'titleText'}>
                    <span>{'WINGMOD'}</span>
                    <span style={{color: 'red'}}>{'2'}</span>
                </StyledText>
                <Button text={'START GAME'} buttonEvent={'start'}/>
                <SettingsMenu/>
            </div>
            <StyledText style={classnames('class', ['smallText', 'centerHorizontal', 'bottomVertical' ])}>
                <span className={'textDark'} >{BOTTOM_TEXT}</span>
            </StyledText>
        </div>;
    }
}

class SettingsMenu extends React.Component {
    render(){
        return <div
            className={classnames('class', ['centerVertical'])}
            style={ {marginTop:'150px'} }
        >
            <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                <span className={'textDark'} >{'Performance settings'}</span>
            </StyledText>
            <ToggleButton text={'No shadows'} buttonEvent={'shadowConfig'}/>
            <ToggleButton text={'Low-res'} buttonEvent={'lowResConfig'}/>
            <ToggleButton text={'Less particles'} buttonEvent={'lowParticlesConfig'}/>
        </div>;
    }
}

module.exports = StartScreen;
