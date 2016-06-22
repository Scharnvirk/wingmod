import classnames from 'classnames';

var StyledText = require('renderer/ui/component/base/StyledText');
var ToggleButton = require('renderer/ui/component/base/ToggleButton');

class SettingsMenu extends React.Component {
    render(){
        return <div
            className={classnames('class', ['centerVertical'])}
            style={ {marginTop:'150px'} }
        >
            <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                <span className={'textDark'} >{'Settings'}</span>
            </StyledText>
            <ToggleButton text={'No shadows'} buttonEvent={'noShadows'}/>
            <ToggleButton text={'Low-res'} buttonEvent={'lowRes'}/>
            <ToggleButton text={'No sound'} buttonEvent={'noSound'}/>
        </div>;
    }
}

module.exports = SettingsMenu;
