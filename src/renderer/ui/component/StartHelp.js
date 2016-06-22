import classnames from 'classnames';

var StyledText = require('renderer/ui/component/base/StyledText');

class StartHelp extends React.Component {
    render() {
        var versionText = 'ver. ' + (Constants.VERSION || 'LOCAL BUILD');
        return <div>
            <div
                className={ classnames('class', ['centerHorizontal', 'centerVertical', 'verticalSpacing']) }
            >
                <StyledText style={classnames('mediumText', 'textBlink')}>
                    <span>{'ACCEPT POINTER LOCK!'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'CHROME: Just click.'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'FIREFOX: Click and accept a popup dialog.'}</span>
                </StyledText>
            </div>
            <StyledText style={classnames('class', ['smallText', 'topRightCorner' ])}>
                <span className={'textDark'} >{versionText}</span>
            </StyledText>

        </div>;
    }
}

module.exports = StartHelp;
