import classnames from 'classnames';

var StyledText = require('renderer/ui/component/base/StyledText');
var ToggleButton = require('renderer/ui/component/base/ToggleButton');
var OptionButton = require('renderer/ui/component/base/OptionButton');

class SettingsMenu extends React.Component {
    render(){
        return <div style={{marginTop: '100px'}} className={'bottomCenter'}>

            <div style = {{width: '350px'}} className={'centerHorizontal'}>
                <div style = { {float:'left', marginTop: '6px'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <span className={'textDark'} >{'SHADOWS:'}</span>
                </StyledText> </div>
                <div style = { {float:'right'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <OptionButton buttonEvent={'shadowConfig'} options={['NONE', 'BASIC', 'SMOOTH']} defaultValue={1}/>
                </StyledText>  </div>
            </div>

            <div style = {{width: '350px'}} className={'centerHorizontal'}>
                <div style = { {float:'left', marginTop: '12px'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <span className={'textDark'} >{'RESOLUTION:'}</span>
                </StyledText> </div>
                <div style = { {float:'right'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <OptionButton buttonEvent={'resolutionConfig'} options={['LOW', 'MEDIUM', 'HIGH', 'TOO HIGH']} defaultValue={2}/>
                </StyledText>  </div>
            </div>

            <div style = {{width: '350px'}} className={'centerHorizontal'}>
                <div style = { {float:'left', marginTop: '12px'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <span className={'textDark'} >{'SOUND:'}</span>
                </StyledText> </div>
                <div style = { {float:'right'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <OptionButton buttonEvent={'soundConfig'} options={['OFF', 'SILENT', 'NORMAL', 'LOUD']} defaultValue={2}/>
                </StyledText>  </div>
            </div>

            <span style={{clear:'both'}}> {'asd'} </span>


        </div>;
    }
}

module.exports = SettingsMenu;
