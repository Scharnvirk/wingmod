import classnames from 'classnames';
import React from 'react';


var StyledText = require('renderer/ui/component/base/StyledText');

class StartHelp extends React.Component {
    render() {
        var versionText = 'ver. ' + (Constants.VERSION || 'LOCAL BUILD');
        return <div style = {{bottom: '100px'}}>
            <div
                className={ classnames('class', ['centerHorizontal', 'topCenter', 'verticalSpacing']) }
            >
                <StyledText style={classnames('mediumText')}>
                    <span>{'CONTROLS:'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'WSAD: move the ship'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'Mouse left: fire primary weapon system'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'Mouse right: fire secondary weapon system'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'hold SHIFT + mouse left: change primary weapon'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'hold SHIFT + mouse right: change secondary weapon'}</span>
                </StyledText>
            </div>

            <div
                className={ classnames('class', ['centerHorizontal', 'bottomCenter', 'verticalSpacing']) }
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
